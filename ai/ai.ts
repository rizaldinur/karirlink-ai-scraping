import { jsonSchema } from "../schema/schema.ts";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function extractData(rawData: string) {
  // const data = await fetchData();
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
    You have to extract job listings from the following raw HTML content: ${rawData}.
    Extract relevant information according to the provided JSON schema for each job listing.
      
    If you cannot extract any meaningful job listing data, return an empty list [].

	Else, Return list of jobs in JSON format only as specified by the schema.
    `,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema,
    },
  });

  // await fs.writeFile("output.json", response.text || JSON.stringify([{}]));
  return response.text || JSON.stringify([{}]);
}
