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
        
        // Inicjalizacja żyć
        this.lives = 3;
        
        // Dodaj platformy
        this.platforms = this.physics.add.staticGroup();
        this.platforms.add(this.add.rectangle(400, 568, 800, 32, 0x8B4513));
        this.platforms.add(this.add.rectangle(600, 450, 200, 32, 0x8B4513));
        this.platforms.add(this.add.rectangle(50, 350, 200, 32, 0x8B4513));
        
        // Dodaj gracza - pingwina
        this.player = this.add.text(100, 450, '🐧', {
            fontSize: '40px'
        });
        this.player.setOrigin(0.5);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);
        
        // Dostosowanie hitboxa gracza
        this.player.body.setSize(30, 35);
        this.player.body.setOffset(5, 5);
        
        // Dodanie właściwości kierunku dla animacji
        this.playerDirection = 1; // 1 prawo, -1 lewo
        
        // Dodaj przeciwników
        this.enemies = this.physics.add.group();
        this.createEnemies();
        
        // Dodaj punkt końcowy (galaktyka)
        this.finishPoint = this.add.text(750, 250, '🌌', {
            fontSize: '50px'
        });
        this.finishPoint.setOrigin(0.5);
        this.physics.add.existing(this.finishPoint, true);
        this.finishPoint.body.setSize(40, 40);
        this.finishPoint.body.setOffset(5, 5);
        
        // Dodaj monety
        this.coins = this.physics.add.staticGroup();
        this.createCoins();
        
        // Dodaj UI (punkty i życia)
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Punkty: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        
        this.livesText = this.add.text(16, 56, `Życia ${this.lives}x ❤️`, {
            fontSize: '32px',
            fill: '#000'
        });
        
        // Dodaj kolizje
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.finishPoint, this.winLevel, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, null, this);
        
        // Dodaj sterowanie
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Flaga nieśmiertelności (po uderzeniu)
        this.isInvulnerable = false;
        
        // Zasięg wykrywania gracza
        this.detectionRange = 200;
    }

    createEnemies() {
        const enemyPositions = [
            { x: 300, y: 300, direction: 1 },
            { x: 600, y: 400, direction: -1 },
            { x: 450, y: 200, direction: 1 }
        ];
        
        enemyPositions.forEach(pos => {
            const enemy = this.add.text(pos.x, pos.y, '🦟', {
                fontSize: '32px'
            });
            
            enemy.setOrigin(0.5);
            this.physics.add.existing(enemy);
            this.enemies.add(enemy);
            
            // Ustawienie właściwości fizycznych
            enemy.direction = pos.direction;
            enemy.baseSpeed = 100;
            enemy.chaseSpeed = 150;
            enemy.body.setVelocityX(enemy.baseSpeed * pos.direction);
            enemy.body.setBounce(0);
            enemy.body.setCollideWorldBounds(true);
            enemy.body.setSize(25, 25);
            enemy.body.setOffset(4, 4);
            
            // Dodaj właściwość isChasing
            enemy.isChasing = false;
        });
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
        
        const winText = this.add.text(400, 300, 'Poziom ukończony!\nPunkty: ' + this.score, {
            fontSize: '48px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 20, y: 10 },
            align: 'center'
        });
        winText.setOrigin(0.5);
        
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
        
        // Animacja punktu końcowego
        this.tweens.add({
            targets: finishPoint,
            scale: 1.2,
            duration: 200,
            yoyo: true,
            repeat: 4
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