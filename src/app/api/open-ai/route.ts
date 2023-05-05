import { NextResponse } from "next/server";
import { getCompletion } from "@/utils/server/openai";

const surveysUserPrompt = `
Generate a list of questions to ask in a survey about getting feedback from a software development team.
Provide your response only in JSON format, with each question as a separate string in an array.
`;

export async function GET(request: Request) {
  const completion = await getCompletion(surveysUserPrompt);
  if (completion) return NextResponse.json(JSON.parse(completion));
  else return NextResponse.error();
}

function generateSurveyAnswersUserPrompt(question: string) {
  const surveyAnswersUserPrompt =
    "generate a list of choices for the question between triple backticks.\n" +
    "Provide your response only in JSON format, with each answer as a separate string in an array.\n" +
    "```" +
    question +
    "```.";
  return surveyAnswersUserPrompt;
}

export async function POST(request: Request) {
  const json = await request.json();

  const completion = await getCompletion(
    generateSurveyAnswersUserPrompt(json.question),
  );
  if (completion) return NextResponse.json(JSON.parse(completion));
  else return NextResponse.error();
}
