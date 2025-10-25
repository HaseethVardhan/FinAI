import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "dotenv";

config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

let pineconeInstance = null;

async function initPinecone() {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index("chat-messages");
  return index;
}

async function getEmbeddings(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Input must be a non-empty string");
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    outputDimensionality: 3072,
    contents: input,
  });

  return response.embeddings;
}

async function upsert({ id, values, metadata }) {
  try {
    if (!id || !values || !Array.isArray(values)) {
      throw new Error("id and values (number[]) are required");
    }
  
    const index = await initPinecone();
  
    const upsertReq = {
      upsertRequest: {
        vectors: [
          {
            id: id.toString(),
            values: values[0].values,
            metadata,
          },
        ],
      },
    };
  
    await index.upsert(upsertReq.upsertRequest.vectors);
    return { ok: true, id };
  } catch (error) {
    console.log(error)
  }
}

async function search({embeddedInput, conversationId}) {

  try {
    const index = await initPinecone();
  
    const queryResponse = await index.query({
      vector: embeddedInput[0].values,
      topK: 6,
      includeValues: false,
      includeMetadata: true,
      filter: { conversationId: { $eq: conversationId } },
    });
  
    return queryResponse.matches;
  } catch (error) {
    console.log(error)
  }
}

export { getEmbeddings, initPinecone, upsert, search };