const express = require("express");
const cors = require("cors");
const path = require("path");
const { platform, type } = require("os");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", require("./routes"));
app.use("/files", express.static("uploads"));
app.listen(process.env.PORT || 3000, () => {
  let p = `./files/products.txt`;

  console.log(type());

  console.log("Corriendo...");
});
