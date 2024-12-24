import Phaser from 'phaser';
import { levels } from '../config/levels';

export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        // Tytuł
        const title = this.add.text(400, 100, 'Wybierz Poziom', {
            fontSize: '48px',
            fill: '#000'
        });
        title.setOrigin(0.5);

        // Informacja o wgrywaniu poziomów
        const info = this.add.text(400, 160, 
            'Aby dodać własne poziomy, umieść pliki konfiguracyjne w:\n' +
            'src/config/levels.js', {
            fontSize: '20px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 15, y: 10 },
            align: 'center'
        });
        info.setOrigin(0.5);

        // Przyciski poziomów
        const buttonWidth = 80;
        const spacing = 20;
        const totalWidth = (levels.length * buttonWidth) + ((levels.length - 1) * spacing);
        const startX = 400 - (totalWidth / 2) + (buttonWidth / 2);

        levels.forEach((level, index) => {
            const x = startX + (index * (buttonWidth + spacing));
            const levelButton = this.add.text(x, 250, `${index + 1}`, {
                fontSize: '32px',
                fill: '#000',
                backgroundColor: '#fff',
                padding: { x: 15, y: 10 }
            });
            
            levelButton.setOrigin(0.5);
            levelButton.setInteractive({ useHandCursor: true });

            levelButton.on('pointerover', () => {
                levelButton.setScale(1.1);
                levelButton.setStyle({ fill: '#0000ff' });
            });

            levelButton.on('pointerout', () => {
                levelButton.setScale(1);
                levelButton.setStyle({ fill: '#000' });
            });

            levelButton.on('pointerdown', () => {
                this.startLevel(index);
            });
        });

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

    startLevel(levelIndex) {
        this.cameras.main.fade(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene', { level: levelIndex });
        });
    }
} 