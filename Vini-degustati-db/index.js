const express = require("express");
const Database = require("@replit/database");
const db = new Database();
const app = express();

app.use(express.json());
app.use(express.static('public')); // Serve i file statici della cartella public

// API: aggiungi vino
app.post("/api/vini", async (req, res) => {
  const { vino } = req.body;
  let viniList = (await db.get("viniList")) || [];
  let newID = viniList.length ? Math.max(...viniList.map(v => v.ID)) + 1 : 1;
  vino.ID = newID;
  viniList.push(vino);
  await db.set("viniList", viniList);
  res.json({ ok: true, vino });
});

// API: aggiungi degustazione
app.post("/api/degustazioni", async (req, res) => {
  const { degustazione } = req.body;
  let degustList = (await db.get("degustList")) || [];
  let newID = degustList.length ? Math.max(...degustList.map(d => d.ID)) + 1 : 1;
  degustazione.ID = newID;
  degustList.push(degustazione);
  await db.set("degustList", degustList);
  res.json({ ok: true, degustazione });
});

// API: lista vini
app.get("/api/vini", async (req, res) => {
  let viniList = (await db.get("viniList")) || [];
  res.json(viniList);
});

// API: lista degustazioni
app.get("/api/degustazioni", async (req, res) => {
  let degustList = (await db.get("degustList")) || [];
  res.json(degustList);
});

app.listen(3000, () => {
  console.log("Server avviato sulla porta 3000");
});
