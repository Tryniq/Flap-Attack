class SplashScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SplashScene' });
        this.ready = false;
    }

    preload() {
        // Load logo image 
        this.load.image('logo', 'assets/FlapAttackNoBgColorBlueFill.png');
        // Load background
        this.load.image('splashBackground', 'assets/MenuImage1.png');
        // Load the music file
        this.load.audio('gameMusic', 'assets/IttyBitty.mp3');
        
        // Add loading events
        this.load.on('complete', () => {
            this.ready = true;
        });
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Create background
        const background = this.add.image(gameWidth/2, gameHeight/2, 'splashBackground');
        const scaleX = gameWidth / background.width;
        const scaleY = gameHeight / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        // Add logo with slight bounce effect
        const logo = this.add.image(gameWidth/2, gameHeight * 0.35, 'logo');
        
        // Scale the logo to fit nicely
        const maxWidth = gameWidth * 0.75;
        if (logo.width > maxWidth) {
            const scale = maxWidth / logo.width;
            logo.setScale(scale);
        }
        
        // Add bounce effect to logo
        this.tweens.add({
            targets: logo,
            y: logo.y - 15,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Add tap/click text with pulsing effect
        const tapText = this.add.text(gameWidth/2, gameHeight * 0.7, 'TAP / CLICK TO PLAY', {
            fontSize: '32px',
            fontFamily: '"Jersey 10", sans-serif',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 5
        }).setOrigin(0.5);
        
        // Add pulsing effect to text
        this.tweens.add({
            targets: tapText,
            scale: 1.1,
            alpha: 0.8,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Initialize audio system
        this.initAudioSystem();
        
        // Add click handler to the entire screen
        this.input.on('pointerdown', this.startGame, this);
        
        // Add version text
        this.add.text(gameWidth/2, gameHeight - 20, 'v1.0.0', {
            fontSize: '16px',
            fill: '#666',
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);
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
    
    startGame() {
        // Ensure we only process one click
        if (!this.ready) return;
        this.ready = false;
        
        // Try to unlock audio
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
        
        // Play music if it should be on
        const musicSetting = localStorage.getItem('music');
        if (musicSetting === '0' && this.sys.game.globals.music && !this.sys.game.globals.music.isPlaying) {
            this.sys.game.globals.music.play();
        }
        
        // Transition effect
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            // Move to the main menu
            this.scene.start('HomeScene');
        });
    }
} 