import Phaser from 'phaser';
import { levels } from '../config/levels';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.currentLevel = 0;
    }

    init(data) {
        this.currentLevel = data.level || 0;
    }

    create() {
        console.log('Create started - Level:', this.currentLevel + 1);
        
        // Inicjalizacja żyć
        this.lives = 3;
        
        // Załaduj konfigurację poziomu
        const levelConfig = levels[this.currentLevel];
        
        // Dodaj platformy
        this.platforms = this.physics.add.staticGroup();
        levelConfig.platforms.forEach(platform => {
            this.platforms.add(
                this.add.rectangle(platform.x, platform.y, platform.width, platform.height, 0x8B4513)
            );
        });
        
        // Dodaj gracza
        const playerConfig = levelConfig.player;
        this.player = this.add.text(playerConfig.x, playerConfig.y, '🐧', {
            fontSize: '40px'
        });
        this.player.setOrigin(0.5);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(30, 35);
        this.player.body.setOffset(5, 5);
        this.playerDirection = 1;
        
        // Dodaj przeciwników
        this.enemies = this.physics.add.group();
        levelConfig.enemies.forEach(enemy => {
            this.createEnemy(enemy);
        });
        
        // Dodaj monety
        this.coins = this.physics.add.staticGroup();
        levelConfig.coins.forEach(coin => {
            const coinSprite = this.add.circle(coin.x, coin.y, 8, 0xFFD700);
            this.coins.add(coinSprite);
        });
        
        // Dodaj punkt końcowy
        const finishConfig = levelConfig.finish;
        this.finishPoint = this.add.text(finishConfig.x, finishConfig.y, '🌌', {
            fontSize: '50px'
        });
        this.finishPoint.setOrigin(0.5);
        this.physics.add.existing(this.finishPoint, true);
        this.finishPoint.body.setSize(40, 40);
        this.finishPoint.body.setOffset(5, 5);
        
        // Dodaj UI
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Punkty: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        
        this.livesText = this.add.text(16, 56, `Życia ${this.lives}x ❤️`, {
            fontSize: '32px',
            fill: '#000'
        });
        
        // Dodaj numer poziomu
        this.levelText = this.add.text(16, 96, `Poziom ${this.currentLevel + 1}`, {
            fontSize: '32px',
            fill: '#000'
        });
        
        // Kolizje
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.finishPoint, this.winLevel, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, null, this);
        
        // Sterowanie
        this.cursors = this.input.keyboard.createCursorKeys();
        this.isInvulnerable = false;
        this.detectionRange = 200;
    }

    createEnemy(enemy) {
        const enemySprite = this.add.text(enemy.x, enemy.y, '🦟', {
            fontSize: '32px'
        });
        
        enemySprite.setOrigin(0.5);
        this.physics.add.existing(enemySprite);
        this.enemies.add(enemySprite);
        
        // Ustawienie właściwości fizycznych
        enemySprite.direction = enemy.direction;
        enemySprite.baseSpeed = 100;
        enemySprite.chaseSpeed = 150;
        enemySprite.body.setVelocityX(enemySprite.baseSpeed * enemy.direction);
        enemySprite.body.setBounce(0);
        enemySprite.body.setCollideWorldBounds(true);
        enemySprite.body.setSize(25, 25);
        enemySprite.body.setOffset(4, 4);
        
        // Dodaj właściwość isChasing
        enemySprite.isChasing = false;
    }

    hitEnemy(player, enemy) {
        if (this.isInvulnerable) return;
        
        this.isInvulnerable = true;
        this.lives--;
        this.livesText.setText(`Życia ${this.lives}x ❤️`);
        
        // Efekt mignięcia gracza
        this.tweens.add({
            targets: player,
            alpha: 0.5,
            yoyo: true,
            repeat: 5,
            duration: 200,
            onComplete: () => {
                this.isInvulnerable = false;
                player.alpha = 1;
            }
        });
        
        // Odrzut gracza
        const direction = player.x < enemy.x ? -1 : 1;
        player.body.setVelocity(direction * 200, -200);
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.physics.pause();
        
        const gameOverText = this.add.text(400, 300, 'GAME OVER\nPunkty: ' + this.score, {
            fontSize: '48px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            align: 'center'
        });
        gameOverText.setOrigin(0.5);
        
        // Dodaj przycisk powrotu do menu
        const menuButton = this.add.text(400, 400, 'Powrót do Menu', {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });
        
        menuButton.on('pointerover', () => {
            menuButton.setScale(1.1);
            menuButton.setStyle({ fill: '#0000ff' });
        });

        menuButton.on('pointerout', () => {
            menuButton.setScale(1);
            menuButton.setStyle({ fill: '#000' });
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.score += 10;
        this.scoreText.setText('Punkty: ' + this.score);
    }

    winLevel(player, finishPoint) {
        this.physics.pause();
        
        const nextLevel = this.currentLevel + 1;
        const isLastLevel = nextLevel >= levels.length;
        
        const winText = this.add.text(400, 250, 
            isLastLevel ? 
            'Gratulacje!\nUkończyłeś wszystkie poziomy!\nPunkty: ' + this.score :
            'Poziom ukończony!\nPunkty: ' + this.score, {
            fontSize: '48px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            align: 'center'
        });
        winText.setOrigin(0.5);
        
        // Przycisk do następnego poziomu lub powrotu do menu
        const buttonText = isLastLevel ? 'Powrót do Menu' : 'Następny Poziom';
        const menuButton = this.add.text(400, 400, buttonText, {
            fontSize: '32px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 }
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });
        
        menuButton.on('pointerover', () => {
            menuButton.setScale(1.1);
            menuButton.setStyle({ fill: '#0000ff' });
        });

        menuButton.on('pointerout', () => {
            menuButton.setScale(1);
            menuButton.setStyle({ fill: '#000' });
        });

        menuButton.on('pointerdown', () => {
            if (isLastLevel) {
                this.scene.start('MenuScene');
            } else {
                this.scene.restart({ level: nextLevel });
            }
        });
    }

    handleEnemyCollision(player, enemy) {
        // Sprawdź czy gracz jest nad przeciwnikiem
        const playerBottom = player.body.bottom;
        const enemyTop = enemy.body.top;
        
        if (playerBottom <= enemyTop + 10) { // Dodajemy małą tolerancję dla lepszej detekcji
            // Eliminacja przeciwnika
            this.eliminateEnemy(enemy);
            // Odbij gracza do góry
            player.body.setVelocityY(-330);
            // Dodaj punkty za eliminację przeciwnika
            this.score += 50;
            this.scoreText.setText('Punkty: ' + this.score);
        } else if (!this.isInvulnerable) {
            // Standardowe zderzenie - gracz otrzymuje obrażenia
            // tylko jeśli nie skoczył na głowę przeciwnika
            this.hitEnemy(player, enemy);
        }
    }

    eliminateEnemy(enemy) {
        // Efekt znikania
        this.tweens.add({
            targets: enemy,
            alpha: 0,
            scale: 0,
            duration: 200,
            onComplete: () => {
                enemy.destroy();
            }
        });
    }

    update() {
        if (!this.player || !this.player.body || !this.player.body.enable) return;

        // Sterowanie graczem
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
            if (this.playerDirection === 1) {
                this.player.setScale(-1, 1);
                this.playerDirection = -1;
            }
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
            if (this.playerDirection === -1) {
                this.player.setScale(1, 1);
                this.playerDirection = 1;
            }
        } else {
            this.player.body.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-330);
        }

        // Aktualizacja przeciwników
        this.enemies.getChildren().forEach(enemy => {
            // Oblicz odległość do gracza
            const distance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                this.player.x, this.player.y
            );

            if (distance < this.detectionRange) {
                // Przeciwnik widzi gracza - rozpocznij pościg
                enemy.isChasing = true;
                const directionToPlayer = this.player.x < enemy.x ? -1 : 1;
                
                // Sprawdź czy przeciwnik nie wyjdzie poza mapę
                if ((enemy.x <= 50 && directionToPlayer === -1) || 
                    (enemy.x >= 750 && directionToPlayer === 1)) {
                    // Jeśli przeciwnik doszedł do krawędzi, nie pozwól mu iść dalej
                    enemy.body.setVelocityX(0);
                } else {
                    enemy.setScale(directionToPlayer, 1);
                    enemy.body.setVelocityX(enemy.chaseSpeed * directionToPlayer);
                }
            } else if (enemy.isChasing) {
                // Przestań gonić i wróć do normalnego zachowania
                enemy.isChasing = false;
                enemy.direction = enemy.direction || 1; // Zabezpieczenie przed undefined
                enemy.body.setVelocityX(enemy.baseSpeed * enemy.direction);
            } else {
                // Normalne zachowanie - patrolowanie
                // Sprawdź krawędzie mapy
                if (enemy.x <= 50 || enemy.body.touching.left) {
                    enemy.direction = 1;
                    enemy.setScale(1, 1);
                } else if (enemy.x >= 750 || enemy.body.touching.right) {
                    enemy.direction = -1;
                    enemy.setScale(-1, 1);
                }
                
                enemy.body.setVelocityX(enemy.baseSpeed * enemy.direction);
            }
        });
    }
}