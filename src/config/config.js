// import BoardPlugin from '../../plugins/board-plugin.js';
export default {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1027,
    height: 720,
    physics: {
			default: 'arcade'
		},
		scene: [] 
/* 	plugins: {
		scene: [{
			key: 'rexBoard',
			plugin: BoardPlugin,
			mapping: 'rexBoard'
		}]
	} */
};