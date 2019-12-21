
var status;
var moveButton;
var attackButton;

export default class ActionMenu extends Phaser.Scene {
        constructor(){
                super({key: 'menu', active: true});
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

                moveButton = this.add.image(750, 550, 'MoveButton');
                moveButton.setInteractive();
                moveButton.on('pointerdown', function(event){
                        console.log("move!");
                        this.scene.scene.get("main").changeMode("move");
                });
                moveButton.setDepth(1);

                attackButton = this.add.image(750, 630, 'attackButton');
                attackButton.setInteractive();
                attackButton.on('pointerdown', function(event){
                        console.log("attack!");
                        this.scene.scene.get("main").changeMode("attack");
                });
                attackButton.setDepth(1);
        }
        update () {
                
        }
}