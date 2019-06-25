const fs = require('fs');
const helpers = require('./helpers');

const cleanUpResults = specName =>
  new Promise(resolve => {
    if (fs.existsSync(specName)) {
      helpers.deleteFolderRecursive(specName);
    }
    helpers.deleteParentFolders(specName);
    resolve(`${specName} deleted`);
  });

const copyFile = args =>
  new Promise(resolve => {
    if (fs.existsSync(args.from)) {
      fs.writeFileSync(args.to, fs.readFileSync(args.from));
      resolve(`File ${args.from} copied to ${args.to}`);
    }
    resolve(`File ${args.from} not existing`);
  });

module.exports = {
  cleanUpResults,
  copyFile,
};
