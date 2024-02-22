const fs = require("fs");
const path = require("path");

const paths = {
  folder: path.join(__dirname, "../config"),
  fileName: "configAPI.json",
};

file = path.join(paths.folder, paths.fileName);

//save data to the file
// and check if the file exists or not pluse folder

function saveDataToFile(data, rewrite = false) {
  if (!fs.existsSync(paths.folder)) {
    fs.mkdirSync(paths.folder);
    fs.writeFileSync(file, JSON.stringify(data));
    return;
  }
  // solve overwrite the file
  if (!rewrite) {
    getOldData = readDataFromFile();
    newData = { ...getOldData, ...data };
    fs.writeFileSync(file, JSON.stringify(newData));
  } else { 

    fs.writeFileSync(file, JSON.stringify(data));

  }
  return;
}

//read data from the file

function readDataFromFile() {
  if (!fs.existsSync(file)) {
    return null;
  }
  let data;
  try {
    data = fs.readFileSync(file, "utf8");
  } catch (err) {
    console.log(err);
    return error;
  }
  if (data.length == 0) return null;

  return JSON.parse(data);
}

//check for special flag
function checkForSpecialFlag(flagname) {
  let dataObject = readDataFromFile();
  console.log("data from check for sepcial flage: ", dataObject);

  if (dataObject == null) return false; // the file not exist or empty flag

  //check if the flag is exist or not

  if (flagname in dataObject) return true;
  return false; // the flag not exist
}

//get the value of the flag
function getFlagValue(flagname) {
  let dataObject = readDataFromFile();
  if (dataObject == null) return null; // the file not exist or empty flag
  if (flagname in dataObject) return dataObject[flagname];
  return null; // the flag not exist
}



//save data to the dynamic file name 
async function saveDataToDynamicFile(data, fileName ,rewrite = false) {
  const  DynamicPathSet = path.join(paths.folder, fileName);
  if (!fs.existsSync(paths.folder)) {
    fs.mkdirSync(paths.folder);
    fs.writeFileSync(fileName, JSON.stringify(data));
    return;
  }

  if (!rewrite) {
    getOldData = getDataformDynamicFile(fileName);

    newData = { ...getOldData, ...data };
    console.log("new data: ", newData);
    fs.writeFileSync (DynamicPathSet, JSON.stringify(newData));
  } else {
    fs.writeFileSync(DynamicPathSet, JSON.stringify(data));

  }
 return;
}

//get data from the dynamic file name
function getDataformDynamicFile(fileName) {
  const  DynamicPathSet = path.join(paths.folder, fileName);
  if (!fs.existsSync(DynamicPathSet)) {
    return null;
  }
  let data;
  try {
    data = fs.readFileSync(DynamicPathSet, "utf8");
  } catch (err) {
    console.log(err);
    return error;
  }
  if (data.length == 0) return null;

  return JSON.parse(data);
}


// export this in js module not in node js

module.exports = {
  saveDataToFile: saveDataToFile,
  readDataFromFile: readDataFromFile,
  checkForSpecialFlag: checkForSpecialFlag,
  getFlagValue: getFlagValue,
  saveDataToDynamicFile: saveDataToDynamicFile,
  getDataformDynamicFile: getDataformDynamicFile,
};
