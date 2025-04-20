class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // Load logo image if not already loaded
        if (!this.textures.exists('logo')) {
            this.load.image('logo', 'assets/FlapAttackNoBgColorBlueFill.png');
        }
    }

    init(data) {
        this.targetScene = data.targetScene;
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Create dark background
        this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000)
            .setOrigin(0);

        // Add logo image
        let logo;
        if (this.textures.exists('logo')) {
            logo = this.add.image(gameWidth/2, gameHeight * 0.3, 'logo');
            
            // Scale the logo to fit
            const maxWidth = gameWidth * 0.6;
            if (logo.width > maxWidth) {
                const scale = maxWidth / logo.width;
                logo.setScale(scale);
            }
        }

        // Create loading text
        const loadingText = this.add.text(gameWidth/2, gameHeight/2 + 50, 'Loading...', {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Create spinner
        const spinner = this.add.graphics();
        const spinnerRadius = 30;
        const spinnerWidth = 8;
        const spinnerSegments = 8;
        
        // Spinner animation
        let angle = 0;
        this.time.addEvent({
            delay: 1000/60,
            loop: true,
            callback: () => {
                spinner.clear();
                
                for (let i = 0; i < spinnerSegments; i++) {
                    const segmentAngle = (i * Math.PI * 2 / spinnerSegments) + angle;
                    const alpha = 1 - (i / spinnerSegments);
                    
                    spinner.lineStyle(spinnerWidth, 0x00ff00, alpha);
                    spinner.beginPath();
                    spinner.arc(
                        gameWidth/2,
                        gameHeight/2 + 120,
                        spinnerRadius,
                        segmentAngle,
                        segmentAngle + (Math.PI * 2 / spinnerSegments) - 0.1
                    );
                    spinner.strokePath();
                }
                
                angle += 0.1;
            }
        });

        // Simulate loading time (replace with actual loading logic)
        this.time.delayedCall(1000, () => {
            this.scene.start(this.targetScene);
        });
    }
} 