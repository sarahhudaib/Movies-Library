'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT;
const server = express();
const app = express();

app.use(cors());

const movieData = require('./data.json');

//app.get('/',movieHandler);

app.get('/favorite',helloWorldHandler);
app.get('/trending',trendingHandler);
app.get('/search',searchHandler);
app.get('/find', findHandler);
app.get('/discover',discoverHandler);

server.post('/addMovie',addMovieHandler);
app.get('/getMovies',getMoviesHandler);

server.use(express.json());
server.use('*',notFoundHandler);
server.use(errorHandler);

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
let url = `https://api.themoviedb.org/3/trending/all/week/random?apiKey=${process.env.APIKEY}&number=${numberOfMovies}`;

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
    axios.get(url)
     .then((result)=>{
        // console.log(result.data.recipes);
        let trending = result.data.trending.map(movie =>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
      
        res.status(200).json(newArr);

    }).catch((err)=>{
       errorHandler(err,req,res);
    })

}

function searchHandler(req,res){
    let url = `https://api.themoviedb.org/3/search/movie/random?api=${process.env.APIKEY}&number=${numberOfMovies}&query=${userSearch}`;

    axios.get(url)
    .then(result=>{
        let searching = result.data.searching.map(movie =>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(searching);  
     }).catch(err=>{
        errorHandler(err,req,res);
    })
}

function findHandler (){
    let url = `https://api.themoviedb.org/3/find/%7Bexternal_id%7D/random?api=${process.env.APIKEY}&number=${numberOfMovies}&query=${userSearch}`;

    axios.get(url)
    .then(result=>{
        let searching = result.data.searching.map(movie =>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(searching);  
     }).catch(err=>{
        errorHandler(err,req,res);
    })

}

function discoverHandler(){
    let url = `https://api.themoviedb.org/3/discover/movie/random?api=${process.env.APIKEY}&number=${numberOfMovies}&query=${userSearch}`;

    axios.get(url)
    .then(result=>{
        let searching = result.data.searching.map(movie =>{
            return new Movie(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview);
        });
        res.status(200).json(searching);  
     }).catch(err=>{
        errorHandler(err,req,res);
    })

}

function addMovieHandler(req,res){
    const movies = req.body;
    //   console.log(movies)
      let sql = `INSERT INTO favMovies(id,title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
      let values=[movies.id,movies.title,movies.release_date,movies.poster_path,movies.overview];
      client.query(sql,values).then(data =>{
          res.status(200).json(data.rows);
      }).catch(error=>{
          errorHandler(error,req,res)
      });

}

function getMoviesHandler(req,res){
    let sql = `SELECT * FROM favMovies;`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}


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

 client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listining to port ${PORT}`)
    })
})

