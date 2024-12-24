import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
        this.player = null;
        this.platforms = null;
        this.winPoint = null;
        this.isGameOver = false;
    }

    preload() {
        // Nie potrzebujemy już ładować assetów
    }

    create() {
        // Ustawienie koloru tła
        this.cameras.main.setBackgroundColor('#99CCFF');
        
        // Tworzenie platform jako brązowych prostokątów
        this.platforms = this.physics.add.staticGroup();
        
        // Tworzenie głównej platformy
        const mainPlatform = this.add.rectangle(400, 568, 800, 32, 0x8B4513);
        this.platforms.add(mainPlatform);
        
        // Platformy w powietrzu
        const platform1 = this.add.rectangle(600, 450, 200, 32, 0x8B4513);
        const platform2 = this.add.rectangle(50, 350, 200, 32, 0x8B4513);
        const platform3 = this.add.rectangle(750, 320, 200, 32, 0x8B4513);
        
        this.platforms.add(platform1);
        this.platforms.add(platform2);
        this.platforms.add(platform3);
        
        // Tworzenie gracza jako niebieskiego trójkąta
        const playerTriangle = this.add.triangle(100, 450, 0, 32, 16, 0, 32, 32, 0x0000ff);
        this.player = this.physics.add.existing(playerTriangle);
        this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);
        
        // Punkt wygranej jako żółty kwadrat
        const starShape = this.add.rectangle(750, 250, 32, 32, 0xffff00);
        this.winPoint = this.physics.add.existing(starShape, true);
        
        // Kolizje
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.winPoint, this.platforms);
        
        // Sprawdzanie kolizji z punktem wygranej
        this.physics.add.overlap(this.player, this.winPoint, this.winGame, null, this);
        
        // Sterowanie
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.isGameOver) return;

        // Sprawdzanie czy gracz spadł
        if (this.player.y > 580) {
            this.gameOver();
            return;
        }

        // Poruszanie się
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
            this.player.rotation = -0.2; // Lekkie przechylenie podczas ruchu
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
            this.player.rotation = 0.2; // Lekkie przechylenie podczas ruchu
        } else {
            this.player.body.setVelocityX(0);
            this.player.rotation = 0; // Powrót do normalnej pozycji
        }

        // Skakanie
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-330);
        }
    }

    winGame() {
        this.isGameOver = true;
        this.add.text(300, 250, 'Wygrałeś!', { fontSize: '64px', fill: '#fff' });
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });
    }

    gameOver() {
        this.isGameOver = true;
        this.add.text(300, 250, 'Przegrałeś!', { fontSize: '64px', fill: '#fff' });
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });
    }
} 