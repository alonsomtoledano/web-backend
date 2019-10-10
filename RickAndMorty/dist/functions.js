"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = void 0;

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//list function
var list = function list(argv) {
  //make url
  var baseURL = 'https://rickandmortyapi.com/api/';
  var consultCharacters = 'character/';
  var consultPage = '?page=';
  var url = "".concat(baseURL).concat(consultCharacters).concat(consultPage).concat(argv.page); //request to RickAndMorty's API

  (0, _request["default"])({
    url: url,
    json: true
  }, function (error, response) {
    response.body.results.forEach(function (elem, i) {
      console.log("".concat(i, ": ").concat(response.body.results[i].name)); //show different location names to choose
    });
  });
}; //console.log(response.body.results[0].name)


exports.list = list;