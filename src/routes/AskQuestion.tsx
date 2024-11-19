import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { useAtom } from "jotai";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AskQuestionFormSchema, Method } from "../models";
import { askQuestionToLLM } from "../services/rag";
import { answeredQuestionsAtom } from "../store";
const getLabelForField = {
  topK: (method: Method) =>
    method === "naive"
      ? "Top K"
      : method === "guided"
      ? "Top K Per Topic"
      : "Top K Per Sub-Query",
  maxTopicsOrQueries: (method: Method) =>
    method === "guided" ? "Max Topics" : "Max Sub Query Iterations",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  question: (method: Method) => "Question",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  method: (method: Method) => "Method",
} as const;

const methodOptions = [
  {
    value: "iterative",
    label: "Iterative RAG",
  },
  {
    value: "guided",
    label: "Guided RAG",
  },
  {
    value: "naive",
    label: "Naive RAG",
  },
] as const;

const castFormValues = ({
  topK,
  maxTopicsOrQueries,
  method,
  question,
}: {
  topK: string;
  maxTopicsOrQueries: string;
  method: Method;
  question: string;
}) => {
  return {
    topK: Number(topK),
    maxTopicsOrQueries: Number(maxTopicsOrQueries),
    method,
    question,
  };
};

export const AskQuestion = () => {
  const [topK, setTopK] = useState("2");
  const [maxTopicsOrQueries, setMaxTopicsOrQueries] = useState("3");
  const [method, setMethod] = useState<Method>("iterative");
  const [question, setQuestion] = useState("");
  const setAnsweredQuestions = useAtom(answeredQuestionsAtom)[1];
  const handleMethodChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMethod(e.target.value as Method);
    },
    [setMethod]
  );

  const handleTopKChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTopK(e.target.value),
    [setTopK]
  );

  const handleMaxTopicsOrQueriesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setMaxTopicsOrQueries(e.target.value),
    [setMaxTopicsOrQueries]
  );

  const handleQuestionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value),
    [setQuestion]
  );

  const castedFormValues = useMemo(
    () =>
      castFormValues({
        topK,
        maxTopicsOrQueries,
        method,
        question,
      }),
    [topK, maxTopicsOrQueries, method, question]
  );

  const validationResult = useMemo(
    () => AskQuestionFormSchema.safeParse(castedFormValues),
    [castedFormValues]
  );

  const handleSubmit = async () => {
    toast(
      "Your question has been sent for processing. You will be notified once it has been answered",
      { type: "info" }
    );
    const LLMResult = await askQuestionToLLM(castedFormValues);
    if (LLMResult.success) {
      toast(
        'A question you submitted has been answered. You can view it in "View Answered Questions"',
        { type: "success" }
      );
      setAnsweredQuestions((answeredQuestions) => [
        LLMResult.data,
        ...answeredQuestions,
      ]);
    } else {
      toast(
        `There was an error getting the answer for a question you submitted (${LLMResult.message})`,
        { type: "error" }
      );
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      gap={4}
      minHeight="calc(100vh - 64px)"
      width="60%"
      margin="0 auto"
    >
      <Box flexGrow={0.5} />
      <Typography variant="h3">Ask a Question!</Typography>
      <Typography align="center">
        First select the method you would like to use to answer the question.
        Then enter your question and any additional setting, if they are
        applicable.
      </Typography>
      <Box>
        <FormControl>
          <FormLabel id="method-selection">Method</FormLabel>
          <RadioGroup
            row
            aria-labelledby="method-selection"
            value={method}
            onChange={handleMethodChange}
          >
            {methodOptions.map(({ value, label }, i) => (
              <FormControlLabel
                value={value}
                control={<Radio />}
                label={label}
                key={`method-selection-option-${i}`}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box display="flex" gap={2}>
        <Box>
          <TextField
            value={topK}
            onChange={handleTopKChange}
            variant="standard"
            label={getLabelForField["topK"](method)}
          />
        </Box>
        {method !== "naive" && (
          <Box>
            <TextField
              value={maxTopicsOrQueries}
              onChange={handleMaxTopicsOrQueriesChange}
              variant="standard"
              label={getLabelForField["maxTopicsOrQueries"](method)}
            />
          </Box>
        )}
      </Box>
      <Box>
        <Typography gutterBottom color="textSecondary">
          {getLabelForField["question"](method)}
        </Typography>
        <TextareaAutosize
          style={{ fontSize: "14px", minWidth: "300px" }}
          value={question}
          onChange={handleQuestionChange}
        />
      </Box>
      <Box>
        <Tooltip
          arrow
          title={
            !validationResult.success && (
              <ul style={{ paddingLeft: "10px" }}>
                {(validationResult.error?.errors ?? []).map((issue, i) => (
                  <li key={`ask-question-error-${i}`}>
                    {issue.path[0] in getLabelForField
                      ? getLabelForField[
                          issue.path[0] as keyof typeof getLabelForField
                        ](method)
                      : issue.path}
                    : {issue.message}
                  </li>
                ))}
              </ul>
            )
          }
        >
          <Box>
            <Button
              variant="outlined"
              disabled={!validationResult.success}
              onClick={handleSubmit}
            >
              <Typography textTransform="none">Submit</Typography>
            </Button>
          </Box>
        </Tooltip>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );
};
