const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static('public'));

const viniFile = "vini.json";
const degustazioniFile = "degustazioni.json";

function loadFile(file) {
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  }
  return [];
}
function saveFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.post("/api/vini", (req, res) => {
  let viniList = loadFile(viniFile);
  let newID = viniList.length ? Math.max(...viniList.map(v => v.ID)) + 1 : 1;
  let vino = req.body.vino;
  vino.ID = newID;
  viniList.push(vino);
  saveFile(viniFile, viniList);
  res.json({ ok: true, vino });
});

app.post("/api/degustazioni", (req, res) => {
  let degustList = loadFile(degustazioniFile);
  let newID = degustList.length ? Math.max(...degustList.map(d => d.ID)) + 1 : 1;
  let degustazione = req.body.degustazione;
  degustazione.ID = newID;
  degustList.push(degustazione);
  saveFile(degustazioniFile, degustList);
  res.json({ ok: true, degustazione });
});

app.get("/api/vini", (req, res) => {
  res.json(loadFile(viniFile));
});

app.get("/api/degustazioni", (req, res) => {
  res.json(loadFile(degustazioniFile));
});

app.listen(3000, () => {
  console.log("Server avviato sulla porta 3000");
});
