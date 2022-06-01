const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", require("./routes"));
app.use("/files", express.static("uploads"));
app.listen(3000, () => console.log("Corriendo..."));
