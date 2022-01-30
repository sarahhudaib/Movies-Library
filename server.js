const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const movieData = require('./data.json');

app.get('/',movieHandler);
app.get('/favorite',helloWorldHandler)
app.get('*',errorHndler)


//constructor
function Movie (title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
   
}


function helloWorldHandler(req,res){
    return res.status(200).send("Welcome to your Favorite Page ");

}


function movieHandler (req,res){
    let movies=[];
    movieData.data.map(movies =>{
        let oneMovie = new Movie(movies.title, movies.poster_path,movies.overview)
        movies.push(oneMovie)
    })
    console.log(movies)
    return res.status(200).json(movies)
}


function errorHndler(req,res){
    if (res.status==404){
    return res.send('page not found error')}
    else if (res.status==500){
        return res.send('Internal Server Error [500] not found error')
    }
}


app.listen(3000, ()=>{

    console.log('listening to port 3000')
})

