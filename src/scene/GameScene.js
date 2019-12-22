
import GUI from "./ActionMenu";
import pathSorter from '../auxiliaries/pathSorter';
import socketController from '../auxiliaries/socket';

//var map;	//globalvariables
//var player;
//var cursors;
var target = new Phaser.Math.Vector2();
var TILE_SIZE = 32;
var collisionTiles = [28,75,61,131];
var selectable;
var path;	// arrays of tiles
var mode = "move"; // attack, move, turn, cast

var tileHovered;
var graphics;

// eslint-disable-next-line no-undef
export default class MainScene extends Phaser.Scene {
	constructor(){
		super({key: 'main'});
		this.player;
		this.layer;
		this.map;
		this.otherPlayers = {};
		// this.target = new Phaser.Math.Vector2();
	}
	

	preload() {
		//this.load.image('logo', 'assets/logo.png');
		this.load.image('tiles', 'assets/images/gridtiles.png');
		this.load.tilemapCSV('map', 'assets/maps/1stmap.csv');
		this.load.image('dude', 'assets/images/dude.png')
	}

	create () {
		//this.input.enabled = true;

		socketController.init(this);

		//adding the "skeleton" of the map to the "map" variable
		this.map = this.make.tilemap({
			key: 'map', /*assigning the CSV file to the skeleton*/
			tileWidth: TILE_SIZE,
			tileHeight: TILE_SIZE
		});
		
		var tileset = this.map.addTilesetImage('tiles'); //assigning the image as the "flesh" to the skeleton
		this.layer = this.map.createStaticLayer(0, tileset, 0, 0); //creating the layer
		// layer.setInteractive();

		//setting up collision
		this.map.setCollision(collisionTiles);

		// Tile hovered
		tileHovered = this.add.graphics();
		// line for path and others
		graphics = this.add.graphics();
		
		//creating and positioning player on map
		//player = this.physics.add.image(1584, 1584, 'dude');
		
		//set up the player to collide with the tilemap layer
		// this.physics.add.collider(player, layer);
		
		//setting up cameras
		// this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
		// this.cameras.main.startFollow(player);

		//assigning directional buttons to the variable
		//cursors = this.input.keyboard.createCursorKeys();

		//moving with click
		this.input.on('pointerdown', (pointer)=>{
			if (!selectable) {
				return;
			}
			var x = this.map.worldToTileX(pointer.worldX, true);
			var y = this.map.worldToTileY(pointer.worldY, true);
			// target = map.tileToWorldXY(x, y);
			// target.x += (TILE_SIZE/2);
			// target.y += (TILE_SIZE/2);

			// get all tiles from player to pointer
			var worldCoord = this.map.tileToWorldXY(x, y);
			worldCoord.x += (TILE_SIZE/2)
			worldCoord.y += (TILE_SIZE/2)
			var pathLine = new Phaser.Geom.Line(this.player.x, this.player.y+1, worldCoord.x, worldCoord.y)
			var rawPath = this.map.getTilesWithinShape(pathLine);
			path = pathSorter(rawPath, this.player, worldCoord);
			// console.log(path);
			target.x = 0;
			target.y= 0;
			//this.physics.moveToObject(player, target, 300);
		}, this);

		// Adding menu
		// console.log(this);
		this.scene.add('menu', GUI, true, {mode: mode});

		this.input.keyboard.on("keyup-M", function(event){
			// console.log(event);
			if(mode === "move"){
				mode = "attack";
				selectable = false;
				tileHovered.clear();
				graphics.clear();
			} else {
				mode = "move";
			}
			// console.log(mode);
		});

		
		//hovering mouse
		this.input.on("pointermove", (pointer)=>{
			if(mode === "move" && this.player){

				// clear last tiles hovered
				tileHovered.clear();
				graphics.clear();
				
				// Calculates tile world coordinate from pointer
				var x = this.map.worldToTileX(pointer.worldX, true);
				var y = this.map.worldToTileY(pointer.worldY, true);
				var worldCoord = this.map.tileToWorldXY(x, y);
				
				// get all tiles from player to pointer
				var pathLine = new Phaser.Geom.Line(this.player.x, this.player.y+1, worldCoord.x + (TILE_SIZE/2), worldCoord.y + (TILE_SIZE/2))
				var tiles = this.map.getTilesWithinShape(pathLine);
	
				// check if collision tile in path
				for (var i = 0 ; i < tiles.length ; i++) {
					if (collisionTiles.includes(tiles[i].index) || tiles.length > 50) {
						tileHovered.fillStyle(0xff0000, 0.5);
						graphics.lineStyle(3, 0xff0000);
						selectable = false;
						break;
					} else {
						tileHovered.fillStyle(0x00ff00, 0.5);
						graphics.lineStyle(3, 0x00ff00);
						selectable = true;
					}
				}
				tiles.forEach((pathTile) => {
					var pathCoord = this.map.tileToWorldXY(pathTile.x, pathTile.y);
					tileHovered.fillRect(pathCoord.x, pathCoord.y, TILE_SIZE, TILE_SIZE);
				});
				// graphics.beginPath();
				// graphics.moveTo(this.player.x, this.player.y);
				// graphics.lineTo( worldCoord.x+16, worldCoord.y+16);
				// graphics.closePath();
				// graphics.stroke()
			}
		});
		
	}
	update () {
		if(this.player){
			/*player.body.setVelocity(0);
			// Horizontal movement
			if (cursors.left.isDown) {
				player.body.setVelocityX(-100);
			}
			else if (cursors.right.isDown) {
				player.body.setVelocityX(100)
			}
			// Vertical movement
			if (cursors.up.isDown)
			{
				player.body.setVelocityY(-100);
			}
			else if (cursors.down.isDown)
			{
				player.body.setVelocityY(100);
			}
			*/
			if (path && path[0] && !target.x && !target.y) {
				// console.log("next tile: ", path[0].x, path[0].y);
				target = this.map.tileToWorldXY(path[0].x, path[0].y);
				target.x += (TILE_SIZE/2);
				target.y += (TILE_SIZE/2);
				this.physics.moveToObject(this.player, target, 300);
			}
		
			var distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, target.x, target.y);
		
			if (this.player.body.speed > 0)
			{
				//  4 is our distance tolerance, i.e. how close the source can get to the target
				//  before it is considered as being there. The faster it moves, the more tolerance is required.
				if (distance < 4)
				{
					// console.log("target reached")
					this.player.body.reset(target.x, target.y);
					//destiny splice
					path.splice(0,1);
					target.x = 0;
					target.y = 0;
				}
			}

			// emit player movement
			var x = this.player.x;
			var y = this.player.y;
			if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y)) {
				socketController.moving(this);
			}
			
			// save old position data
			this.player.oldPosition = {
				x: this.player.x,
				y: this.player.y
			};
		}
			
	}

	changeMode(string) {
		mode = string;
		tileHovered.clear();
		graphics.clear();
		if(string === "attack"){
			selectable = false;
		} 
		if(string=== "move") {
			selectable = true;
		}
	}
}