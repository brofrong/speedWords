import electron, { ipcMain } from "electron";
import type { Answer, Experiment, ExperimentDto, Words } from "./experiment.d";
import nodePath from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
// app.getPath('userData') will return a string of the user's app data directory path.
const userDataPath = electron.app.getPath("userData");
// We'll use the `configName` property to set the file name and path.join to bring it all together as a string
const experimentPath = nodePath.join(userDataPath, "experiments" + ".json");
const questsPath = nodePath.join(userDataPath, "quests");
const answersPath = nodePath.join(userDataPath, "answers");
checkFolderExistsAndCreate(questsPath);
checkFolderExistsAndCreate(answersPath);

// this.data = parseDataFile(this.path, opts.defaults);

async function loadExperiments(): Promise<Experiment[]> {
  let quests = [];
  try {
    const fileData = await fs.readFile(experimentPath, { flag: "rs" });
    quests = JSON.parse(fileData.toString());
  } catch (e: any) {
    if (e.errno !== -2) {
      console.error(e);
      throw e;
    }
  }

  return quests;
}

async function addExperiment(experiment: Experiment) {
  const experiments = await loadExperiments();
  experiment.id = experiments.length + 1;
  experiments.unshift(experiment);

  fs.writeFile(experimentPath, JSON.stringify(experiments));

  return { experiments, newExperiment: experiment };
}

async function addQuestions(id: number, words: Words) {
  const path = nodePath.join(questsPath, `${id}.json`);
  return fs.writeFile(path, JSON.stringify(words));
}

async function loadQuestions(id: number): Promise<Words> {
  const path = nodePath.join(questsPath, `${id}.json`);
  let quests: Words = { words: [], examples: [] };
  try {
    const fileData = await fs.readFile(path, { flag: "rs" });
    quests = JSON.parse(fileData.toString());
  } catch (e: any) {
    if (e.errno !== -2) {
      console.error(e);
      throw e;
    }
  }
  return quests;
}

async function createExperiment(params: ExperimentDto) {
  const { newExperiment, experiments } = await addExperiment({
    id: 0,
    title: params.title,
    createdAt: new Date(),
  });

  await addQuestions(newExperiment.id, {
    examples: params.examples,
    words: params.words,
  });

  return experiments;
}

async function checkFolderExistsAndCreate(path: string) {
  try {
    await fs.opendir(path);
  } catch (e) {
    await fs.mkdir(path);
  }
}

function answersToString(answers: Answer[]): string {
  return answers.map((it) => Object.values(it).join(",")).join("\n") + "\n";
}

async function saveAnswers(answers: Answer[], experimentID: string) {
  const filePath = nodePath.join(answersPath, `${experimentID}.csv`);
  const dataToSave = answersToString(answers);
  try {
    const file = await fs.open(filePath);
    file.close();

    await fs.appendFile(filePath, dataToSave);
  } catch (e) {
    const header = Object.keys(answers[0]).join(",") + "\n";
    const dataWithHeader = header + dataToSave;
    await fs.writeFile(filePath, dataWithHeader);
  }
}

ipcMain.handle(
  "saveAnswers",
  async (_evnet, answers: Answer[], experimentID: string) => {
    return saveAnswers(answers, experimentID);
  }
);

ipcMain.handle("createExperiment", async (_evnet, dto: ExperimentDto) => {
  return createExperiment(dto);
});

ipcMain.handle("loadQuestions", async (_evnet, id: number) => {
  return loadQuestions(id);
});

ipcMain.handle("loadExperiments", async (_evnet) => {
  return loadExperiments();
});
