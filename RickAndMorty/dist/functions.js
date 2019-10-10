"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = exports.list = void 0;

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
}; //view function


exports.list = list;

var view = function view(argv) {
  var baseURL = 'https://rickandmortyapi.com/api/character/';
  var url = "".concat(baseURL, "?page=").concat(argv.page);
  (0, _request["default"])({
    url: url,
    json: true
  }, function (error, response) {
    response.body.results.forEach(function (elem, i) {
      if (response.body.results[i].name == argv.name) {
        console.log("Nombre: ".concat(response.body.results[i].name, "\nEstado: ").concat(response.body.results[i].status, "\nEspecie: ").concat(response.body.results[i].species, "\nGenero: ").concat(response.body.results[i].gender, "\nOrigen: ").concat(response.body.results[i].origin.name, "\nLocalizacion: ").concat(response.body.results[i].location.name));
      }
    });
  });
};

exports.view = view;