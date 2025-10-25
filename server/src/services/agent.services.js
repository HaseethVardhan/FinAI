import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { config } from "dotenv";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { User } from "../models/user.model.js";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
// import {User} from "../models/user.model.js"
import {
  getAgeService,
  getIncomeService,
  getExpensesService,
  getAssetsService,
  getLiabilitiesService,
  getInsuranceService,
  getDependentsService,
  getGoalsService,
  getEmergencyFundService,
  getCreditScoreService,
} from "./user.services.js";

config();

let userId = null;

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-2.5-flash",
  maxOutputTokens: 2048,
});

const netWorthSnapshot = tool(
  async () => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");

    const user = await User.findById(userId)
      .populate(
        "assets.investments assets.otherAssets liabilities.loans liabilities.creditCards"
      )
      .lean();

    if (!user) throw new Error("user not found");

    const cash = Number(user.assets?.bankBalance ?? 0);
    const investmentsValue = (user.assets?.investments || []).reduce(
      (s, it) => s + Number(it?.amount ?? 0),
      0
    );
    const otherAssetsValue = (user.assets?.otherAssets || []).reduce(
      (s, it) => s + Number(it?.amount ?? 0),
      0
    );

    const totalAssets = cash + investmentsValue + otherAssetsValue;

    const loansTotal = (user.liabilities?.loans || []).reduce(
      (s, l) => s + Number(l?.outstanding ?? 0),
      0
    );
    const ccTotal = (user.liabilities?.creditCards || []).reduce(
      (s, c) => s + Number(c?.balance ?? 0),
      0
    );
    const totalLiabilities = loansTotal + ccTotal;

    const netWorth = totalAssets - totalLiabilities;

    return {
      cash,
      investmentsValue,
      otherAssetsValue,
      totalAssets,
      totalLiabilities,
      netWorth,
      inputsUsed: [
        "assets.bankBalance",
        "assets.investments",
        "assets.otherAssets",
        "liabilities",
      ],
      lastUpdated: new Date().toISOString(),
      confidence: 0.95,
    };
  },
  {
    name: "netWorthSnapshot",
    description: "Computes a one-shot net-worth snapshot for the user.",
    // schema: z.object({
    //   userId: z.string("the id of the user"),
    // }),
  }
);

const liquidityAndBuffer = tool(
  async ({recommendedMonths = 6 }) => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid or missing userId");
    }

    const user =
      (await User.findById(userId).populate?.("income.sources")?.lean?.()) ??
      (await User.findById(userId).lean());
    if (!user) {
      throw new Error("User not found");
    }

    const bankBalance = Number(user.assets?.bankBalance ?? 0);
    const emergencyFund = Number(user.emergencyFund ?? 0);

    let monthlyIncome = 0;
    const incomeSources = user.income?.sources ?? [];

    if (Array.isArray(incomeSources) && incomeSources.length > 0) {
      monthlyIncome = incomeSources.reduce((sum, src) => {
        const candidate = Number(
          src?.lastKnownMonthly ??
            src?.monthly ??
            src?.amount ??
            src?.value ??
            0
        );
        return sum + (Number.isFinite(candidate) ? candidate : 0);
      }, 0);
    }

    if (!monthlyIncome) {
      monthlyIncome = Number(user.incomeDeclared ?? user.monthlyIncome ?? 0);
    }

    const liquidCash = Number((bankBalance + emergencyFund).toFixed(2));
    const coverageMonths =
      monthlyIncome > 0
        ? Number((liquidCash / monthlyIncome).toFixed(2))
        : null;

    const confidence = monthlyIncome > 0 ? 0.9 : 0.6;

    return {
      liquidCash,
      emergencyFundCoverageMonths: coverageMonths,
      recommendedEmergencyFundMonths: Number(recommendedMonths),
      inputsUsed: [
        "assets.bankBalance",
        "emergencyFund",
        "income.sources",
        "incomeDeclared",
      ],
      lastUpdated: new Date().toISOString(),
      confidence,
    };
  },
  {
    name: "liquidityAndBuffer",
    description:
      "Compute liquid cash and emergency fund coverage (months) from a static user snapshot.",
    schema: z.object({
    //   userId: z.string().min(1, "the id of the user"),
      recommendedMonths: z.number().int().min(1).optional(),
    }),
  }
);

const debtProfile = tool(
  async () => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");

    const user = await User.findById(userId)
      .populate("liabilities.loans liabilities.creditCards")
      .lean();
    if (!user) throw new Error("user not found");

    const loans = user.liabilities?.loans || [];
    const cards = user.liabilities?.creditCards || [];

    const loansTotal = loans.reduce(
      (s, l) => s + Number(l?.outstanding ?? 0),
      0
    );
    const cardsTotal = cards.reduce((s, c) => s + Number(c?.balance ?? 0), 0);
    const totalDebt = loansTotal + cardsTotal;

    // weighted avg interest: use outstanding as weight
    let interestSum = 0;
    let weightSum = 0;
    [...loans, ...cards].forEach((d) => {
      const amt = Number(d?.outstanding ?? d?.balance ?? 0);
      const rate = Number(d?.interestRate ?? d?.rate ?? 0);
      if (amt > 0 && rate > 0) {
        interestSum += rate * amt;
        weightSum += amt;
      }
    });
    const avgInterestRate =
      weightSum > 0 ? Number((interestSum / weightSum).toFixed(3)) : 0;

    // credit utilization: sum balances / sum limits
    const totalCardLimits = cards.reduce(
      (s, c) => s + Number(c?.limit ?? 0),
      0
    );
    const utilizationPct =
      totalCardLimits > 0
        ? Number(((cardsTotal / totalCardLimits) * 100).toFixed(2))
        : null;

    const HIGH_RATE_THRESHOLD = 15; // percent — heuristic
    const highInterestDebt = [...loans, ...cards]
      .filter(
        (d) => Number(d?.interestRate ?? d?.rate ?? 0) >= HIGH_RATE_THRESHOLD
      )
      .map((d) => ({
        id: d._id,
        amount: Number(d?.outstanding ?? d?.balance ?? 0),
        rate: Number(d?.interestRate ?? d?.rate ?? 0),
      }));

    return {
      totalDebt,
      avgInterestRate,
      creditUtilizationPct: utilizationPct,
      highInterestDebt,
      inputsUsed: ["liabilities.loans", "liabilities.creditCards"],
      lastUpdated: new Date().toISOString(),
      confidence: 0.9,
    };
  },
  {
    name: "debtProfile",
    description:
      "Static snapshot of user debt, avg interest, utilization and high-interest debt list.",
    // schema: z.object({
    //   userId: z.string("the id of the user"),
    // }),
  }
);

const affordabilityChecker = tool(
  async ({purchaseAmount }) => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");
    if (typeof purchaseAmount !== "number" || Number.isNaN(purchaseAmount))
      throw new Error("purchaseAmount must be a number");

    const net = (await netWorthSnapshot.run)
      ? await netWorthSnapshot.run({ userId })
      : await netWorthSnapshot({ userId }); // defensive if tool wrapper gives run()
    // but since netWorthSnapshot is a tool wrapper, we call underlying logic again by fetching user directly to avoid tool-run middleware mismatch:
    const user = await User.findById(userId).populate("income.sources").lean();
    if (!user) throw new Error("user not found");

    const bank = Number(user.assets?.bankBalance ?? 0);
    const emergencyFund = Number(user.emergencyFund ?? 0);
    const liquid = bank + emergencyFund;

    const monthlyIncome =
      (user.income?.sources || []).reduce(
        (s, src) =>
          s + Number(src?.lastKnownMonthly ?? src?.monthly ?? src?.amount ?? 0),
        0
      ) ||
      Number(user.incomeDeclared ?? 0) ||
      0;

    const canAffordNow = liquid >= purchaseAmount;
    const cashPart = Math.min(liquid, purchaseAmount);
    const loanPart = Math.max(0, purchaseAmount - cashPart);

    const afterLiquid = liquid - cashPart;
    const impactOnEmergencyCoverageMonths =
      monthlyIncome > 0
        ? Number((afterLiquid / monthlyIncome || 0).toFixed(2))
        : null;

    return {
      canAffordNow,
      suggestedFundingMix: { cash: cashPart, loan: loanPart },
      impactOnEmergencyCoverageMonths,
      inputsUsed: ["assets.bankBalance", "emergencyFund", "income.sources"],
      lastUpdated: new Date().toISOString(),
      confidence: 0.85,
    };
  },
  {
    name: "affordabilityChecker",
    description:
      "Static affordability checker — decides if a user can fund a one-time purchase now and returns suggested cash/loan split.",
    schema: z.object({
    //   userId: z.string("the id of the user"),
      purchaseAmount: z.number("purchase amount in the user's currency"),
    }),
  }
);

const insuranceAdequacy = tool(
  async ({replacementYears = 10 }) => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");

    const user = await User.findById(userId).populate("income.sources").lean();
    if (!user) throw new Error("user not found");

    const lifeCoverage = Number(
      user.insurance?.lifeInsurance?.coverageAmount ?? 0
    );
    const healthCoverage = Number(
      user.insurance?.healthInsurance?.coverageAmount ?? 0
    );

    const monthlyIncome =
      (user.income?.sources || []).reduce(
        (s, src) =>
          s + Number(src?.lastKnownMonthly ?? src?.monthly ?? src?.amount ?? 0),
        0
      ) ||
      Number(user.incomeDeclared ?? 0) ||
      0;
    const annualIncome = monthlyIncome * 12;

    const recommendedLife = annualIncome * replacementYears;
    const lifeAdeq = lifeCoverage >= recommendedLife ? "adequate" : "under";
    const lifeShortfall =
      lifeCoverage >= recommendedLife ? 0 : recommendedLife - lifeCoverage;

    // health adequacy: simple heuristic: >= 3 months of income * monthly factor OR fixed threshold
    const recommendedHealth = Math.max(50000, monthlyIncome * 3); // fallback min
    const healthAdeq =
      healthCoverage >= recommendedHealth ? "adequate" : "under";
    const healthShortfall =
      healthCoverage >= recommendedHealth
        ? 0
        : recommendedHealth - healthCoverage;

    return {
      lifeCoverageAmount: lifeCoverage,
      healthCoverageAmount: healthCoverage,
      lifeCoverageAdequacy: lifeAdeq,
      lifeShortfall,
      healthCoverageAdequacy: healthAdeq,
      healthShortfall,
      notes: `Life cover recommended ≈ ${recommendedLife}. Health recommended ≈ ${recommendedHealth}.`,
      inputsUsed: ["insurance", "income.sources", "incomeDeclared"],
      lastUpdated: new Date().toISOString(),
      confidence: monthlyIncome > 0 ? 0.9 : 0.6,
    };
  },
  {
    name: "insuranceAdequacy",
    description:
      "Checks static adequacy of life and health insurance against income-based heuristics.",
    schema: z.object({
    //   userId: z.string("the id of the user"),
      replacementYears: z
        .number("years to replace income if user dies")
        .optional(),
    }),
  }
);

const goalFeasibilityStatic = tool(
  async ({ goalId }) => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");
    if (goalId && !mongoose.Types.ObjectId.isValid(goalId))
      throw new Error("invalid goalId");

    const user = await User.findById(userId).populate("goals").lean();
    if (!user) throw new Error("user not found");

    // basic monthly savings estimate from static declared info
    const monthlyIncome =
      (user.income?.sources || []).reduce(
        (s, src) =>
          s + Number(src?.lastKnownMonthly ?? src?.monthly ?? src?.amount ?? 0),
        0
      ) ||
      Number(user.incomeDeclared ?? 0) ||
      0;
    const monthlyExpenses =
      (user.expenses?.categories || []).reduce(
        (s, c) => s + Number(c?.monthly ?? c?.amount ?? 0),
        0
      ) || 0;
    const currentSavingsRate = Math.max(0, monthlyIncome - monthlyExpenses);

    const goals = user.goals || [];
    const targetGoal = goalId
      ? goals.find((g) => String(g._id) === String(goalId))
      : goals[0];

    if (!targetGoal) {
      return {
        error: "goal not found",
        inputsUsed: ["goals", "income.sources", "expenses.categories"],
        lastUpdated: new Date().toISOString(),
        confidence: 0.5,
      };
    }

    const currentSaved = Number(
      targetGoal?.currentSaved ?? targetGoal?.saved ?? 0
    );
    const target = Number(targetGoal?.targetAmount ?? 0);

    // compute months until target (if targetDate exists)
    let monthsUntilTarget = null;
    if (targetGoal.targetDate) {
      const t = new Date(targetGoal.targetDate);
      const now = new Date();
      monthsUntilTarget = Math.max(
        0,
        (t.getFullYear() - now.getFullYear()) * 12 +
          (t.getMonth() - now.getMonth())
      );
    }

    const remaining = Math.max(0, target - currentSaved);
    const neededMonthlyToHitTarget =
      monthsUntilTarget && monthsUntilTarget > 0
        ? Number((remaining / monthsUntilTarget).toFixed(2))
        : null;
    const isFeasibleWithCurrentSavingsRate =
      neededMonthlyToHitTarget !== null
        ? currentSavingsRate >= neededMonthlyToHitTarget
        : null;

    return {
      goalId: targetGoal._id,
      currentSaved,
      target,
      monthsUntilTarget,
      neededMonthlyToHitTarget,
      currentSavingsRate,
      isFeasibleWithCurrentSavingsRate,
      inputsUsed: ["goals", "income.sources", "expenses.categories"],
      lastUpdated: new Date().toISOString(),
      confidence: 0.8,
    };
  },
  {
    name: "goalFeasibilityStatic",
    description:
      "Checks if a declared goal is feasible using static savings-rate heuristics.",
    schema: z.object({
    //   userId: z.string("the id of the user"),
      goalId: z.string("optional specific goal id").optional(),
    }),
  }
);

const investmentAllocationSnapshot = tool(
  async () => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");

    const user = await User.findById(userId)
      .populate("assets.investments")
      .lean();
    if (!user) throw new Error("user not found");

    const investments = user.assets?.investments || [];
    const totalInvested = investments.reduce(
      (s, it) => s + Number(it?.value ?? 0),
      0
    );

    const breakdown = {};
    investments.forEach((it) => {
      const t = (it.name || "other").toString().toLowerCase();
      breakdown[t] = (breakdown[t] || 0) + Number(it?.amount ?? 0);
    });

    const equities = breakdown["equity"] || breakdown["stock"] || 0;
    const debt = breakdown["debt"] || breakdown["bond"] || 0;
    const cash = breakdown["cash"] || 0;
    const otherSum =
      Object.values(breakdown).reduce((s, v) => s + v, 0) -
      (equities + debt + cash);

    const pct = (amt) =>
      totalInvested > 0 ? Number(((amt / totalInvested) * 100).toFixed(2)) : 0;

    return {
      equitiesPct: pct(equities),
      debtPct: pct(debt),
      cashPct: pct(cash),
      otherPct: pct(otherSum),
      totalInvested,
      breakdownByType: breakdown,
      inputsUsed: ["assets.investments"],
      lastUpdated: new Date().toISOString(),
      confidence: totalInvested > 0 ? 0.9 : 0.6,
    };
  },
  {
    name: "investmentAllocationSnapshot",
    description:
      "Returns a static allocation breakdown across investments by type/category.",
    // schema: z.object({
    //   userId: z.string("the id of the user"),
    // }),
  }
);

const creditHealthStatic = tool(
  async () => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");

    const user = await User.findById(userId)
      .populate("liabilities.creditCards")
      .lean();
    if (!user) throw new Error("user not found");

    const score = Number(user.creditScore ?? 0);
    const cards = user.liabilities?.creditCards || [];
    const totalBalance = cards.reduce((s, c) => s + Number(c?.balance ?? 0), 0);
    const totalLimit = cards.reduce((s, c) => s + Number(c?.limit ?? 0), 0);
    const utilization =
      totalLimit > 0
        ? Number(((totalBalance / totalLimit) * 100).toFixed(2))
        : null;

    let tier = "unknown";
    if (score >= 750) tier = "excellent";
    else if (score >= 700) tier = "good";
    else if (score >= 650) tier = "fair";
    else if (score > 0) tier = "poor";

    const suggestions = [];
    if (utilization !== null && utilization > 30)
      suggestions.push("Reduce credit utilization below 30% to improve score.");
    if (score > 0 && score < 700)
      suggestions.push(
        "Consider paying down high-interest balances and keeping card usage low."
      );

    return {
      creditScore: score,
      utilizationPct: utilization,
      scoreRiskTier: tier,
      suggestions,
      inputsUsed: ["creditScore", "liabilities.creditCards"],
      lastUpdated: new Date().toISOString(),
      confidence: 0.85,
    };
  },
  {
    name: "creditHealthStatic",
    description:
      "Returns static credit health signals (score, utilization, tier, suggestions).",
    // schema: z.object({
    //   userId: z.string("the id of the user"),
    // }),
  }
);

const summarizeSnapshot = tool(
  async () => {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new Error("invalid userId");

    const nw = (await netWorthSnapshot.run)
      ? await netWorthSnapshot.run({ userId })
      : await netWorthSnapshot({ userId });
    const liq = (await liquidityAndBuffer.run)
      ? await liquidityAndBuffer.run({ userId })
      : await liquidityAndBuffer({ userId });
    const dp = (await debtProfile.run)
      ? await debtProfile.run({ userId })
      : await debtProfile({ userId });

    const parts = [];
    parts.push(`Net worth ₹${Math.round(nw.netWorth ?? 0)}`);
    parts.push(
      `liquid cash ₹${Math.round(liq.liquidCash ?? 0)} (covers ${
        liq.emergencyFundCoverageMonths ?? "N/A"
      } mo)`
    );
    if (dp.totalDebt > 0)
      parts.push(
        `total debt ₹${Math.round(dp.totalDebt)} (avg interest ${
          dp.avgInterestRate
        }%)`
      );
    const sentence = parts.join(" — ") + ".";

    return {
      summary: sentence,
      facts: { netWorth: nw, liquidity: liq, debt: dp },
      inputsUsed: ["netWorthSnapshot", "liquidityAndBuffer", "debtProfile"],
      lastUpdated: new Date().toISOString(),
      confidence: 0.9,
    };
  },
  {
    name: "summarizeSnapshot",
    description:
      "Human-readable 1-2 sentence summary of the user's static financial snapshot plus the underlying facts bundle.",
    // schema: z.object({
    //   userId: z.string("the id of the user"),
    // }),
  }
);

async function fetchUserDoc() {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("invalid or missing userId");
  }
  const user = await User.findById(userId); // DO NOT use .lean() because services call populate on the doc
  if (!user) throw new Error("user not found");
  return user;
}

const makeTool = (serviceFn, { name, description, inputsUsedHint = [] }) =>
  tool(
    async () => {
      const user = await fetchUserDoc(userId);
      const out = await serviceFn(user);
      const confidence = out !== null && out !== undefined ? 0.95 : 0.5;
      return {
        result: out ?? null,
        inputsUsed: inputsUsedHint.length ? inputsUsedHint : ["userDocument"],
        lastUpdated: new Date().toISOString(),
        confidence,
      };
    },
    {
      name,
      description,
    //   schema: z.object({
    //     userId: z.string().min(1, "the id of the user"),
    //   }),
    }
  );

export const getAge = makeTool(getAgeService, {
  name: "getAge",
  description: "Returns user's age if present, otherwise null.",
  inputsUsedHint: ["user.age"],
});

export const getIncome = makeTool(getIncomeService, {
  name: "getIncome",
  description:
    "Populates and returns the user's income object if present, otherwise null.",
  inputsUsedHint: ["user.income.sources"],
});

export const getExpenses = makeTool(getExpensesService, {
  name: "getExpenses",
  description:
    "Populates and returns the user's expenses object if present, otherwise null.",
  inputsUsedHint: ["user.expenses.categories"],
});

export const getAssets = makeTool(getAssetsService, {
  name: "getAssets",
  description:
    "Populates and returns the user's assets (bank, investments, otherAssets).",
  inputsUsedHint: [
    "user.assets.investments",
    "user.assets.otherAssets",
    "user.assets.bankBalance",
  ],
});

export const getLiabilities = makeTool(getLiabilitiesService, {
  name: "getLiabilities",
  description:
    "Populates and returns the user's liabilities (loans, credit cards).",
  inputsUsedHint: ["user.liabilities.loans", "user.liabilities.creditCards"],
});

export const getInsurance = makeTool(getInsuranceService, {
  name: "getInsurance",
  description: "Returns the user's insurance information (life and health).",
  inputsUsedHint: ["user.insurance"],
});

export const getDependents = makeTool(getDependentsService, {
  name: "getDependents",
  description:
    "Populates and returns dependents details if present; otherwise returns dependents summary or null.",
  inputsUsedHint: ["user.dependents.details", "user.dependents.count"],
});

export const getGoals = makeTool(getGoalsService, {
  name: "getGoals",
  description: "Populates and returns user goals if present, otherwise null.",
  inputsUsedHint: ["user.goals"],
});

export const getEmergencyFund = makeTool(getEmergencyFundService, {
  name: "getEmergencyFund",
  description:
    "Returns user's emergencyFund amount if present, otherwise null.",
  inputsUsedHint: ["user.emergencyFund"],
});

export const getCreditScore = makeTool(getCreditScoreService, {
  name: "getCreditScore",
  description: "Returns user's credit score if present, otherwise null.",
  inputsUsedHint: ["user.creditScore"],
});

const tools = [
  netWorthSnapshot,
  getAge,
  getIncome,
  getExpenses,
  getAssets,
  getLiabilities,
  getInsurance,
  getDependents,
  getGoals,
  getEmergencyFund,
  getCreditScore,
  liquidityAndBuffer,
  summarizeSnapshot,
  creditHealthStatic,
  investmentAllocationSnapshot,
  goalFeasibilityStatic,
  insuranceAdequacy,
  affordabilityChecker,
  debtProfile,
];
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = llm.bindTools(tools);

const toolNode = new ToolNode(tools);

async function llmCall(state) {
  const result = await llmWithTools.invoke([
    {
      role: "system",
      content:
        "You are a helpful personal assistant tasked with writing stories based on the requirements.",
    },
    ...state.messages,
  ]);

  return {
    messages: [result],
  };
}

function shouldContinue(state) {
  const messages = state.messages;
  const lastMessage = messages.at(-1);

  if (lastMessage?.tool_calls?.length) {
    return "Action";
  }
  return "__end__";
}

const agentBuilder = new StateGraph(MessagesAnnotation)
  .addNode("llmCall", llmCall)
  .addNode("tools", toolNode)
  .addEdge("__start__", "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, {
    Action: "tools",
    __end__: "__end__",
  })
  .addEdge("tools", "llmCall")
  .compile();

const reply = async (prompt, userid) => {
  try {
    userId = userid;
    const response = await agentBuilder.invoke({
      messages: [{ role: "user", content: prompt, userId }],
    });
    // console.log(response);
    return response.messages.at(-1).content;
  } catch (error) {
    console.log(error);
  }
};

export { reply };
