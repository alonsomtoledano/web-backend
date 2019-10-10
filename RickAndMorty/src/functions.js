import request from 'request';

//list function
const list = function(argv){
    //make url
    const baseURL = 'https://rickandmortyapi.com/api/';
    const consultCharacters = 'character/';
    const consultPage = '?page='
    const url = `${baseURL}${consultCharacters}${consultPage}${argv.page}`;

    //request to RickAndMorty's API
    if (true){ //list characters
        request({url: url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(`${i}: ${response.body.results[i].name}`); //show character's names by page
            });
        });
    }
    else if (argv.search != undefined){
        request({url: url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                
                console.log(`${i}: ${response.body.results[i].name}`); //show character's names by page
            });
        });
    }

}

export {list};

//console.log(response.body.results[0].name)