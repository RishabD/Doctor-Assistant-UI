import FileOpenIcon from "@mui/icons-material/FileOpen";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Gauge } from "@mui/x-charts";
import React from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useLocation } from "wouter";
import {
  AnsweredQuestionGuidedTopicsAndNodes,
  AnsweredQuestionNode,
  AnswerQuestionIterativeThoughtProcess,
} from "../models";
import { answeredQuestionsAtom } from "../store";

type ViewPriorQuestionDetailsProps = {
  id: string;
};

export const ViewAnsweredQuestionDetails = ({
  id,
}: ViewPriorQuestionDetailsProps) => {
  const [answeredQuestions] = useAtom(answeredQuestionsAtom);
  const answeredQuestion = useMemo(
    () =>
      answeredQuestions.find((answeredQuestion) => answeredQuestion.id === id),
    [answeredQuestions, id]
  );
  if (!answeredQuestion) {
    return (
      <React.Fragment>
        <Helmet>
          <title>Question Not Found</title>
        </Helmet>
        <Box pt={3}></Box>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{answeredQuestion.question}</title>
      </Helmet>
      <Box pt={3} maxWidth="60%" margin="0 auto">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pb={2}
        >
          <Typography variant="h4">Question Details</Typography>
          <DeleteResponse id={answeredQuestion.id} />
        </Box>
        <Typography variant="h5">Method Used:</Typography>
        <Typography gutterBottom textTransform="capitalize">
          {answeredQuestion.type} RAG
        </Typography>
        <Typography variant="h5">Question:</Typography>
        <Typography gutterBottom>{answeredQuestion.question}</Typography>
        <Typography variant="h5">Answer:</Typography>
        <Typography gutterBottom>{answeredQuestion.answer}</Typography>

        {answeredQuestion.type === "iterative" && (
          <AnsweredQuestionIterativeSource
            thougtProcess={answeredQuestion.thought_process}
          />
        )}

        {answeredQuestion.type === "guided" && (
          <AnsweredQuestionGuidedSource
            topicsAndNodes={answeredQuestion.topics_and_nodes}
          />
        )}

        {answeredQuestion.type === "naive" && (
          <AnsweredQuestionNaiveSource sources={answeredQuestion.sources} />
        )}
      </Box>
    </React.Fragment>
  );
};
const AnsweredQuestionIterativeSource = ({
  thougtProcess,
}: {
  thougtProcess: AnswerQuestionIterativeThoughtProcess;
}) => {
  return (
    <React.Fragment>
      <Typography variant="h5"> Thought Process: </Typography>
      {thougtProcess.map(({ query, query_answer, sources }, i) => (
        <Box key={`source-${i}`} py={2}>
          <Typography variant="h6">Sub-Query #{i + 1}:</Typography>
          <Typography>{query}</Typography>
          <Typography variant="h6">Answer to Sub-Query #{i + 1}:</Typography>
          <Typography>{query_answer}</Typography>
          <Typography variant="h6">Sources:</Typography>
          <ul style={{ margin: 0, paddingLeft: "16px" }}>
            {sources.map((source, j) => (
              <li key={`source-${i}-${j}`}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>{source.file_name}</Typography>
                  <ViewNode source={source} />
                </Box>
              </li>
            ))}
          </ul>
        </Box>
      ))}
    </React.Fragment>
  );
};
const AnsweredQuestionGuidedSource = ({
  topicsAndNodes,
}: {
  topicsAndNodes: AnsweredQuestionGuidedTopicsAndNodes;
}) => {
  return (
    <React.Fragment>
      <Typography variant="h5"> Topics And Their Sources: </Typography>
      {topicsAndNodes.map(({ topic, sources }, i) => (
        <React.Fragment key={`source-${i}`}>
          <Typography variant="h6">{topic}:</Typography>
          <ul style={{ margin: 0, paddingLeft: "16px" }}>
            {sources.map((source, j) => (
              <li key={`source-${i}-${j}`}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>{source.file_name}</Typography>
                  <ViewNode source={source} />
                </Box>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};
const AnsweredQuestionNaiveSource = ({
  sources,
}: {
  sources: AnsweredQuestionNode[];
}) => {
  return (
    <React.Fragment>
      <Typography variant="h5"> Sources: </Typography>
      <ul style={{ margin: 0, paddingLeft: "16px" }}>
        {sources.map((source, i) => (
          <li key={`source-${i}`}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography>{source.file_name}</Typography>
              <ViewNode source={source} />
            </Box>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

const ViewNode = ({ source }: { source: AnsweredQuestionNode }) => {
  const [open, setOpen] = useState(false);
  const handleClose = useCallback(() => setOpen(false), [setOpen]);
  const handleClick = useCallback(() => setOpen(true), [setOpen]);
  return (
    <>
      <IconButton color="primary" size="small" onClick={handleClick}>
        <FileOpenIcon fontSize="small" />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          maxWidth="500px"
          width="100vw"
          bgcolor="white"
          sx={{ transform: "translate(-50%,-50%)" }}
          padding={2}
          borderRadius={2}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Box>
            <Typography variant="h5">{source.file_name}</Typography>
            <Divider />
          </Box>
          <Box>
            <Typography variant="h6">Cosine Similarity:</Typography>
            <Gauge
              width={100}
              height={100}
              valueMin={0}
              valueMax={1}
              value={source.score}
              sx={(theme) => ({ fontFamily: theme.typography.fontFamily })}
            />
          </Box>
          <Box>
            <Typography variant="h6">Text:</Typography>
            <Typography>{source.text}</Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} variant="contained">
              <Typography textTransform="none">Close</Typography>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
const DeleteResponse = ({ id }: { id: string }) => {
  const [open, setOpen] = React.useState(false);
  const setAnsweredQuestions = useAtom(answeredQuestionsAtom)[1];
  const setLocation = useLocation()[1];

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleDelete = useCallback(() => {
    setLocation("/questions");
    setAnsweredQuestions((answeredQuestions) =>
      answeredQuestions.filter((answeredQuestion) => answeredQuestion.id !== id)
    );
    toast("The response has been deleted successfully.", { type: "success" });
  }, [setLocation, setAnsweredQuestions, id]);

  return (
    <React.Fragment>
      <IconButton onClick={handleClickOpen} color="error">
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Response</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you want to delete this question and answer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
