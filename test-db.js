const Database = require("@replit/database");
const db = new Database();
db.get("viniList").then(vini => {
  console.log("Vini attualmente nel DB:", vini);
});
