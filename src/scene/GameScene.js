
import GUI from "./ActionMenu";
import pathSorter from '../auxiliaries/pathSorter';

var map;	//globalvariables
var player;
//var cursors;
var target = new Phaser.Math.Vector2();
var TILE_SIZE = 32;
var collisionTiles = [28,75,61,131];
var selectable;
var path;
var mode = "move"; // attack, move, turn, cast

var tileHovered;
var graphics;

// eslint-disable-next-line no-undef
export default class MainScene extends Phaser.Scene {
	constructor(){
		super({key: 'main'});
	}
	

	preload() {
		//this.load.image('logo', 'assets/logo.png');
		this.load.image('tiles', 'assets/images/gridtiles.png');
		this.load.tilemapCSV('map', 'assets/maps/1stmap.csv');
		this.load.image('dude', 'assets/images/dude.png')
	}

	create () {
		//this.input.enabled = true;

		//adding the "skeleton" of the map to the "map" variable
		map = this.make.tilemap({
			key: 'map', /*assigning the CSV file to the skeleton*/
			tileWidth: TILE_SIZE,
			tileHeight: TILE_SIZE
		});
		
		var tileset = map.addTilesetImage('tiles'); //assigning the image as the "flesh" to the skeleton
		var layer = map.createStaticLayer(0, tileset, 0, 0); //creating the layer
		// layer.setInteractive();

		//setting up collision
		map.setCollision(collisionTiles);

		// Tile hovered
		tileHovered = this.add.graphics();
		// line for path and others
		graphics = this.add.graphics();
		
		//creating and positioning player on map
		player = this.physics.add.image(1584, 1584, 'dude');
		
		//set up the player to collide with the tilemap layer
		this.physics.add.collider(player, layer);
		
		//setting up cameras
		this.cameras.main.setBounds(0,0, map.widthInPixels, map.heightInPixels);
		this.cameras.main.startFollow(player);

		//assigning directional buttons to the variable
		//cursors = this.input.keyboard.createCursorKeys();

		//moving with click
		this.input.on('pointerdown', function(pointer){
			if (!selectable) {
				return;
			}
			var x = map.worldToTileX(pointer.worldX, true);
			var y = map.worldToTileY(pointer.worldY, true);
			// target = map.tileToWorldXY(x, y);
			// target.x += (TILE_SIZE/2);
			// target.y += (TILE_SIZE/2);

			// get all tiles from player to pointer
			var worldCoord = map.tileToWorldXY(x, y);
			worldCoord.x += (TILE_SIZE/2)
			worldCoord.y += (TILE_SIZE/2)
			var pathLine = new Phaser.Geom.Line(player.x, player.y+1, worldCoord.x, worldCoord.y)
			var rawPath = map.getTilesWithinShape(pathLine);
			path = pathSorter(rawPath, player, worldCoord);
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
		this.input.on("pointermove", function(pointer){
			if(mode === "move"){

				// clear last tiles hovered
				tileHovered.clear();
				graphics.clear();
				
				// Calculates tile world coordinate from pointer
				var x = map.worldToTileX(pointer.worldX, true);
				var y = map.worldToTileY(pointer.worldY, true);
				var worldCoord = map.tileToWorldXY(x, y);
				
				// get all tiles from player to pointer
				var pathLine = new Phaser.Geom.Line(player.x, player.y+1, worldCoord.x + (TILE_SIZE/2), worldCoord.y + (TILE_SIZE/2))
				var tiles = map.getTilesWithinShape(pathLine);
	
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
				tiles.forEach(function(pathTile) {
					var pathCoord = map.tileToWorldXY(pathTile.x, pathTile.y);
					tileHovered.fillRect(pathCoord.x, pathCoord.y, TILE_SIZE, TILE_SIZE);
				});
				graphics.beginPath();
				graphics.moveTo(player.x, player.y);
				graphics.lineTo( worldCoord.x+16, worldCoord.y+16);
				graphics.closePath();
				graphics.stroke()
			}
		});
		
	}
	update () {
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
			target = map.tileToWorldXY(path[0].x, path[0].y);
			target.x += (TILE_SIZE/2);
			target.y += (TILE_SIZE/2);
			this.physics.moveToObject(player, target, 300);
		}

		var distance = Phaser.Math.Distance.Between(player.x, player.y, target.x, target.y);

		if (player.body.speed > 0)
		{
			//  4 is our distance tolerance, i.e. how close the source can get to the target
			//  before it is considered as being there. The faster it moves, the more tolerance is required.
			if (distance < 4)
			{
				// console.log("target reached")
				player.body.reset(target.x, target.y);
				//destiny splice
				path.splice(0,1);
				target.x = 0;
				target.y = 0;
			}
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