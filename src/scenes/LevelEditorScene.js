import Phaser from 'phaser';

export default class LevelEditorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelEditorScene' });
    }

    create() {
        this.currentTool = 'platform';
        this.levelData = {
            platforms: [],
            player: null,
            enemies: [],
            coins: [],
            finish: null
        };

        // Toolbar
        this.createToolbar();
        
        // Grid pomocniczy
        this.createGrid();
        
        // Obszar edycji
        this.createEditArea();
        
        // Przyciski akcji
        this.createActionButtons();

        // Informacja o aktualnym narzędziu
        this.toolInfo = this.add.text(16, 16, 'Wybrane: Platforma', {
            fontSize: '24px',
            fill: '#000'
        });

        // Obsługa kliknięć
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y > 100) { // Poniżej toolbara
                this.handlePlacement(pointer);
            }
        });

        // Obsługa usuwania (prawy przycisk myszy)
        this.input.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown()) {
                this.handleDelete(pointer);
            }
        });
    }

    createToolbar() {
        const tools = [
            { key: 'platform', icon: '⬛', text: 'Platforma' },
            { key: 'player', icon: '🐧', text: 'Gracz' },
            { key: 'enemy', icon: '🦟', text: 'Przeciwnik' },
            { key: 'coin', icon: '⭐', text: 'Moneta' },
            { key: 'finish', icon: '🌌', text: 'Meta' }
        ];

        tools.forEach((tool, index) => {
            const button = this.add.text(100 + (index * 100), 50, tool.icon, {
                fontSize: '32px',
                padding: { x: 10, y: 10 }
            });
            
            button.setInteractive({ useHandCursor: true });
            
            button.on('pointerdown', () => {
                this.currentTool = tool.key;
                this.toolInfo.setText(`Wybrane: ${tool.text}`);
            });

            button.on('pointerover', () => button.setScale(1.1));
            button.on('pointerout', () => button.setScale(1));
        });
    }

    createGrid() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x000000, 0.2);

        // Rysuj pionowe linie
        for (let x = 0; x < 800; x += 32) {
            graphics.moveTo(x, 100);
            graphics.lineTo(x, 600);
        }

        // Rysuj poziome linie
        for (let y = 100; y < 600; y += 32) {
            graphics.moveTo(0, y);
            graphics.lineTo(800, y);
        }

        graphics.strokePath();
    }

    createEditArea() {
        // Obszar do edycji
        const editArea = this.add.rectangle(0, 100, 800, 500, 0xffffff, 0.1);
        editArea.setOrigin(0);
    }

    createActionButtons() {
        const buttonStyle = {
            fontSize: '16px',
            fill: '#000',
            padding: { x: 8, y: 4 },
            backgroundColor: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        };

        // Przycisk Powrót
        const backButton = this.add.text(520, 20, 'Powrót', buttonStyle);
        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => this.scene.start('MenuScene'));
        this.setupButtonHover(backButton);

        // Przycisk Zapisz
        const saveButton = this.add.text(630, 20, 'Zapisz', buttonStyle);
        saveButton.setInteractive({ useHandCursor: true });
        saveButton.on('pointerdown', () => this.saveLevel());
        this.setupButtonHover(saveButton);

        // Przycisk Test
        const testButton = this.add.text(740, 20, 'Test', buttonStyle);
        testButton.setInteractive({ useHandCursor: true });
        testButton.on('pointerdown', () => this.testLevel());
        this.setupButtonHover(testButton);

        // Dodaj zaokrąglone obramowanie dla każdego przycisku
        [backButton, saveButton, testButton].forEach(button => {
            const padding = 4;
            const bounds = button.getBounds();
            const cornerRadius = 5; // Promień zaokrąglenia
            
            // Tło przycisku
            const background = this.add.graphics();
            background.fillStyle(0xffffff);
            background.lineStyle(1, 0x000000);
            
            // Rysuj zaokrąglony prostokąt
            background.beginPath();
            background.moveTo(bounds.x - padding + cornerRadius, bounds.y - padding);
            background.lineTo(bounds.x + bounds.width + padding - cornerRadius, bounds.y - padding);
            background.arc(bounds.x + bounds.width + padding - cornerRadius, bounds.y - padding + cornerRadius, cornerRadius, -Math.PI/2, 0);
            background.lineTo(bounds.x + bounds.width + padding, bounds.y + bounds.height + padding - cornerRadius);
            background.arc(bounds.x + bounds.width + padding - cornerRadius, bounds.y + bounds.height + padding - cornerRadius, cornerRadius, 0, Math.PI/2);
            background.lineTo(bounds.x - padding + cornerRadius, bounds.y + bounds.height + padding);
            background.arc(bounds.x - padding + cornerRadius, bounds.y + bounds.height + padding - cornerRadius, cornerRadius, Math.PI/2, Math.PI);
            background.lineTo(bounds.x - padding, bounds.y - padding + cornerRadius);
            background.arc(bounds.x - padding + cornerRadius, bounds.y - padding + cornerRadius, cornerRadius, Math.PI, -Math.PI/2);
            background.closePath();
            
            background.fill();
            background.stroke();
            
            // Upewnij się, że tekst jest na wierzchu
            button.setDepth(1);
        });
    }

    setupButtonHover(button) {
        button.on('pointerover', () => {
            button.setScale(1.1);
            button.setStyle({ fill: '#0000ff' });
        });

        button.on('pointerout', () => {
            button.setScale(1);
            button.setStyle({ fill: '#000' });
        });
    }

    handlePlacement(pointer) {
        // Przyciągnij do siatki
        const x = Math.floor(pointer.x / 32) * 32 + 16;
        const y = Math.floor(pointer.y / 32) * 32 + 16;

        switch (this.currentTool) {
            case 'platform':
                this.placePlatform(x, y);
                break;
            case 'player':
                this.placePlayer(x, y);
                break;
            case 'enemy':
                this.placeEnemy(x, y);
                break;
            case 'coin':
                this.placeCoin(x, y);
                break;
            case 'finish':
                this.placeFinish(x, y);
                break;
        }
    }

    placePlatform(x, y) {
        const platform = this.add.rectangle(x, y, 32, 32, 0x8B4513);
        this.levelData.platforms.push({
            x: x,
            y: y,
            width: 32,
            height: 32
        });
    }

    placePlayer(x, y) {
        if (this.playerSprite) {
            this.playerSprite.destroy();
        }
        this.playerSprite = this.add.text(x, y, '🐧', { fontSize: '32px' });
        this.playerSprite.setOrigin(0.5);
        this.levelData.player = { x, y };
    }

    placeEnemy(x, y) {
        const enemy = this.add.text(x, y, '🦟', { fontSize: '32px' });
        enemy.setOrigin(0.5);
        this.levelData.enemies.push({ x, y, direction: 1 });
    }

    placeCoin(x, y) {
        const coin = this.add.text(x, y, '⭐', { fontSize: '24px' });
        coin.setOrigin(0.5);
        this.levelData.coins.push({ x, y });
    }

    placeFinish(x, y) {
        if (this.finishSprite) {
            this.finishSprite.destroy();
        }
        this.finishSprite = this.add.text(x, y, '🌌', { fontSize: '32px' });
        this.finishSprite.setOrigin(0.5);
        this.levelData.finish = { x, y };
    }

    handleDelete(pointer) {
        // Implementacja usuwania obiektów
        // TODO: Dodać logikę usuwania obiektów
    }

    saveLevel() {
        if (!this.levelData.player || !this.levelData.finish || this.levelData.platforms.length === 0) {
            alert('Nie można zapisać niekompletnego poziomu!\nWymagane elementy:\n- Gracz (🐧)\n- Meta (🌌)\n- Przynajmniej jedna platforma');
            return;
        }

        // Dodaj nazwę i ID do poziomu
        const levelToSave = {
            ...this.levelData,
            id: Date.now(), // Unikalny identyfikator
            name: 'Własny poziom'
        };

        // Zapisz poziom do pliku
        const levelString = JSON.stringify(levelToSave, null, 2);
        const blob = new Blob([levelString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', 'level_' + levelToSave.id + '.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
    }

    testLevel() {
        // Sprawdź czy poziom ma wszystkie wymagane elementy
        if (!this.levelData.player || !this.levelData.finish || this.levelData.platforms.length === 0) {
            alert('Nie można przetestować niekompletnego poziomu!\nWymagane elementy:\n- Gracz (🐧)\n- Meta (🌌)\n- Przynajmniej jedna platforma');
            return;
        }

        // Zapisz poziom w pamięci lokalnej przeglądarki
        localStorage.setItem('testLevel', JSON.stringify(this.levelData));

        // Przejdź do sceny gry z flagą testowania
        this.scene.start('GameScene', { 
            isTestMode: true,
            customLevel: this.levelData 
        });
    }
} 