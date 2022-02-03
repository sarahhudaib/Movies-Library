'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');


const axios = require('axios');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
// console.log(process.env.DATABASE_URL);
const PORT = process.env.PORT;
// const server = express();
const app = express();

app.use(cors());
app.use(express.json());

const movieData = require('./data.json');

//app.get('/',movieHandler);

app.get('/favorite',helloWorldHandler);
app.get('/trending',trendingHandler);
app.get('/search',searchHandler);
app.get('/find', findHandler);
app.get('/discover',discoverHandler);


app.post('/addMovie',addMovieHandler);
app.get('/getMovies',getMoviesHandler);

// params is like passing parameter to link 
app.put('/updatemovies/:id',updatemoviesHandler); // params, should add th id
app.delete('/deletemovie/:id',deletemovieHandler); // should add th id
app.get('/onefavmovies/:id',onefavmoviesHandler);


app.use('*',notFoundHandler);
app.use(errorHandler);

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
     // console.log(movies)
      let sql = `INSERT INTO favMovies(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
      let values=[movies.title,movies.release_date,movies.poster_path,movies.overview];
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

function onefavmoviesHandler (req,res){
    let sql = `SELECT * FROM favMovies WHERE id=${req.params.id};`;
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });

}

function updatemoviesHandler (req,res){
// reading the id params from the link
    const id =req.params.id;
    const movies = req.body;
    //update sql statments if i forgot take them from w3school
    const sql ='UPDATE favMovies SET title =$1,release_date=$2,poster_path=$3,overview=$4 WHERE id=$5 RETURNING *;'
    let values=[movies.title,movies.release_date,movies.poster_path,movies.overview,id];
    client.query(sql,values).then(data=>{
       res.status(200).json(data.rows); // if i dont want to send data should write 204
// 204 if i dont want to send data should write 204
// 200 means we added successfully 
//201 insert new thing 

// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;

    }).catch(error=>{
        errorHandler(error,req,res)
    });
}

function deletemovieHandler(req,res){
const id =req.params.id;
// DELETE FROM table_name WHERE condition;
const sql = `DELETE FROM favMovies WHERE id=${id};`;
client.query(sql).then(()=> {
res.status(200).send("The movie has been deleted"); 

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

//  const client = new pg.Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: { rejectUnauthorized: false }
// })

 client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`listining to port ${PORT}`)
    })
})

