import { atomWithStorage } from "jotai/utils";
import { AnsweredQuestion } from "./models";

export const answeredQuestionsAtom = atomWithStorage<AnsweredQuestion[]>(
  "answered-question",
  []
);
