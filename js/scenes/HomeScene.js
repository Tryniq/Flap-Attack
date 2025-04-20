class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    preload() {
        // Load logo image
        this.load.image('logo', 'assets/FlapAttackNoBgColorBlueFill.png');
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Create background
        this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000).setOrigin(0);

        // Add logo image instead of text
        const logo = this.add.image(gameWidth/2, gameHeight * 0.2, 'logo');
        
        // Scale the logo to fit nicely
        const maxWidth = gameWidth * 0.8;
        if (logo.width > maxWidth) {
            const scale = maxWidth / logo.width;
            logo.setScale(scale);
        }

        // Create menu container
        const menuContainer = this.add.container(gameWidth/2, gameHeight * 0.5);

        // Menu items - only include implemented scenes
        const menuItems = [
            { text: 'Play', action: () => this.scene.start('GameScene') },
            { text: 'Settings', action: () => this.scene.start('SettingsScene') }
        ];

        let yOffset = 0;
        menuItems.forEach((item, index) => {
            const button = this.add.text(0, yOffset, item.text, {
                fontSize: '32px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 2,
                fontFamily: 'Arial Black'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => button.setScale(1.1))
            .on('pointerout', () => button.setScale(1))
            .on('pointerdown', item.action);

            menuContainer.add(button);
            yOffset += 60;
        });

        // Add version text
        this.add.text(gameWidth/2, gameHeight - 20, 'v1.0.0', {
            fontSize: '16px',
            fill: '#666',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
} 