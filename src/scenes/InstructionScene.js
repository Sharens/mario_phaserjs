import Phaser from 'phaser';

export default class InstructionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionScene' });
    }

    create() {
        // Tytuł
        const title = this.add.text(400, 100, 'Instrukcja', {
            fontSize: '48px',
            fill: '#000'
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
            'Skacz na głowy przeciwników!\n\n' +
            '❤️ Życia:\n' +
            'Masz 3 życia na poziom\n' +
            'Unikaj kontaktu z przeciwnikami\n' +
            'Możesz eliminować przeciwników\n' +
            'skacząc im na głowy', {
            fontSize: '24px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            align: 'center'
        });
        instructions.setOrigin(0.5);

        // Przycisk powrotu
        const backButton = this.add.text(400, 500, 'Powrót', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        backButton.setOrigin(0.5);
        backButton.setInteractive({ useHandCursor: true });

        backButton.on('pointerover', () => {
            backButton.setScale(1.1);
            backButton.setStyle({ fill: '#0000ff' });
        });

        backButton.on('pointerout', () => {
            backButton.setScale(1);
            backButton.setStyle({ fill: '#000' });
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
} 