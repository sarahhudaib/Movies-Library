'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT;
const server = express();
const app = express();

app.use(cors());

const movieData = require('./data.json');

//app.get('/',movieHandler);

app.get('/favorite',helloWorldHandler)
app.get('/trending',trendingHandler)
app.get('/search',searchHandler)
// app.get('/find', findHandler)
// app.get('/discover',discoverHandler)
server.use('*',notFoundHandler)
server.use(errorHandler)

//constructor
function Movie (id,title,release_date,poster_path,overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
   
}
let numberOfMovies=5;
//let userSearch = "The";
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;

function helloWorldHandler(req,res){
    return res.status(200).send("Welcome to your Favorite Page ");

}


// function movieHandler (req,res){
//     let movies=[];
//     movieData.data.map(movies =>{
//         let oneMovie = new Movie(movies.title, movies.poster_path,movies.overview)
//         movies.push(oneMovie)
//     })
//     console.log(movies)
//     return res.status(200).json(movies)
// }

function trendingHandler(req,res){
    let newArr = [];
    axios.get(url).then((result)=>{
        
        result.data.results.forEach(movie =>{
        userSearch(new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview));
        });
      
        res.status(200).json(newArr);

    }).catch((err)=>{
       errorHandler(err,req,res);
    })

}

function searchHandler(req,res){
   let userSearch= req.userSearch;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}`;
    axios.get(url).then(result=>{
        let searching = result.data.results.map(movie =>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(searching);  
     }).catch(err=>{
        errorHandler(err,req,res);
    })
}

// function findHandler (){
//     let url = `https://api.themoviedb.org/3/find/%7Bexternal_id%7D/random?api=${process.env.APIKEY}&number=${numberOfMovies}&query=${userSearch}`;

//     axios.get(url)
//     .then(result=>{
//         let searching = result.data.searching.map(movie =>{
//             return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
//         });
//         res.status(200).json(searching);  
//      }).catch(err=>{
//         errorHandler(err,req,res);
//     })

// }

// function discoverHandler(){
//     let url = `https://api.themoviedb.org/3/discover/movie/random?api=${process.env.APIKEY}&number=${numberOfMovies}&query=${userSearch}`;

//     axios.get(url)
//     .then(result=>{
//         let searching = result.data.searching.map(movie =>{
//             return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
//         });
//         res.status(200).json(searching);  
//      }).catch(err=>{
//         errorHandler(err,req,res);
//     })

// }


function notFoundHandler(req,res){
    res.status(404).send("This page is not found")
 }

function errorHandler(error,req,res){
   const err= {
    status: 500,
    message: error
}
res.status(500).send(err);
 }

 server.listen(PORT,()=>{
    console.log(`listining to port ${PORT}`)
})

