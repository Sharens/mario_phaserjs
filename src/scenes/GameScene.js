import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        console.log('Preload started');
    }

    create() {
        console.log('Create started');
        
        // Dodaj platformy
        this.platforms = this.physics.add.staticGroup();
        this.platforms.add(this.add.rectangle(400, 568, 800, 32, 0x8B4513));
        this.platforms.add(this.add.rectangle(600, 450, 200, 32, 0x8B4513));
        this.platforms.add(this.add.rectangle(50, 350, 200, 32, 0x8B4513));
        
        // Dodaj gracza
        const playerShape = this.add.triangle(100, 450, 0, 32, 16, 0, 32, 32, 0x0000ff);
        this.player = this.physics.add.existing(playerShape);
        this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);
        
        // Dodaj punkt końcowy (różowy prostokąt)
        const finishPoint = this.add.rectangle(750, 250, 32, 64, 0xFF69B4);
        this.finishPoint = this.physics.add.existing(finishPoint, true);
        
        // Dodaj monety
        this.coins = this.physics.add.staticGroup();
        this.createCoins();
        
        // Dodaj licznik punktów
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Punkty: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        
        // Dodaj kolizje
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.finishPoint, this.winLevel, null, this);
        
        // Dodaj sterowanie
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createCoins() {
        const positions = [
            { x: 300, y: 400 },
            { x: 450, y: 300 },
            { x: 600, y: 350 }
        ];
        
        positions.forEach(pos => {
            const coin = this.add.circle(pos.x, pos.y, 8, 0xFFD700);
            this.coins.add(coin);
        });
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.score += 10;
        this.scoreText.setText('Punkty: ' + this.score);
    }

    winLevel(player, finishPoint) {
        // Dezaktywuj kontrolę gracza
        this.player.body.setVelocity(0);
        this.player.body.allowGravity = false;
        
        // Wyświetl komunikat o wygranej
        const winText = this.add.text(400, 300, 'Poziom ukończony!\nPunkty: ' + this.score, {
            fontSize: '48px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            align: 'center'
        });
        winText.setOrigin(0.5);
        
        // Efekt migania punktu końcowego
        this.tweens.add({
            targets: finishPoint,
            alpha: 0.5,
            yoyo: true,
            repeat: 4,
            duration: 300
        });
        
        // Restart poziomu po 3 sekundach
        this.time.delayedCall(3000, () => {
            this.scene.restart();
        });
    }

    update() {
        if (!this.player || !this.player.body || !this.player.body.enable) return;

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
        } else {
            this.player.body.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-330);
        }
    }
}