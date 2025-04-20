class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Create background
        this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000)
            .setOrigin(0)
            .setAlpha(0.8);

        // Add game title
        const titleText = this.add.text(gameWidth/2, gameHeight/3, 'FLAPPY BIRD', {
            fontSize: '64px',
            fill: '#fff',
            stroke: '#00ff00',
            strokeThickness: 6,
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Add press any key text with blinking animation
        const pressAnyKeyText = this.add.text(gameWidth/2, gameHeight * 0.6, 'Press Any Button to Start', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Create blinking animation
        this.tweens.add({
            targets: pressAnyKeyText,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add version text
        this.add.text(gameWidth - 20, gameHeight - 20, 'v1.0.0', {
            fontSize: '16px',
            fill: '#666'
        }).setOrigin(1);

        // Handle any input to start the game
        const startGame = () => {
            // Add flash effect
            this.cameras.main.flash(500, 255, 255, 255);
            
            // Wait for flash to complete before changing scene
            this.time.delayedCall(250, () => {
                this.scene.start('GameScene');
            });
        };

        // Listen for any input
        this.input.keyboard.on('keydown', startGame);
        this.input.on('pointerdown', startGame);

        // Add floating animation to title
        this.tweens.add({
            targets: titleText,
            y: titleText.y - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
} 