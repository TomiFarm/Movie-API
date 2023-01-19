const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/cfDB', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to Mongo!');
    })
    .catch((err) => {
        console.log('Error connecting to Mongo');
        console.log(err);
    });

// create a write stream in append mode, log.txt file in root
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// let movies = [
//     {
//         "Title":"Jurassic Park",
//         "Description":"A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
//         "Genre": {
//             "Name":"Adventure",
//             "Description":"Setting plays an important role in an adventure film, sometimes itself acting as a character in the narrative. They are typically set in far away lands, such as lost continents or other exotic locations. They may also be set in a period background and may include adapted stories of historical or fictional adventure heroes within the historical context. Such struggles and situations that confront the main characters include things like battles, piracy, rebellion, and the creation of empires and kingdoms. A common theme of adventure films is of characters leaving their home or place of comfort and going to fulfill a goal, embarking on travels, quests, treasure hunts, heroic journeys; and explorations or searches for the unknown. Subgenres of adventure films include swashbuckler films, pirate films, and survival films. Adventure films may also be combined with other film genres such as action, animation, comedy, drama, fantasy, science fiction, family, horror, or war."
//         },
//         "Director": {
//             "Name":"Steven Spielberg",
//             "Bio":"One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood's best known director and one of the wealthiest filmmakers in the world. He has an extraordinary number of commercially successful and critically acclaimed credits to his name, either as a director, producer or writer since launching the summer blockbuster with Jaws (1975), and he has done more to define popular film-making since the mid-1970s than anyone else.",
//             "Birth":1946.0
//         }
//     },
//     {
//         "Title":"Titanic",
//         "Description":"A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
//         "Genre": {
//             "Name":"Drama",
//             "Description":"In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone. Drama of this kind is usually qualified with additional terms that specify its particular super-genre, macro-genre, or micro-genre, such as soap opera, police crime drama, political drama, legal drama, historical drama, domestic drama, teen drama, and comedy-drama (dramedy). These terms tend to indicate a particular setting or subject-matter, or else they qualify the otherwise serious tone of a drama with elements that encourage a broader range of moods. To these ends, a primary element in a drama is the occurrence of conflict—emotional, social, or otherwise—and its resolution in the course of the storyline."
//         },
//         "Director": {
//             "Name":"James Cameron",
//             "Bio":"James Francis Cameron was born on August 16, 1954 in Kapuskasing, Ontario, Canada. He moved to the United States in 1971. The son of an engineer, he majored in physics at California State University before switching to English, and eventually dropping out. He then drove a truck to support his screenwriting ambition. He landed his first professional film job as art director, miniature-set builder, and process-projection supervisor on Roger Corman's Battle Beyond the Stars (1980) and had his first experience as a director with a two week stint on The Spawning (1981) before being fired. He then wrote and directed Terminator (1984), a futuristic action-thriller starring Arnold Schwarzenegger, Michael Biehn and Linda Hamilton. It was a low budget independent film, but Cameron's superb, dynamic direction made it a surprise mainstream success and it is now regarded as one of the most iconic pictures of the 1980s. After this came a string of successful, bigger budget science-fiction action films such as Aliens (1986), Abyss (1989) and Terminator 2 (1991). In 1990, Cameron formed his own production company, Lightstorm Entertainment. In 1997, he wrote and directed Titanic (1997), a romance epic about two young lovers from different social classes who meet on board the famous ship. The movie went on to break all box office records and earned eleven Academy Awards. It became the highest grossing movie of all time until 12 years later, Avatar (2009), which invented and pioneered 3D film technology, and it went on to beat Titanic, and became the first film to cost two billion dollars until 2019 when Marvel took the record. James Cameron is now one of the most sought-after directors in Hollywood. He was formerly married to producer Gale Anne Hurd, who produced several of his films. In 2000, he married actress Suzy Amis, who appeared in Titanic, and they have three children.",
//             "Birth":1954.0
//         }
//     }
// ];

// let users = [
//     {
//         "id": "1",
//         "name": "Jane",
//         "favoriteMovies": []
//     },
//     {
//         "id": "2",
//         "name": "John",
//         "favoriteMovies": ["Jurassic Park"]
//     }
// ];

// Send response from root
app.get('/', (req, res) => {
    res.send('Test default response');
});

// Send response from /public/documentation to return documentation.html file
app.get('/public/documentation.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/documentation.html'));
})

// Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// CREATE
// Add a new user to users object in /users endpoint and return added user as json object
app.post('/users', (req, res) => {
    Users.findOne({Username: req.body.Username})
        .then((user) => {
            if(user){
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//     const newUser = req.body;

//     if (newUser.name) {
//         newUser.id = uuid.v4();
//         users.push(newUser);
//         res.status(201).json(newUser);
//     } else {
//         res.status(400).send('Users need names');
//     }
// });

// UPDATE
// Update existing user's name in /users/[username] endpoint and return updated user json object
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {$set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//     const {id} = req.params;
//     const updatedUser = req.body;

//     let user = users.find(user => user.id == id);

//     if (user) {
//         user.name = updatedUser.name;
//         res.status(200).json(user);
//     } else {
//         res.status(400).send("No such user");
//     }
// });

// CREATE
// add a movie to favorite movies in users object in /users/[username]/movies/[movieID] endpoint and return a success message
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $push: {Favorites: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) => {
        if(err){
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});
//     const {id, movieTitle} = req.params;

//     let user = users.find(user => user.id == id);

//     if (user) {
//         user.favoriteMovies.push(movieTitle);
//         res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
//     } else {
//         res.status(400).send("No such user");
//     }
// });

// DELETE
// Remove a movie from favorite movies in users object in /users/[username]/movies/[movieTitle] endpoint and return a success message
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $pull: {Favorites: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//     const {id, movieTitle} = req.params;

//     let user = users.find(user => user.id == id);

//     if (user) {
//         user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
//         res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
//     } else {
//         res.status(400).send("No such user");
//     }
// });

// Remove an existing user from users object in /users/[id] endpoint and return a success message
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({Username: req.params.Username})
        .then((user) => {
            if(!user){
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
//     const {id} = req.params;

//     let user = users.find(user => user.id == id);

//     if (user) {
//         users = users.filter(user => user.id != id);
//         res.status(200).send(`User id: ${id} has been deleted`);
//     } else {
//         res.status(400).send("No such user");
//     }
// });

// READ
// Send response from /movies to return json object of movie data of all movies
app.get('/movies', (req, res) => {
    Movies.find().then(movies => res.status(200).json(movies));
});

// Send response from /movies/[movieTitle]] to return json object of data of a single movie
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({Title: req.params.Title})
        .then(movie => {
            res.status(200).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
//     const {title} = req.params;
//     const movie = movies.find(movie => movie.Title === title);

//     if (movie) {
//         res.status(200).json(movie);
//     } else {
//         res.status(400).send('no movie found');
//     }

// });

// Send response from /movies/genre/[genreName] to return json object of data of a single genre
app.get('/movies/genre/:genreName', (req, res) => {
    Movies.findOne({"Genre.Name": req.params.genreName})
        .then(movie => {
            res.status(200).json(movie.Genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//     const {genreName} = req.params;
//     const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

//     if (genre) {
//         res.status(200).json(genre);
//     } else {
//         res.status(400).send('no genre found');
//     }

// });

// Send response from /movies/directors/[directorName] to return json object of data of a single director
app.get('/movies/directors/:directorName', (req, res) => {
    Movies.findOne({"Director.Name": req.params.directorName})
        .then(movie => {
            res.status(200).json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//     const {directorName} = req.params;
//     const director = movies.find(movie => movie.Director.Name === directorName).Director;

//     if (director) {
//         res.status(200).json(director);
//     } else {
//         res.status(400).send('no director found');
//     }

// });

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