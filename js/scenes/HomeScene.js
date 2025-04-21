class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
        this.musicInitialized = false;
    }

    preload() {
        // Load logo image
        this.load.image('logo', 'assets/FlapAttackNoBgColorBlueFill.png');
        // Load menu background image
        this.load.image('menuBackground', 'assets/MenuImage1.png');
        // Load assets needed for the home scene
        this.load.image('homeBackground', 'assets/MenuImage1.png');
        // Load any other assets needed for the home scene
        
        // Load the music file
        this.load.audio('gameMusic', 'assets/IttyBitty.mp3');
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Create background using the image
        const background = this.add.image(gameWidth/2, gameHeight/2, 'menuBackground');
        
        // Scale the background to cover the screen
        const scaleX = gameWidth / background.width;
        const scaleY = gameHeight / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        // Add logo image
        const logo = this.add.image(gameWidth/2, gameHeight * 0.22, 'logo');
        
        // Scale the logo to fit nicely
        const maxWidth = gameWidth * 0.75;
        if (logo.width > maxWidth) {
            const scale = maxWidth / logo.width;
            logo.setScale(scale);
        }

        // Initialize audio system and globals
        this.initAudioSystem();

        // Create menu container - adjusted position for better spacing
        const menuContainer = this.add.container(gameWidth/2, gameHeight * 0.55);

        // Menu items with capitalized text for consistency
        const menuItems = [
            { 
                text: 'PLAY', 
                action: () => {
                    // Try to start music after user interaction
                    this.tryPlayMusic();
                    this.scene.start('GameScene');
                }
            },
            { 
                text: 'SETTINGS', 
                action: () => {
                    // Try to start music after user interaction
                    this.tryPlayMusic();
                    this.scene.start('SettingsScene');
                }
            }
        ];

        // Create menu items with better sizing and spacing
        const buttonSpacing = 70; // Increased spacing
        
        menuItems.forEach((item, index) => {
            const yOffset = index * buttonSpacing;
            
            // Add button with larger font
            const button = this.add.text(0, yOffset, item.text, {
                fontSize: '42px', // Larger font
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 3,
                fontFamily: '"Jersey 10", sans-serif'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                button.setScale(1.1);
                button.setFill('#3CEFFF'); // Blue highlight on hover
            })
            .on('pointerout', () => {
                button.setScale(1);
                button.setFill('#fff');
            })
            .on('pointerdown', () => {
                // Try to resume audio context on every click
                if (this.sound.context.state === 'suspended') {
                    this.sound.context.resume();
                }
                item.action();
            });

            // Add glowing effect to buttons
            this.tweens.add({
                targets: button,
                alpha: 0.8,
                duration: 1500,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });

            menuContainer.add(button);
        });

        // Add version text
        this.add.text(gameWidth/2, gameHeight - 20, 'v1.0.0', {
            fontSize: '18px',
            fill: '#666',
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);
        
        // Also add click handler to background to enable audio
        this.input.on('pointerdown', () => {
            this.tryPlayMusic();
        }, this);
    }
    
    initAudioSystem() {
        // Initialize game music if it doesn't exist
        if (!this.sys.game.globals) {
            this.sys.game.globals = {};
        }
        
        if (!this.sys.game.globals.music) {
            this.sys.game.globals.music = this.sound.add('gameMusic', {
                loop: true,
                volume: parseFloat(localStorage.getItem('musicVolume') || '0.5')
            });
        }
        
        // Check if this is the first time loading the game and set default music setting
        if (localStorage.getItem('music') === null) {
            localStorage.setItem('music', '0'); // 0 = ON, 1 = OFF
        }
    }
    
    tryPlayMusic() {
        // Only try to play music after user interaction and if not already initialized
        if (!this.musicInitialized) {
            // Try to unlock audio
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            
            // Play music if it should be on
            const musicSetting = localStorage.getItem('music');
            if (musicSetting === '0' && this.sys.game.globals.music && !this.sys.game.globals.music.isPlaying) {
                this.sys.game.globals.music.play();
            }
            
            this.musicInitialized = true;
        }
    }
} 