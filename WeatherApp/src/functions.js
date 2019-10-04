import request from 'request';

//search function
const search = function(argv){
    //make urlMapBox
    const baseURLMapBox = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const tokenMapBox = 'pk.eyJ1IjoiYWdlbnRlYWxmYSIsImEiOiJjazFhbzB3MjMwbHBmM2Nxd3lyZ3FqaTBqIn0.JpWC1jHr0UQY1NWDVsnc3w';
    const location = argv.location;
    const urlMapBox = `${baseURLMapBox}${location}.json?access_token=${tokenMapBox}`;
  
    //request to MapBox's API
    request({ url: urlMapBox, json: true }, (error, response) => {
      if (argv.index == undefined){ //user not give index
        response.body.features.forEach((elem, i) => {
          console.log(`${i}: ${response.body.features[i].place_name}`); //show different location names to choose
        });
      }
      else if (argv.index >= 0 && argv.index < response.body.features.length) { //control if index is between 0 and max index reachable
        //make urlDarkSky
        const locationCoordinatesLong = response.body.features[argv.index].geometry.coordinates[0]; //longitude coordinate
        const locationCoordinatesLat = response.body.features[argv.index].geometry.coordinates[1]; //latitude coordinate
        const location = response.body.features[argv.index].place_name;
        const baseURLDarkSky = 'https://api.darksky.net/';
        const tokenDarkSky = '1ee0ccda03643104152c845cb3b52622/';
        const endpointDarkSky = `${baseURLDarkSky}forecast/${tokenDarkSky}`;
        const urlDarkSky = `${endpointDarkSky}${locationCoordinatesLat},${locationCoordinatesLong}?units=si`;
  
        //request to DarkSky's API
        request({ url: urlDarkSky, json: true }, (error, response) => {
          console.log(`Temperatura en ${location}: ${response.body.currently.temperature} grados centigrados`); //show actual temperature
        });
      }
      else console.log("Invalid Index"); //Invalid message to an incorrect index
    });
  }

  export {search}; //export finction search