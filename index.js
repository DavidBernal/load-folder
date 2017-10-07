var files;
var routePath;
var fs = require('fs');
var path = require('path');
var parentModule = require('parent-module');
var respect = false;
var format = false;
var subextensions = true;

function loadFolder(options, route){
  respect = (options && options.respect) || respect;
  format = (options && options.format) || format;
  subextensions = (options && options.subextensions === false ? false  : subextensions);
  console.log(subextensions);
  routePath = route || path.join(path.dirname(parentModule()), '/');
  files = loadFiles(routePath, options);

  // join all files in a single object
  var allFiles = files.reduce(function(result = {}, middle){
    return Object.assign(result, middle);
  }, {});

  return allFiles;
};

function addModule(filename, mod){
  if (!subextensions) {
    filename = removeExtension(filename);
  }
  if (format) {
    filename = formatFilename(filename)
  }
  if (!mod instanceof Object || mod instanceof Function || respect) {
    let content = mod;
    mod = {};
    mod[filename] = content;
  }

  return mod;
}

function formatFilename(filename){
  return filename.toLowerCase().replace(/-(.)|\.(.)/g, function(match, group1, group2) {
    let toCamel = group1 ? group1 : group2;
    return toCamel.toUpperCase();
  });
}

function loadFiles(routePath, options){
  let files = [];
  fs.readdirSync(routePath).forEach(file => {
    if (file === 'index.js') {
      return;
    }

    let filePath = routePath + file;
    let filetype = fs.lstatSync(filePath);

    if (filetype.isDirectory()) {
      let folderPath = path.join(filePath, '/');
      let subfolder = loadFolder(options, folderPath);
      files.push(addModule(file, subfolder));
    }

    if (filetype.isFile() && file.substr(file.lastIndexOf('.')) === '.js' ) {
      let filename = removeExtension(file);
      let mod = require(filePath);
      files.push(addModule(filename, mod));
    }
  });

  return files;
}

function removeExtension(filename){
  let position = filename.lastIndexOf('.');
  return position === -1 ? filename : filename.substr(0, position);
}

module.exports = loadFolder;
