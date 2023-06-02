import type {
  Words,
  Answer,
  ExperimentDto,
  Experiment,
} from "packages/main/logic/experiment.d";

const { invoke } = window.ipcRenderer;

export async function loadExperiments(): Promise<Experiment[]> {
  return invoke("loadExperiments");
}

export async function loadQuestions(
  source: string,
  options: { value: any; refetching: any }
): Promise<Words> {
  return invoke("loadQuestions", source);
}

export async function createExperiment(
  experiment: ExperimentDto
): Promise<Experiment[]> {
  return invoke("createExperiment", experiment);
}

export async function saveAnswers(
  answers: Answer[],
  experimentID: string
): Promise<Experiment[]> {
  return invoke("saveAnswers", answers, experimentID);
}

export async function openFile(experimentID: string): Promise<Experiment[]> {
  return invoke("openFile", experimentID);
}

// ipcMain.handle(
//   "saveAnswers",
//   async (_evnet, answers: Answer[], experimentID: string) => {
//     return saveAnswers(answers, experimentID);
//   }
// );
