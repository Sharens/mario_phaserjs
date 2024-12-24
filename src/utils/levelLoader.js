class LevelLoader {
    constructor() {
        this.levels = new Map();
    }

    async loadLevels() {
        try {
            const level1 = await import('../levels/level1.json');
            const level2 = await import('../levels/level2.json');
            
            // Dodaj poziomy do mapy
            this.levels.set(1, level1.default);
            this.levels.set(2, level2.default);

            // Zwróć posortowaną tablicę poziomów
            return [level1.default, level2.default].sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error('Błąd podczas ładowania poziomów:', error);
            return [];
        }
    }

    async getLevel(id) {
        if (!this.levels.has(id)) {
            await this.loadLevels();
        }
        return this.levels.get(id);
    }

    async saveLevelToFile(levelData) {
        try {
            const blob = new Blob([JSON.stringify(levelData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `level${levelData.id || Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Błąd podczas zapisywania poziomu:', error);
            throw error;
        }
    }
}

export const levelLoader = new LevelLoader(); 