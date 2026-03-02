import { z } from "zod";

/**
 * Schema untuk satu data lowongan pekerjaan
 * Digunakan oleh AI Agent untuk validasi output JSON
 */
const jobSchema = z.object({
  title: z.string().optional().default(""),

  company: z.string().optional().default(""),

  location: z.string().optional().default(""),

  salary: z
    .union([
      z.object({
        type: z
          .literal("fixed")
          .describe(
            "Fixed salary amount, may represent hourly, daily, monthly, or yearly salary."
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
    ])
    .default({ type: "not specified" }),

  job_type: z
    .enum(["full-time", "part-time", "contract", "internship", "not specified"])
    .default("not specified"),

  description: z
    .string()
    .optional()
    .describe(
      "Detailed description of the job, including responsibilities and requirements."
    )
    .default(""),

  posting_date: z.string().optional().default(""),

  end_date: z.string().optional().default(""),

  url: z.string().url().optional().default(""),
});

/**
 * JSON Schema yang dikirim ke AI Agent
 * Output AI HARUS berupa array of jobSchema
 */
export const jsonSchema = z.toJSONSchema(z.array(jobSchema));

const nextBtnSchema = z.object({
  btnIdentifier: z
    .string()
    .optional()
    .default("")
    .describe(
      `
      CSS selector that identifies the clickable element used to navigate to next page, according to rules and examples below.

      Rules:
      - Must be a VALID CSS selector only (NO XPath, NO JavaScript).
      - Must match exactly ONE element.
      - Use positional selectors (e.g. :nth-of-type(), :nth-child()) when necessary.
      - The element may be an <a>, <button>, or any clickable element.
      - The element may or may not have an href attribute (navigation may be handled by JavaScript).
      - Do NOT rely on JavaScript behavior; select based on DOM structure only.
      - If multiple selectors are needed, combine them using valid CSS syntax (e.g. ".job-card a", ".detail-btn, .job-link").
      - Do NOT return explanations, comments, or code.
      - If no suitable selector exists, return an empty string "".

     
      Examples:
      - ".this-link:nth-of-type(2)"
      - ".pagination:nth-child(3) a"
      - "ul.pagination > li:nth-child(5) a"
      - etc
      `
    )
});

export const nextBtnJsonSchema = z.toJSONSchema(nextBtnSchema);
