import electron, { ipcMain } from "electron";
import nodePath from "path";

const userDataPath = electron.app.getPath("userData");

function openFile(path: string, callback: (err: Error) => void) {
  var cmd = ``;
  switch (
    require(`os`)
      .platform()
      .toLowerCase()
      .replace(/[0-9]/g, ``)
      .replace(`darwin`, `macos`)
  ) {
    case `win`:
      path = path || "=";
      cmd = `explorer`;
      break;
    case `linux`:
      path = path || "/";
      cmd = `xdg-open`;
      break;
    case `macos`:
      path = path || "/";
      cmd = `open`;
      break;
  }
  let p = require(`child_process`).spawn(cmd, [path]);
  p.on("error", (err) => {
    p.kill();
    return callback(err);
  });
}

ipcMain.handle("openFile", async (_evnet, experimentID: string) => {
  const answersPath = nodePath.join(
    userDataPath,
    "answers",
    `${experimentID}.csv`
  );
  return openFile(answersPath, (err) => console.error(err));
});
