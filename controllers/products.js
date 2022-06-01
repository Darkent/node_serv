const util = require("../utils");
const product = {};

product.getProducts = async (req, res) => {
  let data = await util.readData("products");

  data = data.split(util.separate()).map((i) => {
    const [id, name, size, color, itemCode, price, stock, stock_min, image] =
      i.split(";");
    return {
      id,
      name,
      size,
      color,
      itemCode,
      price,
      stock,
      stock_min,
      image,
    };
  });

  let { name, color, size } = req.query;
  if (name) {
    data = data.filter((d) =>
      d.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (color) {
    data = data.filter((d) => d.color.toLowerCase() == color.toLowerCase());
  }
  if (size) {
    data = data.filter((d) => Number(d.size) == Number(size));
  }

  data = data.slice(0, 20);
  res.json({ success: true, data });
};

product.setProduct = async (req, res) => {
  let { name, size, color, codItem, price, stock, stock_min, image } = req.body;
};
product.getColors = async (req, res) => {
  let data = await util.readData("colors");
  data = data.split(util.separate()).map((i) => {
    const [id, description] = i.split(";");
    return {
      id,
      description,
    };
  });

  res.json({ success: true, data });
};

product.getSizes = async (req, res) => {
  let data = await util.readData("sizes");
  data = data.split(util.separate()).map((i) => {
    const [id, size] = i.split(";");
    return {
      id,
      size,
    };
  });

  res.json({ success: true, data });
};
module.exports = product;
