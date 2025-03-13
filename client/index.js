// Wizards Ascent - Client
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PixiJS Application
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
    });

    // Add the canvas to the DOM
    document.getElementById('game-container').appendChild(app.view);

    // Display loading message
    const loadingText = new PIXI.Text('Initializing Wizards Ascent...', {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
        align: 'center',
    });
    loadingText.anchor.set(0.5);
    loadingText.x = app.screen.width / 2;
    loadingText.y = app.screen.height / 2;
    app.stage.addChild(loadingText);

    console.log('Wizards Ascent client initialized');
});
