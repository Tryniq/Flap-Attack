// Scene classes are loaded in the HTML before this script
// No imports needed as they're available in the global scope

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 390,
    height: 844,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        max: {
            width: 390,
            height: 844
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
            tileBias: 8,
            fps: 60,
            timeScale: 1,
            maxVelocity: { x: 500, y: 1000 },
            checkCollision: {
                up: true,
                down: true,
                left: true,
                right: true
            }
        }
    },
    scene: [SplashScene, HomeScene, LoadingScene, GameScene, BootScene, SettingsScene, PauseScene]
};

const game = new Phaser.Game(config); 