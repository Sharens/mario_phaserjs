import Phaser from 'phaser';
import { levelLoader } from '../utils/levelLoader';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.lives = 3;
        this.isInvulnerable = false;
    }

    create() {
        // Inicjalizacja klawiszy sterowania
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.isPaused = false;

        // Inicjalizacja tekstu punktów i żyć
        this.scoreText = this.add.text(16, 16, 'Punkty: 0', {
            fontSize: '32px',
            fill: '#000'
        });

        this.livesText = this.add.text(16, 56, 'Życia: ❤️ ❤️ ❤️', {
            fontSize: '32px',
            fill: '#000'
        });

        // Wczytaj poziom
        const customLevel = this.scene.settings.data.customLevel;
        if (customLevel) {
            this.loadCustomLevel(customLevel);
        } else {
            levelLoader.getLevel(1).then(level => {
                if (level) {
                    this.loadCustomLevel(level);
                }
            });
        }
    }

    loadCustomLevel(levelData) {
        // Dodaj platformy
        this.platforms = this.physics.add.staticGroup();
        levelData.platforms.forEach(platform => {
            const platformSprite = this.add.rectangle(platform.x, platform.y, platform.width, platform.height, 0x8B4513);
            this.platforms.add(platformSprite);
        });
        
        // Dodaj gracza jako emoji pingwina zamiast prostokąta
        this.player = this.add.text(levelData.player.x, levelData.player.y, '🐧', {
            fontSize: '32px'
        });
        this.player.setOrigin(0.5);
        this.physics.add.existing(this.player);
        this.player.body.setBounce(0.2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(30, 30); // Dostosuj rozmiar hitboxa
        this.playerDirection = 1;

        // Dodaj przeciwników
        this.enemies = this.physics.add.group();
        levelData.enemies.forEach(enemy => {
            const enemySprite = this.add.text(enemy.x, enemy.y, '🦟', {
                fontSize: '32px'
            });
            enemySprite.setOrigin(0.5);
            this.physics.add.existing(enemySprite);
            this.enemies.add(enemySprite);
            enemySprite.body.setBounce(0);
            enemySprite.body.setCollideWorldBounds(true);
            enemySprite.direction = enemy.direction;
        });
        
        // Dodaj monety
        this.coins = this.physics.add.staticGroup();
        levelData.coins.forEach(coin => {
            const coinSprite = this.add.text(coin.x, coin.y, '⭐', {
                fontSize: '24px'
            });
            coinSprite.setOrigin(0.5);
            this.coins.add(coinSprite);
        });
        
        // Dodaj punkt końcowy
        this.finishPoint = this.add.text(levelData.finish.x, levelData.finish.y, '🌌', {
            fontSize: '50px'
        });
        this.finishPoint.setOrigin(0.5);
        this.physics.add.existing(this.finishPoint, true);
        this.finishPoint.body.setSize(40, 40);
        this.finishPoint.body.setOffset(5, 5);

        // Dodaj kolizje
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player, this.finishPoint, this.winLevel, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handleEnemyCollision, null, this);
    }

    update() {
        if (!this.player || !this.player.body || !this.player.body.enable) return;

        // Sprawdź czy wciśnięto ESC
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            if (!this.isPaused) {
                this.showPauseMenu();
            }
        }

        // Jeśli gra jest zapauzowana, nie aktualizuj logiki gry
        if (this.isPaused) return;

        // Obsługa ruchu gracza
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
            this.playerDirection = -1;
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
            this.playerDirection = 1;
        } else {
            this.player.body.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-330);
        }

        // Aktualizacja przeciwników
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.body) {
                enemy.body.setVelocityX(100 * enemy.direction);
                
                // Sprawdź kolizję z platformami dla zmiany kierunku
                if (enemy.body.blocked.right) {
                    enemy.direction = -1;
                } else if (enemy.body.blocked.left) {
                    enemy.direction = 1;
                }
            }
        });
    }

    collectCoin(player, coin) {
        coin.destroy();
        this.score += 10;
        this.scoreText.setText('Punkty: ' + this.score);
    }

    handleEnemyCollision(player, enemy) {
        if (this.isInvulnerable) return;

        if (player.body.velocity.y > 0 && player.body.y < enemy.body.y) {
            enemy.destroy();
            this.score += 20;
            this.scoreText.setText('Punkty: ' + this.score);
            player.body.setVelocityY(-200);
        } else {
            this.lives = Math.max(0, this.lives - 1);
            this.livesText.setText('Życia: ' + '❤️ '.repeat(this.lives));

            if (this.lives > 0) {
                this.isInvulnerable = true;
                
                let blinkCount = 0;
                const blinkInterval = this.time.addEvent({
                    delay: 200,
                    callback: () => {
                        this.player.alpha = this.player.alpha === 1 ? 0.5 : 1;
                        blinkCount++;
                        if (blinkCount >= 10) {
                            blinkInterval.destroy();
                            this.player.alpha = 1;
                            this.isInvulnerable = false;
                        }
                    },
                    loop: true
                });

                const knockbackDirection = player.x < enemy.x ? -1 : 1;
                player.body.setVelocityX(knockbackDirection * 200);
                player.body.setVelocityY(-200);
            } else {
                this.gameOver();
            }
        }
    }

    winLevel() {
        this.scene.start('LevelSelectScene');
    }

    gameOver() {
        this.scene.start('MenuScene');
    }

    showPauseMenu() {
        // Zatrzymaj grę
        this.isPaused = true;
        this.physics.pause();

        // Przyciemnij tło
        const overlay = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000, 0.7);
        overlay.setOrigin(0);

        // Kontener menu pauzy
        const menuContainer = this.add.container(400, 300);

        // Tytuł menu
        const title = this.add.text(0, -100, 'PAUZA', {
            fontSize: '48px',
            fill: '#fff'
        });
        title.setOrigin(0.5);

        // Przyciski menu
        const buttonStyle = {
            fontSize: '32px',
            fill: '#fff'
        };

        const resumeButton = this.add.text(0, -20, 'Kontynuuj', buttonStyle);
        resumeButton.setOrigin(0.5);
        resumeButton.setInteractive({ useHandCursor: true });

        const menuButton = this.add.text(0, 40, 'Wróć do menu', buttonStyle);
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });

        // Dodaj efekty hover dla przycisków
        [resumeButton, menuButton].forEach(button => {
            button.on('pointerover', () => {
                button.setScale(1.1);
                button.setStyle({ fill: '#0000ff' });
            });

            button.on('pointerout', () => {
                button.setScale(1);
                button.setStyle({ fill: '#fff' });
            });
        });

        // Obsługa kliknięć
        resumeButton.on('pointerdown', () => {
            menuContainer.destroy();
            overlay.destroy();
            this.isPaused = false;
            this.physics.resume();
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Dodaj elementy do kontenera
        menuContainer.add([title, resumeButton, menuButton]);
    }
}