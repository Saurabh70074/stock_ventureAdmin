const AWS = require("aws-sdk");
const AppConfig = require("../config/config");
const bcrypt = require("bcrypt");

// Upload assessment data to S3
const uploadLogToS3 = (key, data) => {
  return new Promise(async (resolve, reject) => {
    let s3bucket = new AWS.S3({
      secretAccessKey: AppConfig.AWS_SECRET,
      accessKeyId: AppConfig.AWS_KEY,
      Bucket: AppConfig.AWS_LOG_BUCKET,
    });
    let param = {
      Bucket: AppConfig.AWS_LOG_BUCKET,
      Key: key,
      ContentType: "binary",
      Body:
        typeof data == "string"
          ? Buffer.from(data, "binary")
          : Buffer.from(JSON.stringify(data), "binary"),
    };
    s3bucket.putObject(param, (err, data) => {
      resolve({ error: err, body: data });
    });
  });
};

const isValidDate = (date) => {
  if (Date.parse(date.toString())) {
    return true;
  } else {
    return false;
  }
};

const isEmptyValue = (keyValue) => {
  if (
    keyValue === null ||
    keyValue === "null" ||
    keyValue === undefined ||
    keyValue === "undefined" ||
    keyValue === ""
  ) {
    return true;
  } else {
    return false;
  }
};

const getTableAlias = (s) => {
  let strArr;
  if (s.includes("_")) {
    strArr = s.split("_");
  } else {
    strArr = s.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
  }
  let alias = "";
  if (strArr.length == 1) {
    alias += strArr[0][0] + strArr[0][1] + strArr[0][2];
  } else {
    for (let i = 0; i < strArr.length; i++) {
      alias += strArr[i][0] + strArr[i][1];
    }
  }
  return alias;
};

const toCamelCase = (s, dataset = false) => {
  let n = s.length;
  let str = "";
  for (let i = 0; i < n; i++) {
    if (dataset && i == 0) {
      str += s[i].toUpperCase();
    } else {
      if (s[i] == " " || s[i] == "_" || s[i] == "-") {
        str += s[i + 1].toUpperCase();
        i++;
      } else {
        str += s[i];
      }
    }
  }
  return str;
};

const convertDataToSchemaFormat = (resultSet) => {
  const dataSchema = resultSet.map((result) => {
    return {
      sql: result.sql,
      title: result.dataSetName,
      dimensions: formatColumns(result.dimensions),
      measures: formatColumns(result.measures, result.dimensions),
      ...(result.refreshKey && { refreshKey: result.refreshKey }),
      databaseName: result.databaseName,
      tableName: result.tableName,
    };
  });
  return dataSchema;
};

const formatColumns = (data, dimension = undefined) => {
  const measures = {};
  data.forEach((column) => {
    let { name, sql, type, format, filter, drillMembers } = column;
    if (name == "count") {
      measures[name] = {
        type,
        drillMembers: fillDrillMembers(dimension),
        ...(format != "" && { format }),
        ...(filter.length && { filters: filter }),
      };
    } else {
      measures[name] = {
        sql,
        type,
        ...(format != "" && { format }),
        ...(filter.length && { filters: filter }),
      };
    }
    if (column.case) {
      measures[name]["case"] = column.case;
      delete measures[name].sql;
      //measures[name].remove('sql')
    }
  });
  return measures;
};

const isBoolean = (str) => {
  if (str === "true" || str === true || str === "false" || str === false)
    return true;
  else return false;
};

async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function comparePassword(password, candidatePassword) {
  const result = await bcrypt.compare(password, candidatePassword);
  return result;
}

module.exports = {
  uploadLogToS3,
  isValidDate,
  isEmptyValue,
  toCamelCase,
  getTableAlias,
  convertDataToSchemaFormat,
  isBoolean,
  encryptPassword,
  comparePassword
};
