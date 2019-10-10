import request from 'request';

//list function
const list = function(argv){
    const baseURL = 'https://rickandmortyapi.com/api/';
    const consultCharacters = 'character/';
    const consultPage = '?page='
    const consultName = '&name='

    //request to RickAndMorty's API
    if (false){ //list characters
        const url = `${baseURL}${consultCharacters}${consultPage}${argv.page}`;

        request({url: url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(`${i}: ${response.body.results[i].name}`); //show character's names by page
            });
        });
    }
    else if (argv.search != undefined){ //search a character by name
        
        const url = `${baseURL}${consultCharacters}${consultPage}${argv.page}${consultName}${argv.search}`;

        request({url: url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(response.body.results[i].name);
            });
        });
    }

}

export {list};