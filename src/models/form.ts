import { z } from "zod";
import { MethodSchema } from "./AlreadyAnsweredQuestions";

export const AskQuestionFormSchema = z.object({
  topK: z.number().int().gte(1),
  maxTopicsOrQueries: z.number().int().gte(1),
  method: MethodSchema,
  question: z.string().min(1),
});

export type AskQuestionForm = z.infer<typeof AskQuestionFormSchema>;
