class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Semi-transparent background
        this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.7).setOrigin(0);

        // Create menu container
        const menuContainer = this.add.container(gameWidth/2, gameHeight * 0.3);

        // Add small logo if it exists
        if (this.textures.exists('logo')) {
            const logo = this.add.image(0, -80, 'logo');
            // Scale down the logo
            const maxWidth = gameWidth * 0.4;
            if (logo.width > maxWidth) {
                const scale = maxWidth / logo.width;
                logo.setScale(scale);
            }
            menuContainer.add(logo);
        }

        // Add pause title
        const titleText = this.add.text(0, 0, 'PAUSED', {
            fontSize: '36px',
            fill: '#fff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        menuContainer.add(titleText);

        // Menu items
        const menuItems = [
            { 
                text: 'Resume', 
                action: () => this.resumeGame()
            },
            { 
                text: 'Settings', 
                action: () => {
                    this.scene.launch('SettingsScene');
                    this.scene.stop();
                }
            },
            { 
                text: 'Restart', 
                action: () => {
                    if (this.scene.isPaused('GameScene')) {
                        this.scene.stop('GameScene');
                    }
                    this.scene.stop();
                    this.scene.start('GameScene');
                }
            },
            { 
                text: 'Main Menu', 
                action: () => {
                    if (this.scene.isPaused('GameScene')) {
                        this.scene.stop('GameScene');
                    }
                    this.scene.stop();
                    this.scene.start('HomeScene');
                }
            }
        ];

        let yOffset = 60;
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

        // Add ESC key handler
        this.input.keyboard.on('keydown-ESC', () => this.resumeGame());
    }

    resumeGame() {
        if (this.scene.isPaused('GameScene')) {
            this.scene.resume('GameScene');
        }
        this.scene.stop();
    }
} 