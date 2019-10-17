"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = void 0;

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//-----------------------------------------------------------------------------------------------------------------------------------
// LIST FUNCTION 
//-----------------------------------------------------------------------------------------------------------------------------------
var baseURL = 'https://rickandmortyapi.com/api/character/';
var url = "".concat(baseURL, "?page=1&name=").concat(argv.search);

var list = function list(argv, url) {
  //const baseURL = 'https://rickandmortyapi.com/api/character/';
  //-------------------------------------------------------------------------------------------------------------
  // SEARCH BY NAME
  //-------------------------------------------------------------------------------------------------------------
  if (argv.search) {
    //const url = `${baseURL}?page=1&name=${argv.search}`;
    (0, _request["default"])({
      url: url,
      json: true
    }, function (error, response) {
      response.body.results.forEach(function (elem, i) {
        console.log(response.body.results[i].name + "----" + url);

        if (response.body.info.next != '') {
          var newUrl = response.body.info.next;
          list(argv, newUrl);
        }
      });
    });
  } //-------------------------------------------------------------------------------------------------------------
  // SEARCH BY STATUS
  //-------------------------------------------------------------------------------------------------------------
  else if (argv.status) {
      var _url = "".concat(baseURL, "?page=").concat(argv.page, "&status=").concat(argv.status);

      (0, _request["default"])({
        url: _url,
        json: true
      }, function (error, response) {
        response.body.results.forEach(function (elem, i) {
          console.log(response.body.results[i].name);
        });
      });
    } //-------------------------------------------------------------------------------------------------------------
    // LIST ALL CHARACTERS
    //-------------------------------------------------------------------------------------------------------------
    else {
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
/*
//-----------------------------------------------------------------------------------------------------------------------------------
// VIEW FUNCTION 
//-----------------------------------------------------------------------------------------------------------------------------------
const view = function(argv){
    const baseURL = 'https://rickandmortyapi.com/api/character/';
    const url = `${baseURL}?page=${argv.page}`;

    request({url, json: true}, (error, response) => {
        response.body.results.forEach((elem, i) => {
            if(response.body.results[i].name == argv.name){
                console.log(`Nombre: ${response.body.results[i].name}\nEstado: ${response.body.results[i].status}\nEspecie: ${response.body.results[i].species}\nGenero: ${response.body.results[i].gender}\nOrigen: ${response.body.results[i].origin.name}\nLocalizacion: ${response.body.results[i].location.name}`);
            }  
        });
    });
}
*/


exports.list = list;