import Phaser from 'phaser';
import { levels } from '../config/levels';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Tytuł gry
        const title = this.add.text(400, 80, '🐧 Pingwin Adventure 🌌', {
            fontSize: '48px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        title.setOrigin(0.5);

        // Instrukcja
        const instructions = this.add.text(400, 180, 
            '🎮 Sterowanie:\n' +
            '← → Ruch\n' +
            '↑ Skok\n\n' +
            '🎯 Cel:\n' +
            'Dotrzyj do 🌌 unikając 🦟\n' +
            'Zbieraj monety dla punktów!\n' +
            'Skacz na głowy przeciwników!', {
            fontSize: '24px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            align: 'center'
        });
        instructions.setOrigin(0.5);

        // Tekst "Wybierz poziom"
        const levelSelectText = this.add.text(400, 320, 'Wybierz poziom:', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        levelSelectText.setOrigin(0.5);

        // Przyciski poziomów
        const buttonWidth = 80;
        const spacing = 20;
        const totalWidth = (levels.length * buttonWidth) + ((levels.length - 1) * spacing);
        const startX = 400 - (totalWidth / 2) + (buttonWidth / 2);

        levels.forEach((level, index) => {
            const x = startX + (index * (buttonWidth + spacing));
            const levelButton = this.add.text(x, 380, `${index + 1}`, {
                fontSize: '32px',
                fill: '#000',
                backgroundColor: '#fff',
                padding: { x: 15, y: 10 }
            });
            
            levelButton.setOrigin(0.5);
            levelButton.setInteractive({ useHandCursor: true });

            // Efekty hover
            levelButton.on('pointerover', () => {
                levelButton.setScale(1.1);
                levelButton.setStyle({ fill: '#0000ff' });
            });

            levelButton.on('pointerout', () => {
                levelButton.setScale(1);
                levelButton.setStyle({ fill: '#000' });
            });

            // Rozpoczęcie wybranego poziomu
            levelButton.on('pointerdown', () => {
                this.startGame(index);
            });
        });

        // Przycisk "Play od poziomu 1"
        const playButton = this.add.text(400, 480, 'Play od początku 🎮', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        playButton.setOrigin(0.5);
        playButton.setInteractive({ useHandCursor: true });

        // Efekty hover dla głównego przycisku Play
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
            playButton.setStyle({ fill: '#0000ff' });
        });

        playButton.on('pointerout', () => {
            playButton.setScale(1);
            playButton.setStyle({ fill: '#000' });
        });

        // Rozpoczęcie gry od pierwszego poziomu
        playButton.on('pointerdown', () => {
            this.startGame(0);
        });
    }

    startGame(levelIndex) {
        // Efekt przejścia
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene', { level: levelIndex });
        });
    }
} 