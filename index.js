const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

// create a write stream in append mode, log.txt file in root
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

let topTenMovies = [
    {
        title: 'Movie1',
        director: 'Movie1 director'
    },
    {
        title: 'Movie2',
        director: 'Movie2 director'
    }
];

// Send response from root
app.get('/', (req, res) => {
    res.send('Test default response');
});

// Send response from /movies
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

// Send static files in "public" folder
app.use(express.static('public'));

// Error handling
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went wrong!');
});

// Listen for Port 8080
app.listen(8080, () => {
    console.log('Listening  port 8080');
});