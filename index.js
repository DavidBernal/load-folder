var files;
var routePath;
var fs = require('fs');
var path = require('path');
var parentModule = require('parent-module');

module.exports = function(options){
  var respect = (options && options.respect) || false;
  routePath = path.join(path.dirname(parentModule()), '/');
  files = [];

  // load files
  fs.readdirSync(routePath).forEach(file => {
    if(file === 'index.js'){
      return;
    }

    let filename = file.substr(0, file.lastIndexOf('.'));
    let filePath = routePath + file;

    let mod = require(filePath);

    if(!mod instanceof Object || mod instanceof Function || respect){
      let content = mod;
      mod = {};
      mod[filename] = content;
    }

    files.push(mod);
  });

  // join all files in a single object
  var allFiles = files.reduce(function(result = {}, middle){
    return Object.assign(result, middle);
  });

  return allFiles;
};
