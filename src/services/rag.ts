import { z } from "zod";
import {
  AnsweredQuestion,
  AnsweredQuestionGuidedSchema,
  AnsweredQuestionIterativeSchema,
  AnsweredQuestionNaiveSchema,
  AskQuestionForm,
} from "../models";
import { ENV } from "./env";

const SERVER_URL = `http://${ENV.SERVER_HOST}:${ENV.SERVER_PORT}`;

type Result<T> =
  | { success: false; message: string }
  | { success: true; data: T };

export const askQuestionToLLM = async ({
  method,
  topK,
  maxTopicsOrQueries,
  question,
}: AskQuestionForm): Promise<Result<AnsweredQuestion>> => {
  switch (method) {
    case "iterative":
      return await askQuestionToLLMIterative({
        question,
        max_steps: maxTopicsOrQueries,
        top_K: topK,
      });
    case "guided":
      return await askQuestionToLLMGuided({
        question,
        max_topics: maxTopicsOrQueries,
        top_K_per_topic: topK,
      });

    case "naive":
      return await askQuestionToLLMNaive({ question, top_K: topK });

    default:
      return {
        success: false,
        message: `Invalid method "${method}" encountered.`,
      };
  }
};

const askQuestionToLLMIterative = async (body: {
  question: string;
  max_steps: number;
  top_K: number;
}) => {
  return await postAPI(
    `${SERVER_URL}/iterative_rag`,
    body,
    AnsweredQuestionIterativeSchema
  );
};

const askQuestionToLLMGuided = async (body: {
  question: string;
  max_topics: number;
  top_K_per_topic: number;
}) => {
  return await postAPI(
    `${SERVER_URL}/guided_rag`,
    body,
    AnsweredQuestionGuidedSchema
  );
};

const askQuestionToLLMNaive = async (body: {
  question: string;
  top_K: number;
}) => {
  return await postAPI(
    `${SERVER_URL}/naive_rag`,
    body,
    AnsweredQuestionNaiveSchema
  );
};

const postAPI = async <B, R>(
  url: string,
  body: B,
  responseSchema: z.ZodType<R>
): Promise<Result<R>> => {
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!rawResponse.ok) {
      return {
        success: false,
        message: `Received error code ${rawResponse.status} from server.`,
      };
    }
    const jsonResponse = await rawResponse.json();
    const validationResult = responseSchema.safeParse(jsonResponse);
    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid response received from server.",
      };
    }
    return {
      success: true,
      data: validationResult.data,
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown Error Occurred",
    };
  }
};
