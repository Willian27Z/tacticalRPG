
var status;

export default class ActionMenu extends Phaser.Scene {
        constructor(){
                super('Action Menu');
        }

        preload() {
                this.load.image('attackButton', 'assets/images/Attack button.png');
                this.load.image('DefendButton', 'assets/images/Defend button.png');
                this.load.image('SpellButton', 'assets/images/Spell button.png');
                this.load.image('MoveButton', 'assets/images/Move button.png');
                this.load.image('Fire element', 'assets/images/Fire element.png');
                this.load.image('Earth element', 'assets/images/Earth element.png');
                this.load.image('Status', 'assets/images/Status window.png');
        }

        create () {
                status = this.add.image(920, 550, 'Status');
        }
        update () {
                
        }
}