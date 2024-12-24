import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#99CCFF',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: GameScene
};

window.onload = () => {
    new Phaser.Game(config);
}; 