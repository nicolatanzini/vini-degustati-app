const fs = require("fs");
const csv = require("csv-parser");
const Database = require("@replit/database");
const db = new Database();

// ---- IMPORTA VINI ----
function importaVini() {
  return new Promise((resolve, reject) => {
    let vini = [];
    if (!fs.existsSync("vini.csv")) {
      console.log("Attenzione: il file vini.csv non è presente!");
      resolve([]); return;
    }
    fs.createReadStream("vini.csv")
      .pipe(csv())
      .on("data", (row) => {
        vini.push({
          Produttore: row.Produttore,
          Etichetta: row.Etichetta,
          Millesimo: row.Millesimo,
          Disciplinare: row.Disciplinare,
          Dosaggio: row.Dosaggio,
          Vigna_Clos_Lieu_Dit_Climat: row.Vigna_Clos_Lieu_Dit_Climat || "",
          // aggiungi altri campi se ci sono!
        });
      })
      .on("end", async () => {
        vini.forEach((v, i) => v.ID = i + 1);
        await db.set("viniList", vini);
        console.log("Import vini completato! Totale vini importati:", vini.length);
        resolve(vini);
      });
  });
}

// ---- IMPORTA DEGUSTAZIONI ----
function importaDegustazioni() {
  return new Promise((resolve, reject) => {
    let degustList = [];
    if (!fs.existsSync("degustazioni.csv")) {
      console.log("Attenzione: il file degustazioni.csv non è presente!");
      resolve([]); return;
    }
    fs.createReadStream("degustazioni.csv")
      .pipe(csv())
      .on("data", (row) => {
        degustList.push({
          ID_Vino: parseInt(row.ID_Vino),
          DegustazioneVisiva: row.DegustazioneVisiva,
          DegustazioneOlfattiva: row.DegustazioneOlfattiva,
          DegustazioneGustativa: row.DegustazioneGustativa,
          DegustazioneGiudizioGenerale: row.DegustazioneGiudizioGenerale,
          Valutazione: row.Valutazione,
          DataDegustazione: row.DataDegustazione,
          LuogoDegustazione: row.LuogoDegustazione,
          Prezzo: row.Prezzo
          // altri campi se presenti!
        });
      })
      .on("end", async () => {
        degustList.forEach((d, i) => d.ID = i + 1);
        await db.set("degustList", degustList);
        console.log("Import degustazioni completato! Totale degustazioni importate:", degustList.length);
        resolve(degustList);
      });
  });
}

// ---- AVVIO IMPORT ----
(async () => {
  await importaVini();
  await importaDegustazioni();
  console.log("IMPORT COMPLETATO! Puoi ora accedere alla web app.");
  process.exit(0);
})();
