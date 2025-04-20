class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Preload logo for consistent branding
        if (!this.textures.exists('logo')) {
            this.load.image('logo', 'assets/FlapAttackNoBgColorBlueFill.png');
        }
    }

    init() {
        this.gameState = 'start';
        this.score = 0;
        this.settings = this.loadSettings();
        
        // Apply settings
        this.birdVelocity = this.getDifficultySettings().birdVelocity;
        this.gravity = this.getDifficultySettings().gravity;
        this.isCountingDown = false;
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Listen for settings updates
        this.game.events.on('settingsUpdated', this.onSettingsUpdated, this);

        // Create game objects container
        this.gameContainer = this.add.container(0, 0);

        // Create bird with improved physics
        this.bird = this.add.circle(150, gameHeight/2, 15, 0x00ff00);
        this.physics.add.existing(this.bird);
        this.bird.body.setCircle(15);
        this.bird.body.setCollideWorldBounds(true);
        this.bird.body.setBounce(0.1);
        this.bird.body.setDrag(50, 0);

        // Score text with improved styling
        this.scoreText = this.add.text(gameWidth/2, 50, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Start text with improved styling
        this.startText = this.add.text(gameWidth/2, gameHeight/2, 'Press SPACE to Start', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);

        // Game over text with improved styling
        this.gameOverText = this.add.text(gameWidth/2, gameHeight/2, 'Game Over!\nPress SPACE to Restart', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5);
        this.gameOverText.setVisible(false);

        // Create countdown timer text
        this.countdownText = this.add.text(gameWidth/2, gameHeight/2, '3', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.countdownText.setVisible(false);

        // Input handling
        this.input.keyboard.on('keydown-SPACE', this.handleInput, this);
        this.input.on('pointerdown', this.handleInput, this);
        this.input.keyboard.on('keydown-ESC', () => {
            if (this.gameState === 'playing' && this.scene.isActive()) {
                this.scene.launch('PauseScene');
                this.scene.pause('GameScene');
            }
        }, this);

        // Add visual trail effect to bird
        this.birdTrail = this.add.graphics();
        this.trailPoints = [];

        // Listen for resume events
        this.events.on('resume', this.startCountdown, this);

        // Apply night mode if enabled
        this.applyNightMode();
    }

    loadSettings() {
        const defaultSettings = {
            musicVolume: 70,
            sfxVolume: 80,
            muteAudio: false,
            difficulty: 'Normal',
            pipeSpeed: 100,
            gapSize: 150,
            showTrail: true,
            screenShake: true,
            nightMode: false
        };

        const savedSettings = localStorage.getItem('flappyBirdSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }

    getDifficultySettings() {
        const difficulties = {
            Easy: {
                birdVelocity: -300,
                gravity: 1000,
                pipeSpeedMultiplier: 0.8
            },
            Normal: {
                birdVelocity: -400,
                gravity: 1500,
                pipeSpeedMultiplier: 1
            },
            Hard: {
                birdVelocity: -500,
                gravity: 2000,
                pipeSpeedMultiplier: 1.2
            }
        };
        return difficulties[this.settings.difficulty];
    }

    onSettingsUpdated(newSettings) {
        this.settings = newSettings;
        
        // Apply difficulty settings
        const diffSettings = this.getDifficultySettings();
        this.birdVelocity = diffSettings.birdVelocity;
        this.gravity = diffSettings.gravity;

        // Apply visual settings
        if (this.settings.showTrail) {
            this.birdTrail.clear();
            this.trailPoints = [];
        }

        this.applyNightMode();
    }

    applyNightMode() {
        // Check if scene is still active and cameras exist
        if (!this.scene.isActive() || !this.cameras || !this.cameras.main) {
            return;
        }
        
        const backgroundColor = this.settings.nightMode ? 0x000033 : 0x000000;
        this.cameras.main.setBackgroundColor(backgroundColor);
        
        if (this.settings.nightMode) {
            // Add stars in night mode
            if (!this.stars) {
                this.stars = [];
                for (let i = 0; i < 50; i++) {
                    const star = this.add.circle(
                        Phaser.Math.Between(0, this.cameras.main.width),
                        Phaser.Math.Between(0, this.cameras.main.height),
                        1,
                        0xffffff,
                        Phaser.Math.FloatBetween(0.3, 1)
                    );
                    this.stars.push(star);
                }
            }
        } else if (this.stars) {
            // Remove stars when night mode is disabled
            this.stars.forEach(star => star.destroy());
            this.stars = null;
        }
    }

    handleInput() {
        // Don't allow input during countdown
        if (this.isCountingDown) return;
        
        switch (this.gameState) {
            case 'start':
                this.startGame();
                break;
            case 'playing':
                this.flapBird();
                break;
            case 'gameOver':
                this.resetGame();
                break;
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.bird.body.setGravityY(this.gravity);
        this.startText.setVisible(false);
    }

    flapBird() {
        // Add "squish" effect on flap
        this.bird.scaleY = 0.8;
        this.bird.scaleX = 1.2;
        this.tweens.add({
            targets: this.bird,
            scaleX: 1,
            scaleY: 1,
            duration: 100,
            ease: 'Quad.easeOut'
        });

        this.bird.body.setVelocityY(this.birdVelocity);
        
        // Add flap effect
        this.addFlapEffect();
    }

    addFlapEffect() {
        const circle = this.add.circle(this.bird.x, this.bird.y, 20, 0x00ff00, 0.4);
        this.tweens.add({
            targets: circle,
            alpha: 0,
            scale: 2,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => circle.destroy()
        });
    }

    gameOver() {
        if (this.gameState !== 'gameOver') {
            this.gameState = 'gameOver';
            this.physics.pause();
            this.gameOverText.setVisible(true);
            
            if (this.settings.screenShake) {
                this.cameras.main.shake(200, 0.01);
            }
            
            this.bird.setTint(0xff0000);
        }
    }

    resetGame() {
        this.gameState = 'start';
        this.physics.resume();
        this.score = 0;
        this.scoreText.setText('Score: 0');
        this.bird.x = 150;
        this.bird.y = this.cameras.main.height/2;
        this.bird.body.setVelocity(0, 0);
        this.bird.body.setGravityY(0);
        this.bird.clearTint();
        this.gameOverText.setVisible(false);
        this.startText.setVisible(true);
        this.trailPoints = [];
        this.birdTrail.clear();
    }

    updateBirdTrail() {
        if (!this.settings.showTrail) {
            this.birdTrail.clear();
            return;
        }

        this.trailPoints.unshift({ x: this.bird.x, y: this.bird.y });
        if (this.trailPoints.length > 5) {
            this.trailPoints.pop();
        }

        this.birdTrail.clear();
        this.birdTrail.lineStyle(2, 0x00ff00, 0.5);
        
        for (let i = 0; i < this.trailPoints.length - 1; i++) {
            const point = this.trailPoints[i];
            const nextPoint = this.trailPoints[i + 1];
            this.birdTrail.lineBetween(point.x, point.y, nextPoint.x, nextPoint.y);
        }
    }

    update() {
        // Don't update game logic during countdown
        if (this.isCountingDown) return;
        
        if (this.gameState === 'playing') {
            // Update bird trail
            this.updateBirdTrail();

            // Check bounds
            if (this.bird.y < 0 || this.bird.y > this.cameras.main.height) {
                this.gameOver();
            }
        }
    }

    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.physics.resume();
        }
    }

    startCountdown() {
        if (this.gameState !== 'playing') return;

        // Set countdown state
        this.isCountingDown = true;
        
        // Store bird properties
        const currentVelocityY = this.bird.body.velocity.y;
        const currentPositionX = this.bird.x;
        const currentPositionY = this.bird.y;
        
        // Pause physics during countdown
        this.physics.pause();
        
        let count = 3;
        this.countdownText.setText(count.toString());
        this.countdownText.setScale(1);
        this.countdownText.setVisible(true);

        // Create countdown timer
        const countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                count--;
                if (count > 0) {
                    this.countdownText.setText(count.toString());
                    // Add a pulse effect
                    this.tweens.add({
                        targets: this.countdownText,
                        scale: 1.2,
                        duration: 200,
                        yoyo: true
                    });
                } else {
                    this.countdownText.setText('GO!');
                    
                    // Flash the GO! text
                    this.tweens.add({
                        targets: this.countdownText,
                        scale: 1.5,
                        duration: 300,
                        yoyo: true,
                        onComplete: () => {
                            // Hide the countdown text
                            this.countdownText.setVisible(false);
                            
                            // Ensure bird is in correct position before resuming
                            this.bird.x = currentPositionX;
                            this.bird.y = currentPositionY;
                            
                            // Resume physics with a slight delay to ensure smooth transition
                            this.time.delayedCall(50, () => {
                                // Resume physics
                                this.physics.resume();
                                
                                // Apply velocity after physics are resumed
                                this.bird.body.velocity.y = currentVelocityY;
                                
                                // End countdown state
                                this.isCountingDown = false;
                            });
                        }
                    });
                }
            },
            repeat: 3
        });
    }
} 