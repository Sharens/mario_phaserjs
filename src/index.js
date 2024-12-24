import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import GameScene from './scenes/GameScene';
import LevelSelectScene from './scenes/LevelSelectScene';
import InstructionScene from './scenes/InstructionScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#99CCFF',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, LevelSelectScene, InstructionScene]
};

window.onload = () => {
    new Phaser.Game(config);
}; 