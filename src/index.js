import 'phaser';
import config from './config/config';
//import GameScene from './scenes/GameScene';

class Game extends Phaser.Game {
    constructor() {
        super(config);
        //this.scene.add('level1', GameScene);
        //this.scene.start('main');
    }
}

window.onload = function(){
    window.game = new Game();
}