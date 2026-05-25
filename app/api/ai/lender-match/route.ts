import OpenAI from "openai";
import { NextResponse } from "next/server";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.2";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const lenderMatchSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "disclaimer", "matches", "nextQuestions"],
  properties: {
    summary: { type: "string" },
    disclaimer: { type: "string" },
    matches: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["profile", "fit", "reason", "watchouts"],
        properties: {
          profile: { type: "string" },
          fit: { type: "string", enum: ["High", "Medium", "Low"] },
          reason: { type: "string" },
          watchouts: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    nextQuestions: {
      type: "array",
      items: { type: "string" },
      maxItems: 4,
    },
  },
} as const;

export async function POST(request: Request) {
  if (!client) {
    return NextResponse.json(
      {
        error: "OPENAI_API_KEY is not configured. Add it to the server environment before using AI lender match.",
      },
      { status: 503 }
    );
  }

  try {
    const deal = await request.json();

    const response = await client.responses.create({
      model: MODEL,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are an underwriting assistant for a real estate lending CRM. " +
                "Recommend lender profiles, not made-up lender companies. " +
                "If the input contains specific lender names in lenderFit, treat them only as user-provided possibilities. " +
                "Do not claim any lender has live availability, pricing, or approval criteria unless explicitly provided in the input. " +
                "Base your answer only on the deal data and return concise JSON.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(deal, null, 2),
            },
          ],
        },
      ],
      reasoning: { effort: "medium" },
      text: {
        format: {
          type: "json_schema",
          name: "lender_match",
          strict: true,
          schema: lenderMatchSchema,
        },
      },
    });

    if (!response.output_text) {
      return NextResponse.json(
        { error: "The AI response was empty. Try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(JSON.parse(response.output_text));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI lender match failed",
      },
      { status: 500 }
    );
  }
}
