const utils = require("nodemon/lib/utils");

const fs = require("fs").promises;

let util = {};
util.ordenProperties = () => [
  "id",
  "date",
  "total",
  "description",
  "file",
  "userId",
];
util.path = (name) => `./files/${name}.txt`;
util.readData = async (pathName) => {
  let data = await fs.readFile(util.path(pathName), "utf8");

  return data;
};

util.writeData = async (pathName, data) => {
  await fs.appendFile(util.path(pathName), data, "utf8", (err) => {
    if (err) {
      throw new Error("No se pudó leer el archivo");
    } else {
      return true;
    }
  });
};
util.reWriteData = async (pathName, data) => {
  await fs.writeFile(util.path(pathName), data, "utf8", (err) => {
    if (err) {
      throw new Error("No se pudó leer el archivo");
    } else {
      return true;
    }
  });
};
util.checkemail = async (toFind) => {
  let data = await util.readData("users");

  if (data) {
    data = data.split("\r\n");

    if (data.length == 0) {
      return true;
    }
  } else {
    return true;
  }

  data = data.map((d) => {
    let [_, toFind] = d.split(";");
    return toFind;
  });

  return !data.some(
    (d) => d.trim().toLowerCase() == toFind.trim().toLowerCase()
  );
};

//responses

util.serverError = (res, message = "Ocurrió un error") =>
  res.status(500).json({ message, success: false });
util.clientErrorData = (res, message = "Verifique los datos") =>
  res.status(400).json({ message, success: false });

util.formatData = async (args, path) => {
  let data = await util.readData(path);
  //

  data = data.split("\r\n");

  if (data.length == 0) {
    return [];
  }
  if (data[0].length == 0) {
    return [];
  }
  data = data
    .filter((d) => d.length > 1)
    .map((d) => {
      let obj = {};
      let values = d.split(";");
      args.forEach((propertie, idx) => {
        obj[propertie] = values[idx];
      });
      return obj;
    });
  return data;
};

util.setId = async (type) => {
  let data = await util.readData("ids");
  data = util.destruct(data);
  let typeFound = data.find((d) => {
    let key = Object.keys(d)[0];

    return key == type;
  });
  let lastId = Number(Object.values(typeFound)[0]) + 1;
  data = util.struct(data, type, lastId);
  await util.reWriteData("ids", data);
  return lastId;
};
util.struct = (datas, type, value) => {
  let data = datas.map((d) => {
    let key = Object.keys(d)[0];
    let val;

    if (key == type) {
      val = value.toString();
    } else {
      val = Object.values(d)[0];
    }
    return `${key};${val}`;
  });
  data = data.join("\r\n");
  return data;
};
util.formatSave = (datas) => {
  data = datas.map((d) => {
    let record = "";
    Object.values(d).forEach((d) => {
      if (record.length == 0) {
        record += `${d}`;
      } else {
        record += `;${d}`;
      }
    });
    return record;
  });
  data = data.join("\r\n");
  return data;
};
util.destruct = (data) => {
  data = data.split("\r\n").map((i) => {
    const [type, id] = i.split(";");
    return {
      [type]: id,
    };
  });
  return data;
};
module.exports = util;
