// import BoardPlugin from '../../plugins/board-plugin.js';
import MainScene from '../scene/GameScene';
// import Menu from '../scene/ActionMenu';

export default {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1027,
    height: 720,
    physics: {
			default: 'arcade'
		},
		scene: [MainScene] 
/* 	plugins: {
		scene: [{
			key: 'rexBoard',
			plugin: BoardPlugin,
			mapping: 'rexBoard'
		}]
	} */
};