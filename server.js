var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
 
// Variable to manage all players
var players = {};

// Variable to manage game
 
app.use("/build", express.static(__dirname + '/build'));
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/socket", express.static(__dirname + '/node_modules/socket.io-client/dist'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket) {
    /***************************
    **** PLAYERS CONNECTION ****
    ****************************/

    console.log('a user connected');

    // create a new player and add it to our players object
    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id
    };

    // send the players object to the new player
    socket.emit('currentPlayers', players);

    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
    
    // when a player disconnects, remove them from our players object
    socket.on('disconnect', function () {
        console.log('user disconnected');

        // remove this player from our players object
        delete players[socket.id];

        // emit a message to all players to remove this player
        io.emit('playerDisconnected', socket.id);
    });

    socket.on('moving', function(player){
        //update player on server(later)
        var playerId = {
            ...player,
            playerID: socket.id
        }
        io.emit('moved', playerId);
    })
});


server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});