import Phaser from 'phaser';
import { levelLoader } from '../utils/levelLoader';

export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        // Tytuł
        const title = this.add.text(400, 50, 'Wybierz Poziom', {
            fontSize: '48px',
            fill: '#000'
        });
        title.setOrigin(0.5);

        // Przyciski domyślnych poziomów
        this.createDefaultLevelButtons();

        // Przycisk wczytania własnego poziomu
        const loadCustomButton = this.add.text(400, 500, 'Wczytaj własny poziom', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        });
        loadCustomButton.setOrigin(0.5);
        loadCustomButton.setInteractive({ useHandCursor: true });

        // Efekty hover dla przycisku
        loadCustomButton.on('pointerover', () => {
            loadCustomButton.setScale(1.1);
            loadCustomButton.setStyle({ fill: '#0000ff' });
        });

        loadCustomButton.on('pointerout', () => {
            loadCustomButton.setScale(1);
            loadCustomButton.setStyle({ fill: '#000' });
        });

        // Obsługa wczytywania pliku
        loadCustomButton.on('pointerdown', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (event) => {
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const levelData = JSON.parse(e.target.result);
                        this.scene.start('GameScene', { customLevel: levelData });
                    } catch (error) {
                        console.error('Błąd wczytywania poziomu:', error);
                        alert('Nieprawidłowy format pliku poziomu!');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        // Przycisk powrotu
        const backButton = this.add.text(400, 550, 'Powrót', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#ffffff',
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

    createDefaultLevelButtons() {
        const levels = [
            { id: 1, name: 'Poziom 1' },
            { id: 2, name: 'Poziom 2' }
        ];

        levels.forEach((level, index) => {
            const button = this.add.text(400, 150 + (index * 70), level.name, {
                fontSize: '32px',
                fill: '#000',
                backgroundColor: '#ffffff',
                padding: { x: 20, y: 10 }
            });
            
            button.setOrigin(0.5);
            button.setInteractive({ useHandCursor: true });

            button.on('pointerover', () => {
                button.setScale(1.1);
                button.setStyle({ fill: '#0000ff' });
            });

            button.on('pointerout', () => {
                button.setScale(1);
                button.setStyle({ fill: '#000' });
            });

            button.on('pointerdown', () => {
                levelLoader.getLevel(level.id).then(levelData => {
                    if (levelData) {
                        this.scene.start('GameScene', { customLevel: levelData });
                    }
                });
            });
        });
    }
} 