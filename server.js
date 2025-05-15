//----------->
//const trailerflix = require('./database/trailerflix.json'); importo directamente con require, es valido pero no es lo que me estan pidiendo
//----------->
const express = require('express');
const app = express();

//----------->
require('dotenv').config();
const PORT = process.env.PORT;

//----------->
const fs = require('fs');
const TRAILERFLIX = JSON.parse(fs.readFileSync(process.env.PATHTF, 'utf8'));

//-----------> Home
app.get('/', (req, res)=>{
    res.end(`<h1>TRAILERFLIX!!</h1>`);
});

//-----------> Todos los datos
app.get('/catalogo', (req, res)=>{
    res.send(TRAILERFLIX.sort((id1, id2)=> id1.id - id2.id));
    
});

//-----------> Búsqueda por título, f(x) orden superior

app.get('/catalogo/titulo/:title', (req, res)=>{
    let parametro = (req.params.title.trim().toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    console.log("parametro:", parametro);
    if(parametro !== "") {
        const result = TRAILERFLIX.filter(e => {
            return e.titulo.toLowerCase().includes(parametro)});
        if(result.length > 0){
            res.json(result)
        }else{
            res.json([{id: 'Error-título', descripcion: 'no se encontraron titulos'}])
        }
    }
});

//-----------> Búsqueda por categoria, f(x) orden superior

app.get('/catalogo/categoria/:cat', (req, res)=>{  
    const parametro = (req.params.cat.trim().toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if(parametro !== "") {
        const result  = TRAILERFLIX.filter(e => {
            return (e.categoria.toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g,"") == parametro;
        });
        
        if(result.length > 0){
            res.json(result)
        }else{
            res.json([{id: 'Error-Categoria', descripcion: 'no se encontraron categoria'}])
        }
    }
});

//-----------> Búsqueda por actor, f(x) orden superior

app.get('/catalogo/reparto/:act', (req, res)=>{
    let parametro = (req.params.act.trim().toLowerCase()).normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if(parametro !== "") {
        const result = TRAILERFLIX.filter(e => {return e.reparto.toLowerCase().includes(parametro)});
        console.log(result);
        if(result.length > 0){
            const rep = result.map( r =>{
                return{
                    titulo: r.titulo,
                    reparto: r.reparto
                }
            });
        res.json(rep);
        }
        else{
            res.json([{id: 'Error-reparto', descripcion: 'no se encontraron actores'}])
        }
}});

//-----------> Búsqueda por id, f(x) orden superior

app.get('/catalogo/trailer/:id', (req, res)=>{

    let parametro = req.params.id.trim().toLowerCase();
    let result = TRAILERFLIX.find(e => e.id == parametro);
    console.log(result);
    if(result !== undefined) {
        if(result?.trailer){
            res.json(
                {
                    Id: result.id,
                    Titulo: result.titulo,
                    Trailer: result.trailer,
                }
            );
        }
        else{
            res.json([{id: 'Error-Trailer', descripcion: 'no posee trailer'}])
        }
    }
    else
        {
            res.json([{id: 'Error-id', descripcion: 'no se encontro el ID ingresado'}])
        }
    });

//-----------> Si la ruta no existe

app.use((req, res)=>{
    res.status(404).send('<h1>Error 404 - Not found!</h1>');
});

//-----------> Escuchando al servidor

app.listen(PORT, () =>{
    console.log(`Puerto funcionando en: http://localhost:${PORT}`);
})