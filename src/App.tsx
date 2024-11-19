import {
  AppBar,
  Box,
  Button,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, Route, Switch } from "wouter";
import { AskQuestion } from "./routes/AskQuestion";
import { ViewAllAnsweredQuestions } from "./routes/ViewAllAnsweredQuestions";
import { ViewAnsweredQuestionDetails } from "./routes/ViewAnsweredQuestionDetails";
import { theme } from "./theme";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar disableGutters>
          <Box display="flex" gap={2} alignItems="center" width="100%" px={2}>
            <Box flexGrow={1}>
              <img alt="Doc Assist" src="/doc_assist_logo.png" height={48} />
            </Box>
            <Box>
              <Link to="/">
                <Button color="secondary" variant="outlined">
                  <Typography textTransform="none">Ask A Question</Typography>
                </Button>
              </Link>
            </Box>
            <Box>
              <Link to="/questions">
                <Button color="secondary" variant="outlined">
                  <Typography textTransform="none">
                    View Answered Questions
                  </Typography>
                </Button>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/">
          <Helmet>
            <title>Ask Question</title>
          </Helmet>
          <AskQuestion />
        </Route>
        <Route path="/questions">
          <Helmet>
            <title>Prior Question</title>
          </Helmet>
          <ViewAllAnsweredQuestions />
        </Route>
        <Route path="/questions/:id">
          {(params) => <ViewAnsweredQuestionDetails id={params.id} />}
        </Route>
        <Route>Page not found</Route>
      </Switch>
      <ToastContainer position="bottom-left" />
    </ThemeProvider>
  );
}

export default App;
