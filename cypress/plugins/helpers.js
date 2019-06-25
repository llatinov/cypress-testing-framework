const fs = require('fs');
const path = require('path');

const deleteFolderRecursive = folder => {
  fs.readdirSync(folder).forEach(file => {
    const curPath = `${folder}/${file}`;
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteFolderRecursive(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(folder);
};

const deleteParentFolders = folder => {
  const parent = folder.startsWith('.') ? folder : path.dirname(folder);
  if (fs.existsSync(parent) && !fs.readdirSync(parent).length) {
    fs.rmdirSync(parent);
    deleteParentFolders(parent);
  }
};

const deleteFile = filePath => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    const parent = path.dirname(filePath);
    deleteParentFolders(parent);
  }
};

const mkdirRecursive = folder => {
  let fullPath = '';
  if (!fs.existsSync(fullPath)) {
    folder.split(path.sep).forEach(child => {
      fullPath += `${child}${path.sep}`;
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
      }
    });
  }
};

const writeFile = (filePath, content) => {
  const parent = path.dirname(filePath);
  if (!fs.existsSync(parent)) {
    mkdirRecursive(parent);
  }
  fs.writeFileSync(filePath, content);
};

module.exports = {
  deleteFolderRecursive,
  deleteParentFolders,
  deleteFile,
  writeFile,
};
