const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uuid = uuidv4();
    cb(null, uuid + "." + file.originalname.split(".").slice(-1)[0]);
  },
});
const upload = multer({ storage });
const orden = require("./controllers/orden");
const products = require("./controllers/products");

router.post("/login", orden.login);
router.post("/register", orden.register);

router.get("/ordens", orden.ordens);
router.delete("/orden/:id", orden.ordenDelete);

router.get("/emails", orden.emails);
router.post(
  "/orden",
  //   controller.auth,
  upload.single("file"),
  orden.createOrden
);

router.get("/products", products.getProducts);
router.get("/colors", products.getColors);
router.get("/sizes", products.getSizes);

module.exports = router;
