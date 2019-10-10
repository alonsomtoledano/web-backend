"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = void 0;

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//list function
var list = function list(argv) {
  var baseURL = 'https://rickandmortyapi.com/api/character/';

  if (argv.search != undefined) {
    //search a character by name
    var url = "".concat(baseURL, "?page=").concat(argv.page, "&name=").concat(argv.search);
    (0, _request["default"])({
      url: url,
      json: true
    }, function (error, response) {
      response.body.results.forEach(function (elem, i) {
        console.log(response.body.results[i].name);
      });
    });
  } else if (argv.status != undefined) {
    var _url = "".concat(baseURL, "?page=").concat(argv.page, "&status=").concat(argv.status);

    (0, _request["default"])({
      url: _url,
      json: true
    }, function (error, response) {
      response.body.results.forEach(function (elem, i) {
        console.log(response.body.results[i].name);
      });
    });
  } else {
    //list characters
    var _url2 = "".concat(baseURL, "?page=").concat(argv.page);

    (0, _request["default"])({
      url: _url2,
      json: true
    }, function (error, response) {
      response.body.results.forEach(function (elem, i) {
        console.log(response.body.results[i].name); //show character's names by page
      });
    });
  }
};

exports.list = list;