import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import { z } from "zod";
import { get } from "http";

dotenv.config();

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const options = {
  method: "GET",
  url: "https://www.kalibrr.com/_next/data/U7EYscDFlyEdi6ic6P0Bg/id-ID/home/all-jobs.json",
  params: {
    param: "all-jobs",
  },
};

async function getRawData() {
  try {
    const response = await axios.request(options);
    return response.data.pageProps.jobs;
  } catch (error) {
    throw error;
  }
}

const jobSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  salary: z.union([
    z.object({
      type: z
        .literal("fixed")
        .describe(
          "Fixed salary amount, may represent hourly, daily, monthly or yearly salary."
        ),
      amount: z.number(),
    }),
    z.object({
      type: z.literal("range"),
      min: z.number(),
      max: z.number(),
    }),
    z.object({
      type: z.literal("not specified"),
    }),
  ]),
  job_type: z
    .enum(["full-time", "part-time", "contract", "internship", "not specified"])
    .default("not specified"),
  description: z
    .string()
    .optional()
    .describe(
      "Detailed description of the job, including responsibilities and requirements."
    ),
  posting_date: z.string().optional(),
  end_date: z.string().optional(),
});

// const jobListSchema = z.array(jobSchema);
const jsonSchema = z.toJSONSchema(jobSchema.array());

async function extractData(rawData: any) {
  try {
    // const data = await fetchData();

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Here is a raw job data: ${JSON.stringify(rawData)}. 
			You have to extract each job listing data that follows the specified structure.
      
			Return list of jobs in JSON format only.
			`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: jsonSchema,
      },
    });

    // await fs.writeFile("output.json", response.text || JSON.stringify([{}]));
    return response.text || JSON.stringify([{}]);
  } catch (error) {
    throw error;
  }
}

async function main() {
  try {
    const data = await getRawData();
    console.log(data);

    // if (data) {
    //   const extractedData = await extractData(data);
    //   console.log(JSON.parse(extractedData));
    // }
    console.log("done");
  } catch (error) {
    console.error(error);
  }
}
// extractData();
// fetchData().then((data) => {
// 	console.log(data);
// 	console.log(data?.length || 0)
// }).catch((error) => {
// 	console.error(error);
// }).finally(() => {
// 	console.log('done');
// });
main();
