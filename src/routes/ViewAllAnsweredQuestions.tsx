import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  gridClasses,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useAtom } from "jotai";
import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "wouter";
import { answeredQuestionsAtom } from "../store";
const autosizeOptions = {
  columns: ["type", "question", "answer"],
  includeOutliers: true,
  includeHeaders: false,
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <ClearTable />
    </GridToolbarContainer>
  );
}

export const ViewAllAnsweredQuestions = () => {
  const [alreadyAnsweredQuestions] = useAtom(answeredQuestionsAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation();
  const apiRef = useGridApiRef();
  useEffect(() => {
    if (apiRef.current && apiRef.current.autosizeColumns) {
      setTimeout(() => apiRef.current.autosizeColumns(autosizeOptions), 0);
    }
  }, [alreadyAnsweredQuestions, apiRef]);

  return (
    <Box
      pt={3}
      maxWidth="60%"
      margin="0 auto"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h4">All Answered Questions</Typography>

      <Box height="calc(100vh - 170px)">
        <DataGrid
          apiRef={apiRef}
          sx={{
            [`& .${gridClasses.row}`]: {
              cursor: "pointer",
            },
          }}
          columns={[
            {
              field: "type",
              headerName: "Type",
            },
            {
              field: "question",
              headerName: "Question",
            },
            {
              field: "answer",
              headerName: "Answer",
            },
          ]}
          autosizeOnMount={true}
          disableRowSelectionOnClick
          disableDensitySelector={true}
          onRowClick={({ id }) => {
            setLocation(`/questions/${id}`);
          }}
          autosizeOptions={autosizeOptions}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: { disableToolbarButton: true },
              csvOptions: { disableToolbarButton: true },
            },
          }}
          rows={alreadyAnsweredQuestions.map(
            ({ question, answer, type, id }) => ({
              id,
              type,
              question: question,
              answer: answer,
            })
          )}
        />
      </Box>
    </Box>
  );
};

const ClearTable = () => {
  const [open, setOpen] = React.useState(false);
  const setAnsweredQuestions = useAtom(answeredQuestionsAtom)[1];

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleClear = useCallback(() => {
    setAnsweredQuestions([]);
    setOpen(false);
    toast("All responses have been cleared", { type: "success" });
  }, [setAnsweredQuestions]);

  return (
    <React.Fragment>
      <Button size="small" onClick={handleOpen}>
        <DeleteIcon
          fontSize="small"
          sx={{ marginRight: "8px", marginLeft: "-2px" }}
        />
        <Typography fontSize="14px" fontWeight="500">
          CLEAR
        </Typography>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete All Response</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all responses?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClear}>Delete</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
