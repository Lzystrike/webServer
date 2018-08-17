module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es6": true
  },
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2015,
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    // "linebreak-style": [
    //   "error",
    //   "windows"
    // ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-console": ["error", {
      "allow": ["info", "error"]
    }]
  }
};
