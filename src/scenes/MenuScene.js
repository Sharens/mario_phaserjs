import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Tytuł gry
        const title = this.add.text(400, 120, '🐧 Pingwin Adventure 🌌', {
            fontSize: '48px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        title.setOrigin(0.5);

        // Instrukcja
        const instructions = this.add.text(400, 250, 
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

        // Przycisk Play - teraz poniżej instrukcji
        const playButton = this.add.text(400, 450, 'Play 🎮', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        playButton.setOrigin(0.5);
        playButton.setInteractive({ useHandCursor: true });

        // Efekty hover
        playButton.on('pointerover', () => {
            playButton.setScale(1.1);
            playButton.setStyle({ fill: '#0000ff' });
        });

        playButton.on('pointerout', () => {
            playButton.setScale(1);
            playButton.setStyle({ fill: '#000' });
        });

        // Rozpoczęcie gry po kliknięciu
        playButton.on('pointerdown', () => {
            this.startGame();
        });
    }

    startGame() {
        // Efekt przejścia
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene');
        });
    }
} 