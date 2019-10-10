import request from 'request';

//list function
const list = function(argv){
    const baseURL = 'https://rickandmortyapi.com/api/character/';

    if (argv.search != undefined){ //search a character by name
        const url = `${baseURL}?page=${argv.page}&name=${argv.search}`;

        request({url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(response.body.results[i].name);
            });
        });
    }
    else if (argv.status != undefined){
        const url = `${baseURL}?page=${argv.page}&status=${argv.status}`;
        
        request({url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(response.body.results[i].name);
            });
        });        
    }
    else { //list characters
        const url = `${baseURL}?page=${argv.page}`;

        request({url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(response.body.results[i].name); //show character's names by page
            });
        });
    }
}

//view function
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

export {list, view};