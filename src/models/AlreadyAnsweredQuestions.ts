import { z } from "zod";

export const AnsweredQuestionNodeSchema = z.object({
  text: z.string(),
  node_id: z.string(),
  score: z.number(),
  file_name: z.string(),
});

export type AnsweredQuestionNode = z.infer<typeof AnsweredQuestionNodeSchema>;

export const AnsweredQuestionIterativeThoughtProcessSchema = z.array(
  z.object({
    query: z.string(),
    query_answer: z.string(),
    sources: z.array(AnsweredQuestionNodeSchema),
  })
);

export const AnsweredQuestionIterativeSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("iterative"),
  question: z.string(),
  answer: z.string(),
  thought_process: AnsweredQuestionIterativeThoughtProcessSchema,
});

export type AnswerQuestionIterativeThoughtProcess = z.infer<
  typeof AnsweredQuestionIterativeThoughtProcessSchema
>;

export type AnswerQuestionIterative = z.infer<
  typeof AnsweredQuestionIterativeSchema
>;

export const AnsweredQuestionGuidedTopicsAndNodesSchema = z.array(
  z.object({
    topic: z.string(),
    sources: z.array(AnsweredQuestionNodeSchema),
  })
);

export const AnsweredQuestionGuidedSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("guided"),
  question: z.string(),
  answer: z.string(),
  topics_and_nodes: AnsweredQuestionGuidedTopicsAndNodesSchema,
});

export type AnsweredQuestionGuidedTopicsAndNodes = z.infer<
  typeof AnsweredQuestionGuidedTopicsAndNodesSchema
>;

export type AnswerQuestionGuided = z.infer<typeof AnsweredQuestionGuidedSchema>;

export const AnsweredQuestionNaiveSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("naive"),
  question: z.string(),
  answer: z.string(),
  sources: z.array(AnsweredQuestionNodeSchema),
});

export type AnswerQuestionNaive = z.infer<typeof AnsweredQuestionNaiveSchema>;

export const AnsweredQuestionSchema = z.discriminatedUnion("type", [
  AnsweredQuestionIterativeSchema,
  AnsweredQuestionGuidedSchema,
  AnsweredQuestionNaiveSchema,
]);

export type AnsweredQuestion = z.infer<typeof AnsweredQuestionSchema>;

export const MethodSchema = z.enum(["iterative", "guided", "naive"]);

export type Method = z.infer<typeof MethodSchema>;
