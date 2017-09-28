# Install

`npm install https://github.com/DavidBernal/load-folder`


# Usage example

Your structure
```
project
│   README.md
│   file001.txt    
│
└───controllers
│   │   controller1.js
│   │   controller2.js
│   │   ...
...
```

You need do `var controller1 = require('./controllers/controller1')`

With this module...

In controller folder, create `index.js` and copy/paste

```
module.exports = require('load-folder')({respect: true}); // see code for respect option
```

Now you can do `var controllers = require('/controllers')` and this is an object like:
```
{
  controller1: module,
  controller2: module
}
```


