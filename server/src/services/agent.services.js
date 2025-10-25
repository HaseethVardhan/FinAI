// import { tool } from "@langchain/core/tools";
// import { z } from "zod";
// import { config } from "dotenv";
// import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import axios from "axios";

// config();

// const llm = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
//   model: "gemini-2.5-flash",
//   maxOutputTokens: 2048,
// });

// // const getMovieIds = tool(
// //   async ({ genre }) => {
// //     if (genre.toLocaleLowerCase() === "horror") {
// //       return ["tt1457767", "tt3322940"];
// //     } else if (genre.toLocaleLowerCase() === "action") {
// //       return ["tt9603208", "tt27425164"];
// //     }
// //   },
// //   {
// //     name: "getMovieIds",
// //     description: "fetches the movie ids based on the given genre",
// //     schema: z.object({
// //       genre: z.string("the genre of the movies"),
// //     }),
// //   }
// // );

// // const getPlot = tool(
// //   async ({ id }) => {
// //     const response = await axios.get(
// //       `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}&plot=short`
// //     );
// //     // console.log(response)
// //     return response.data.Plot;
// //   },
// //   {
// //     name: "getPlot",
// //     description: "fetches the plot of the movie",
// //     schema: z.object({
// //       id: z.string("the id of the movie"),
// //     }),
// //   }
// // );

// const tools = [getMovieIds, getPlot];
// const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
// const llmWithTools = llm.bindTools(tools);

// const toolNode = new ToolNode(tools);

// async function llmCall(state) {
//   const result = await llmWithTools.invoke([
//     {
//       role: "system",
//       content:
//         "You are a helpful personal assistant tasked with writing stories based on the requirements.",
//     },
//     ...state.messages,
//   ]);

//   return {
//     messages: [result],
//   };
// }

// function shouldContinue(state) {
//   const messages = state.messages;
//   const lastMessage = messages.at(-1);

//   // If the LLM makes a tool call, then perform an action
//   if (lastMessage?.tool_calls?.length) {
//     return "Action";
//   }
//   // Otherwise, we stop (reply to the user)
//   return "__end__";
// }

// const agentBuilder = new StateGraph(MessagesAnnotation)
//   .addNode("llmCall", llmCall)
//   .addNode("tools", toolNode)
//   .addEdge("__start__", "llmCall")
//   .addConditionalEdges("llmCall", shouldContinue, {
//     Action: "tools",
//     __end__: "__end__",
//   })
//   .addEdge("tools", "llmCall")
//   .compile();

// const reply = async (prompt) => {
//   // console.log(prompt);
//   const response = await agentBuilder.invoke({
//     messages: [{ role: "user", content: prompt }],
//   });

//   // console.log(response);
//   return response.messages.at(-1).content;
// };

// export { reply };
