import request from 'request';

//-----------------------------------------------------------------------------------------------------------------------------------
// LIST FUNCTION 
//-----------------------------------------------------------------------------------------------------------------------------------
const list = function(argv, url){
    const baseURL = 'https://rickandmortyapi.com/api/character/';

    //-------------------------------------------------------------------------------------------------------------
    // SEARCH BY NAME
    //-------------------------------------------------------------------------------------------------------------
    if (argv.search){
        const url = `${baseURL}?page=1&name=${argv.search}`;
        console.log(url);
        request({url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(response.body.results[i].name + "----" + url);

                if(response.body.info.next != ''){
                    let newUrl = response.body.info.next;
                    list(argv, newUrl);
                }

            });
        });
    }

    //-------------------------------------------------------------------------------------------------------------
    // SEARCH BY STATUS
    //-------------------------------------------------------------------------------------------------------------
    else if (argv.status){
        const url = `${baseURL}?page=${argv.page}&status=${argv.status}`;
        
        request({url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(response.body.results[i].name);
            });
        });        
    }

    //-------------------------------------------------------------------------------------------------------------
    // LIST ALL CHARACTERS
    //-------------------------------------------------------------------------------------------------------------
    else {
        const url = `${baseURL}?page=${argv.page}`;

        request({url, json: true}, (error, response) => {
            response.body.results.forEach((elem, i) => {
                console.log(response.body.results[i].name); //show character's names by page
            });
        });
    }
}

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
export {list};