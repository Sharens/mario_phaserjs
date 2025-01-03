export const levels = [
    {
        id: 1,
        platforms: [
            { x: 400, y: 568, width: 800, height: 32 },  // główna platforma
            { x: 600, y: 450, width: 200, height: 32 },
            { x: 50, y: 350, width: 200, height: 32 },
            { x: 750, y: 320, width: 200, height: 32 }
        ],
        player: { x: 100, y: 450 },
        enemies: [
            { x: 300, y: 300, direction: 1 },
            { x: 600, y: 400, direction: -1 },
            { x: 450, y: 200, direction: 1 }
        ],
        coins: [
            { x: 300, y: 400 },
            { x: 450, y: 300 },
            { x: 600, y: 350 }
        ],
        finish: { x: 750, y: 250 }
    },
    {
        id: 2,
        platforms: [
            { x: 400, y: 568, width: 800, height: 32 },
            { x: 200, y: 450, width: 200, height: 32 },
            { x: 600, y: 350, width: 200, height: 32 },
            { x: 400, y: 250, width: 200, height: 32 }
        ],
        player: { x: 100, y: 450 },
        enemies: [
            { x: 200, y: 300, direction: 1 },
            { x: 400, y: 200, direction: -1 },
            { x: 600, y: 300, direction: 1 },
            { x: 300, y: 400, direction: -1 }
        ],
        coins: [
            { x: 200, y: 350 },
            { x: 400, y: 150 },
            { x: 600, y: 250 },
            { x: 300, y: 450 }
        ],
        finish: { x: 750, y: 150 }
    }
]; 