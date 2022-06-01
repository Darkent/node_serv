const fs = require("fs");
const jwt = require("jsonwebtoken");
const util = require("../utils");
const { v4: uuidv4 } = require("uuid");
const { json } = require("express/lib/response");
let controller = {};
//middleware
controller.auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "No está autenticado" });
  }

  let token = req.headers.authorization;
  let payload;
  try {
    payload = jwt.verify(token, '$"#FDSEWw5dsa5');
  } catch (e) {
    return res.status(401).json({
      message: "Token expiró.",
    });
  }

  if (!payload.email) {
    return res.status(401).json({
      message: "No está autenticado",
    });
  }

  next();
};

controller.login = async (req, res) => {
  let { email, password } = req.body;
  if (email && password) {
    try {
      let data = await util.readData("users");
      let [_, emailDb, passwordDb] = data.split(";");

      if (emailDb == email && passwordDb == password) {
        const token = jwt.sign({ email }, '$"#FDSEWw5dsa5');
        return res.json({ email, token, success: true });
      } else {
        return util.clientErrorData(res);
      }
    } catch (e) {
      console.log(e);
      return util.serverError(res, e);
    }
  } else {
    return util.clientErrorData(res, "La clave y el usuario son necesarios");
  }
};

controller.register = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    let isNew = await util.checkemail(email);
    if (isNew) {
      let id = await util.setId("ordens");
      await util.writeData("emails", `\r\n${id};${email};${password};guest`);
      const token = jwt.sign({ email }, '$"#FDSEWw5dsa5');
      return res.json({ sucess: true, token, id });
    } else {
      return util.clientErrorData(res, "El usuario ya existe.");
    }
  } else {
    return res.status(400).json({
      message: "La clave y el usuario son necesarios",
      success: false,
    });
  }
};

controller.createOrden = async (req, res) => {
  let { id, date, total, description, userId } = req.body;
  let filename;
  if (req.file) {
    filename = req.file.filename;
  }
  let data;
  if (id) {
    data = await util.formatData(util.ordenProperties(), "ordens");
    let index = data.findIndex((d) => d.id == id);

    if (0 > index) {
      return res.status(400).json({ message: "registro no existe" });
    }
    let toUpdate = data[index];
    //aa.pdf          aa.pdf
    if (filename != toUpdate.file) {
      if (toUpdate.file.length > 2 && req.file) {
        await fs.unlink(`./uploads/${toUpdate.file}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      if (filename) {
        toUpdate.file = filename;
      }
    }
    toUpdate = {
      ...toUpdate,
      id,
      date,
      total,
      description,
      userId,
    };
    data[index] = toUpdate;
    data = util.formatSave(data);
    await util.reWriteData("ordens", data);
    return res.json({ message: "Se actualizó", toUpdate });
  } else {
    if (date && total && description) {
      id = await util.setId("ordens");

      let orden = {
        id,
        date,
        total,
        description,
        filename,
        userId,
      };
      await util.writeData("ordens", `${Object.values(orden).join(";")}\r\n`);
      res.json({ success: true, orden });
    } else {
      if (req.file) {
        await fs.unlink(`./uploads/${filename}`, (err) => {
          if (err) {
            return util.clientErrorData(res, "Verifique los datos.");
          }
        });
      }
      return util.clientErrorData(res);
    }
  }
};

controller.emails = async (req, res) => {
  let data = await util.formatData(
    ["id", "name", "password", "role"],
    "emails"
  );
  data = data.map((d) => {
    delete d.password;
    return d;
  });
  return res.json({ data });
};

controller.ordens = async (req, res) => {
  let data = await util.formatData(util.ordenProperties(), "ordens");
  res.json({ data, success: true });
};

controller.ordenDelete = async (req, res) => {
  let { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: "El id no existe." });
  }
  let data = await util.formatData(util.ordenProperties(), "ordens");

  if (data.length == 0) {
    return res.status(400).json({ message: "No hay ordenes." });
  }
  let index = data.findIndex((d) => d.id == id);
  if (0 > index) {
    return res.status(400).json({ message: `No existe orden con el id ${id}` });
  }
  data.splice(index, 1);
  let toSave = util.formatSave(data);
  try {
    await util.reWriteData("ordens", toSave);
    res.json({ success: true, message: "Se eliminó la orden con exito" });
  } catch (e) {
    return res.status(500).json({ message: e.toString() });
  }
};
module.exports = controller;
