
var SocketController = {
    init: function (scene) {

        console.log("connecting...");
        scene.socket = io("http://localhost:8081");
        scene.socket.on("connect", function(){

            console.log("connected to socket.io!");

            // Adding players already connected
            scene.socket.on('currentPlayers', function (players) {
                console.log("players received: ", players);
                Object.keys(players).forEach(function (id) {
                    if (players[id].playerId === scene.socket.id) {
                        // addPlayer(self, players[id]);
                        scene.player = scene.physics.add.image(players[id].x, players[id].y, 'dude');
    
                        //set up the player to collide with the tilemap layer
                        scene.physics.add.collider(scene.player, scene.layer);
                        
                        //setting up cameras
                        scene.cameras.main.setBounds(0,0, scene.map.widthInPixels, scene.map.heightInPixels);
                        scene.cameras.main.startFollow(scene.player);
                    } else {
                        scene.otherPlayers[players[id].playerId] = scene.physics.add.image(players[id].x, players[id].y, 'dude');
                        
                    }
                });
            });

            //adding new player
            scene.socket.on('newPlayer', function(player){
                console.log("new Player!")
                scene.otherPlayers[player.playerId] = scene.physics.add.image(player.x, player.y, 'dude');
            });
            // removing players
            scene.socket.on('playerDisconnected', function(id){
                console.log("player left: ", id);
                console.log(scene.otherPlayers[id]);
                console.log("other players ", scene.otherPlayers);
                scene.otherPlayers[id].destroy();
                delete scene.otherPlayers[id];
            });

            scene.socket.on("moved", function(otherPlayer){
                if(scene.otherPlayers[otherPlayer.playerID]){
                    scene.otherPlayers[otherPlayer.playerID].x = otherPlayer.x;
                    scene.otherPlayers[otherPlayer.playerID].y = otherPlayer.y;
                }
            })
        }) 
    },
    moving: function(scene) {
        scene.socket.emit("moving", scene.player);
    }
};

export default SocketController;