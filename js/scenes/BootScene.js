class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load the logo image
        this.load.image('logo', 'assets/FlapAttackNoBgColorBlueFill.png');
    }

    create() {
        this.scene.start('HomeScene');
    }
} 