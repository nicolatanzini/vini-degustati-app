let vini = [];
console.log("Script caricato!");
let vinoSelezionato = null;

// Carica tutti i vini all'avvio
window.onload = async function() {
  await aggiornaVini();
  // Il pulsante verrà mostrato dalla funzione di ricerca se serve
};

// Aggiorna la lista vini dal backend
async function aggiornaVini() {
  const res = await fetch("/api/vini");
  vini = await res.json();
  if (!Array.isArray(vini)) vini = [];
}

// Funzione per normalizzare (minuscole, spazi, accenti rimossi)
function normalize(str) {
  return str ? str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
}

// Ricerca live
function ricercaLiveVini() {
  console.log("VINI ARRAY:", vini);
  let query = normalize(document.getElementById("ricercaVino").value);
  let risultati = vini.filter(v =>
    (v.Produttore && normalize(v.Produttore).includes(query)) ||
    (v.Etichetta && normalize(v.Etichetta).includes(query)) ||
    (v.Millesimo && normalize(v.Millesimo).includes(query)) ||
    (v.Disciplinare && normalize(v.Disciplinare).includes(query))
  );
  console.log("Risultati trovati:", risultati);

  let lista = document.getElementById("listaRisultati");
  lista.innerHTML = "";
  document.getElementById("formVinoDiv").style.display = "none";
  document.getElementById("formDegDiv").style.display = "none";
  vinoSelezionato = null;

  if (query === "") {
    console.log("Query vuota, nascondo pulsante.");
    document.getElementById("addVinoDiv").style.display = "none";
    return;
  }

  if (risultati.length > 0) {
    console.log("Vini trovati, mostro risultati e pulsante.");
    let html = "<b>Seleziona il vino:</b><ul>";
    risultati.forEach(v => {
      html += `<li>
        <button onclick='selezionaVino(${v.ID})'>${v.Produttore} - ${v.Etichetta} (${v.Millesimo}, ${v.Disciplinare})</button>
      </li>`;
    });
    html += "</ul>";
    lista.innerHTML = html;
    document.getElementById("addVinoDiv").style.display = "block";
  } else {
    console.log("Nessun vino trovato, mostro pulsante aggiunta.");
    lista.innerHTML = "<i>Nessun vino trovato.</i>";
    document.getElementById("addVinoDiv").style.display = "block";
  }
}

function mostraFormVino() {
  document.getElementById("formVinoDiv").style.display = "block";
  document.getElementById("formDegDiv").style.display = "none";
}

function annullaVino() {
  document.getElementById("formVino").reset();
  document.getElementById("formVinoDiv").style.display = "none";
}

document.getElementById("formVino").onsubmit = async function(e) {
  e.preventDefault();
  let form = e.target;
  let vino = {};
  for (let el of form.elements) {
    if (el.name) vino[el.name] = el.value;
  }
  // Salva vino su backend
  const res = await fetch("/api/vini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vino })
  });
  const data = await res.json();
  if (data.ok) {
    vinoSelezionato = data.vino;
    await aggiornaVini();
    document.getElementById("formVinoDiv").style.display = "none";
    mostraFormDegustazione();
  } else {
    notifica("Errore nel salvataggio del vino!", true);
  }
};

function selezionaVino(id) {
  vinoSelezionato = vini.find(v => v.ID === id);
  mostraFormDegustazione();
}

function mostraFormDegustazione() {
  document.getElementById("formDegDiv").style.display = "block";
  document.getElementById("vinoSelezionato").innerText = `${vinoSelezionato.Produttore} - ${vinoSelezionato.Etichetta} (${vinoSelezionato.Millesimo})`;
}

function annullaDeg() {
  document.getElementById("formDegustazione").reset();
  document.getElementById("formDegDiv").style.display = "none";
}

document.getElementById("formDegustazione").onsubmit = async function(e) {
  e.preventDefault();
  let form = e.target;
  let degustazione = {};
  for (let el of form.elements) {
    if (el.name) degustazione[el.name] = el.value;
  }
  degustazione.ID_Vino = vinoSelezionato.ID;
  // Salva degustazione su backend
  const res = await fetch("/api/degustazioni", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ degustazione })
  });
  const data = await res.json();
  if (data.ok) {
    annullaDeg();
    annullaVino();
    notifica("Degustazione registrata con successo!");
    document.getElementById("ricercaVino").value = "";
    document.getElementById("listaRisultati").innerHTML = "";
    vinoSelezionato = null;
    await aggiornaVini();
  } else {
    notifica("Errore nel salvataggio della degustazione!", true);
  }
};

function notifica(msg, errore) {
  let div = document.getElementById("notifica");
  div.innerHTML = msg;
  div.style.color = errore ? "red" : "green";
  setTimeout(() => div.innerHTML = "", 3500);
}
