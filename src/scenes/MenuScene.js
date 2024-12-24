import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Tytuł gry
        const title = this.add.text(400, 100, '🐧 Pingwin Adventure 🌌', {
            fontSize: '48px',
            fill: '#000'
        });
        title.setOrigin(0.5);

        // Przyciski menu
        const menuItems = [
            { text: 'Graj 🎮', scene: 'GameScene', params: { level: 0 } },
            { text: 'Wczytaj poziom 📂', scene: 'LevelSelectScene' },
            { text: 'Kreator poziomów 🔨', scene: 'LevelEditorScene' },
            { text: 'Instrukcja ℹ️', scene: 'InstructionScene' }
        ];

        menuItems.forEach((item, index) => {
            const button = this.add.text(400, 220 + (index * 80), item.text, {
                fontSize: '32px',
                fill: '#000',
                backgroundColor: '#fff',
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
                this.cameras.main.fade(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start(item.scene, item.params);
                });
            });
        });
    }
} 