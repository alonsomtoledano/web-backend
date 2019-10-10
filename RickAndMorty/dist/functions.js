"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = void 0;

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//list function
var list = function list(argv) {
  var baseURL = 'https://rickandmortyapi.com/api/';
  var consultCharacters = 'character/';
  var consultPage = '?page=';
  var consultName = '&name='; //request to RickAndMorty's API

  if (false) {
    //list characters
    var url = "".concat(baseURL).concat(consultCharacters).concat(consultPage).concat(argv.page);
    (0, _request["default"])({
      url: url,
      json: true
    }, function (error, response) {
      response.body.results.forEach(function (elem, i) {
        console.log("".concat(i, ": ").concat(response.body.results[i].name)); //show character's names by page
      });
    });
  } else if (argv.search != undefined) {
    //search a character by name
    var _url = "".concat(baseURL).concat(consultCharacters).concat(consultPage).concat(argv.page).concat(consultName).concat(argv.search);

    (0, _request["default"])({
      url: _url,
      json: true
    }, function (error, response) {
      response.body.results.forEach(function (elem, i) {
        console.log(response.body.results[i].name);
      });
    });
  }
};

exports.list = list;