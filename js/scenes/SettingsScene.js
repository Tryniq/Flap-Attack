class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
        this.difficultyOptions = ['EASY', 'NORMAL', 'HARD'];
        this.currentDifficulty = parseInt(localStorage.getItem('difficulty') || '1');
        this.isDropdownOpen = false;
        
        // Initialize volume (default: 50%)
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume') || '0.5');
        
        // Check if this is the first time loading the game
        // If it is, set music ON by default
        if (localStorage.getItem('music') === null) {
            localStorage.setItem('music', '0'); // 0 = ON, 1 = OFF
        }
    }

    preload() {
        this.load.image('settingsBackground', 'assets/MenuImage1.png');
        this.load.audio('gameMusic', 'assets/IttyBitty.mp3');
        this.load.image('sliderBar', 'assets/sliderBar.png');
        this.load.image('sliderKnob', 'assets/sliderKnob.png');
        
        // Create placeholder assets if they don't exist
        this.createPlaceholderAssets();
    }
    
    createPlaceholderAssets() {
        // Check if slider assets exist and create them if not
        const sliderBarKey = 'sliderBar';
        const sliderKnobKey = 'sliderKnob';
        
        if (!this.textures.exists(sliderBarKey)) {
            const barGraphics = this.make.graphics({x: 0, y: 0, add: false});
            barGraphics.fillStyle(0x000000, 0.5);
            barGraphics.fillRect(0, 0, 200, 10);
            barGraphics.lineStyle(2, 0x3CEFFF, 1);
            barGraphics.strokeRect(0, 0, 200, 10);
            barGraphics.generateTexture(sliderBarKey, 200, 10);
        }
        
        if (!this.textures.exists(sliderKnobKey)) {
            const knobGraphics = this.make.graphics({x: 0, y: 0, add: false});
            knobGraphics.fillStyle(0x3CEFFF, 1);
            knobGraphics.fillRect(0, 0, 15, 20);
            knobGraphics.lineStyle(2, 0xFFFFFF, 0.8);
            knobGraphics.strokeRect(0, 0, 15, 20);
            knobGraphics.generateTexture(sliderKnobKey, 15, 20);
        }
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Background
        const bg = this.add.image(gameWidth/2, gameHeight/2, 'settingsBackground');
        const scale = Math.max(gameWidth / bg.width, gameHeight / bg.height);
        bg.setScale(scale);

        // Initialize game music if it doesn't exist
        if (!this.sys.game.globals) {
            this.sys.game.globals = {};
        }
        
        if (!this.sys.game.globals.music) {
            this.sys.game.globals.music = this.sound.add('gameMusic', {
                loop: true,
                volume: this.musicVolume
            });
        }
        
        // Reference to the music
        this.music = this.sys.game.globals.music;
        
        // Set volume based on saved preference
        this.music.volume = this.musicVolume;
        
        // Always play music if it should be on (based on settings)
        const musicSetting = localStorage.getItem('music');
        if (musicSetting === '0' && !this.music.isPlaying) {
            this.music.play();
        } else if (musicSetting === '1' && this.music.isPlaying) {
            this.music.stop();
        }

        // TITLE - Top center
        this.add.text(gameWidth/2, gameHeight * 0.15, 'SETTINGS', {
            fontSize: '42px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        // BACK BUTTON - Top left with shadow effect
        const backButton = this.add.text(40, 40, '< BACK', {
            fontSize: '26px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);
        
        backButton.setInteractive()
            .on('pointerover', () => backButton.setFill('#3CEFFF'))
            .on('pointerout', () => backButton.setFill('#FFFFFF'))
            .on('pointerdown', () => {
                this.scene.start('HomeScene');
            });

        // SOUND SETTINGS - Mid screen
        const soundY = gameHeight * 0.3;
        this.add.text(80, soundY, 'SOUND:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);

        const soundOnText = this.add.text(220, soundY, 'ON', {
            fontSize: '28px',
            fill: localStorage.getItem('sound') === '0' ? '#3CEFFF' : '#888888',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        const soundOffText = this.add.text(300, soundY, 'OFF', {
            fontSize: '28px',
            fill: localStorage.getItem('sound') === '1' ? '#3CEFFF' : '#888888',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        soundOnText.setInteractive()
            .on('pointerover', () => {
                if (localStorage.getItem('sound') !== '0') {
                    soundOnText.setFill('#FFFFFF');
                }
            })
            .on('pointerout', () => {
                if (localStorage.getItem('sound') !== '0') {
                    soundOnText.setFill('#888888');
                }
            })
            .on('pointerdown', () => {
                soundOnText.setFill('#3CEFFF');
                soundOffText.setFill('#888888');
                localStorage.setItem('sound', '0');
            });

        soundOffText.setInteractive()
            .on('pointerover', () => {
                if (localStorage.getItem('sound') !== '1') {
                    soundOffText.setFill('#FFFFFF');
                }
            })
            .on('pointerout', () => {
                if (localStorage.getItem('sound') !== '1') {
                    soundOffText.setFill('#888888');
                }
            })
            .on('pointerdown', () => {
                soundOnText.setFill('#888888');
                soundOffText.setFill('#3CEFFF');
                localStorage.setItem('sound', '1');
            });

        // Line divider with pixel art styling
        const divider1 = this.add.graphics();
        divider1.lineStyle(1, '#3CEFFF', 0.4);
        divider1.beginPath();
        divider1.moveTo(40, soundY + 40);
        divider1.lineTo(gameWidth - 40, soundY + 40);
        divider1.strokePath();

        // MUSIC SETTINGS
        const musicY = soundY + 75;
        this.add.text(80, musicY, 'MUSIC:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);

        const musicOnText = this.add.text(220, musicY, 'ON', {
            fontSize: '28px',
            fill: localStorage.getItem('music') === '0' ? '#3CEFFF' : '#888888',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        const musicOffText = this.add.text(300, musicY, 'OFF', {
            fontSize: '28px',
            fill: localStorage.getItem('music') === '1' ? '#3CEFFF' : '#888888',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        musicOnText.setInteractive()
            .on('pointerover', () => {
                if (localStorage.getItem('music') !== '0') {
                    musicOnText.setFill('#FFFFFF');
                }
            })
            .on('pointerout', () => {
                if (localStorage.getItem('music') !== '0') {
                    musicOnText.setFill('#888888');
                }
            })
            .on('pointerdown', () => {
                musicOnText.setFill('#3CEFFF');
                musicOffText.setFill('#888888');
                localStorage.setItem('music', '0');
                
                // Play music when ON is selected
                if (!this.music.isPlaying) {
                    this.music.play();
                }
            });

        musicOffText.setInteractive()
            .on('pointerover', () => {
                if (localStorage.getItem('music') !== '1') {
                    musicOffText.setFill('#FFFFFF');
                }
            })
            .on('pointerout', () => {
                if (localStorage.getItem('music') !== '1') {
                    musicOffText.setFill('#888888');
                }
            })
            .on('pointerdown', () => {
                musicOnText.setFill('#888888');
                musicOffText.setFill('#3CEFFF');
                localStorage.setItem('music', '1');
                
                // Stop music when OFF is selected
                if (this.music.isPlaying) {
                    this.music.stop();
                }
            });

        // VOLUME SLIDER
        const volumeY = musicY + 50;
        this.add.text(80, volumeY, 'VOLUME:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);
        
        // Create custom slider bar that matches the screenshot
        const sliderWidth = 200;
        const sliderHeight = 10;
        const sliderX = 220;
        
        // Background bar
        const sliderBackground = this.add.graphics();
        sliderBackground.fillStyle(0x555555, 0.3);
        sliderBackground.fillRect(sliderX, volumeY - sliderHeight/2, sliderWidth, sliderHeight);
        sliderBackground.lineStyle(1, 0x3CEFFF, 0.2);
        sliderBackground.strokeRect(sliderX, volumeY - sliderHeight/2, sliderWidth, sliderHeight);
        
        // Filled portion based on current volume
        const filledWidth = sliderWidth * this.musicVolume;
        const filledBar = this.add.graphics();
        filledBar.fillStyle(0x3CEFFF, 0.5);
        filledBar.fillRect(sliderX, volumeY - sliderHeight/2, filledWidth, sliderHeight);
        
        // Slider knob - custom made to match the screenshot
        const knobWidth = 12;
        const knobHeight = 20;
        const knobX = sliderX + filledWidth;
        
        const sliderKnob = this.add.graphics();
        sliderKnob.fillStyle(0x3CEFFF, 1);
        sliderKnob.fillRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
        sliderKnob.lineStyle(2, 0xFFFFFF, 0.8);
        sliderKnob.strokeRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
        
        // Create interactive zone for the entire slider
        const sliderZone = this.add.zone(sliderX + sliderWidth/2, volumeY, sliderWidth + knobWidth, knobHeight)
            .setOrigin(0.5, 0.5)
            .setInteractive();
            
        // Make the entire slider clickable for easier interaction
        sliderZone.on('pointerdown', (pointer) => {
            // Calculate new volume based on click position
            let clickX = Phaser.Math.Clamp(pointer.x, sliderX, sliderX + sliderWidth);
            let newVolume = (clickX - sliderX) / sliderWidth;
            
            // Update volume
            this.musicVolume = newVolume;
            this.music.volume = newVolume;
            localStorage.setItem('musicVolume', newVolume.toString());
            
            // Update visuals
            updateSliderVisuals(newVolume);
        });
        
        // Make knob draggable
        let isDragging = false;
        
        // Create an invisible interactive area around the knob
        const knobZone = this.add.zone(knobX, volumeY, knobWidth + 10, knobHeight + 10)
            .setOrigin(0.5, 0.5)
            .setInteractive({ draggable: true });
            
        knobZone.on('pointerover', () => {
            sliderKnob.clear();
            sliderKnob.fillStyle(0x60FFFF, 1); // Brighter color on hover
            sliderKnob.fillRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
            sliderKnob.lineStyle(2, 0xFFFFFF, 1);
            sliderKnob.strokeRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
        });
        
        knobZone.on('pointerout', () => {
            if (!isDragging) {
                sliderKnob.clear();
                sliderKnob.fillStyle(0x3CEFFF, 1);
                sliderKnob.fillRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
                sliderKnob.lineStyle(2, 0xFFFFFF, 0.8);
                sliderKnob.strokeRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
            }
        });
        
        knobZone.on('dragstart', () => {
            isDragging = true;
        });
        
        knobZone.on('drag', (pointer) => {
            // Calculate new X position
            let newX = Phaser.Math.Clamp(pointer.x, sliderX, sliderX + sliderWidth);
            
            // Calculate new volume
            let newVolume = (newX - sliderX) / sliderWidth;
            this.musicVolume = newVolume;
            
            // Update volume
            this.music.volume = newVolume;
            localStorage.setItem('musicVolume', newVolume.toString());
            
            // Update visuals
            updateSliderVisuals(newVolume);
        });
        
        knobZone.on('dragend', () => {
            isDragging = false;
        });
        
        // Function to update slider visuals
        const updateSliderVisuals = (volume) => {
            // Calculate new position
            const newKnobX = sliderX + (sliderWidth * volume);
            knobX = newKnobX;
            
            // Update knob position
            knobZone.x = newKnobX;
            
            // Clear and redraw slider components
            filledBar.clear();
            filledBar.fillStyle(0x3CEFFF, 0.5);
            filledBar.fillRect(sliderX, volumeY - sliderHeight/2, sliderWidth * volume, sliderHeight);
            
            sliderKnob.clear();
            sliderKnob.fillStyle(isDragging ? 0x60FFFF : 0x3CEFFF, 1);
            sliderKnob.fillRect(newKnobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
            sliderKnob.lineStyle(2, 0xFFFFFF, isDragging ? 1 : 0.8);
            sliderKnob.strokeRect(newKnobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight);
        };

        // Line divider
        const divider2 = this.add.graphics();
        divider2.lineStyle(1, '#3CEFFF', 0.4);
        divider2.beginPath();
        divider2.moveTo(40, volumeY + 40);
        divider2.lineTo(gameWidth - 40, volumeY + 40);
        divider2.strokePath();

        // DIFFICULTY SETTINGS
        const difficultyY = volumeY + 75;
        this.add.text(80, difficultyY, 'DIFFICULTY:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);

        // Create dropdown box with improved pixel art style
        const dropdownWidth = 160;
        const dropdownHeight = 42;
        const dropdownX = 280;
        
        // Dropdown box - simplified and more modern
        const dropdownBg = this.add.graphics();
        dropdownBg.fillStyle(0x000000, 0.2);
        dropdownBg.fillRect(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2, dropdownWidth, dropdownHeight);
        dropdownBg.lineStyle(2, '#3CEFFF', 1);
        dropdownBg.strokeRect(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2, dropdownWidth, dropdownHeight);

        // Add subtle highlight to top and left edges for pixel art effect
        const dropdownHighlight = this.add.graphics();
        dropdownHighlight.lineStyle(1, '#FFFFFF', 0.3);
        dropdownHighlight.beginPath();
        dropdownHighlight.moveTo(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2);
        dropdownHighlight.lineTo(dropdownX + dropdownWidth/2, difficultyY - dropdownHeight/2);
        dropdownHighlight.moveTo(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2);
        dropdownHighlight.lineTo(dropdownX - dropdownWidth/2, difficultyY + dropdownHeight/2);
        dropdownHighlight.strokePath();

        // Dropdown text with better placement
        const dropdownText = this.add.text(dropdownX - dropdownWidth/2 + 15, difficultyY, this.difficultyOptions[this.currentDifficulty], {
            fontSize: '28px',
            fill: '#3CEFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);

        // Dropdown arrow with sharper pixel style
        const dropdownArrow = this.add.text(dropdownX + dropdownWidth/2 - 20, difficultyY, '▼', {
            fontSize: '18px',
            fill: '#3CEFFF',
            stroke: '#000000',
            strokeThickness: 3,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        // Make dropdown interactive with hover effects
        const dropdownArea = this.add.zone(dropdownX, difficultyY, dropdownWidth, dropdownHeight)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => {
                dropdownBg.clear();
                dropdownBg.fillStyle(0x000000, 0.3);
                dropdownBg.fillRect(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2, dropdownWidth, dropdownHeight);
                dropdownBg.lineStyle(2, '#3CEFFF', 1);
                dropdownBg.strokeRect(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2, dropdownWidth, dropdownHeight);
                dropdownArrow.setFill('#FFFFFF');
            })
            .on('pointerout', () => {
                dropdownBg.clear();
                dropdownBg.fillStyle(0x000000, 0.2);
                dropdownBg.fillRect(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2, dropdownWidth, dropdownHeight);
                dropdownBg.lineStyle(2, '#3CEFFF', 1);
                dropdownBg.strokeRect(dropdownX - dropdownWidth/2, difficultyY - dropdownHeight/2, dropdownWidth, dropdownHeight);
                dropdownArrow.setFill('#3CEFFF');
            })
            .on('pointerdown', () => {
                if (!this.isDropdownOpen) {
                    this.showDropdownOptions(dropdownX, difficultyY, dropdownWidth, dropdownHeight, dropdownText);
                }
            });

        // Version text
        this.add.text(gameWidth/2, gameHeight - 20, 'v1.0.0', {
            fontSize: '16px',
            fill: '#888888',
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);
    }

    showDropdownOptions(x, y, width, height, dropdownText) {
        this.isDropdownOpen = true;
        
        // Create container for options
        const optionsContainer = this.add.container(0, 0);
        
        // Add each option with improved styling
        this.difficultyOptions.forEach((option, index) => {
            const optionY = y + (index + 1) * height;
            
            // Option background - simplified design
            const optionBg = this.add.graphics();
            optionBg.fillStyle(0x000000, 0.2);
            optionBg.fillRect(x - width/2, optionY - height/2, width, height);
            
            if (index === this.currentDifficulty) {
                optionBg.lineStyle(2, '#3CEFFF', 1);
                optionBg.strokeRect(x - width/2, optionY - height/2, width, height);
            }
            
            // Add subtle highlight to selected option
            if (index === this.currentDifficulty) {
                const optionHighlight = this.add.graphics();
                optionHighlight.lineStyle(1, '#FFFFFF', 0.3);
                optionHighlight.beginPath();
                optionHighlight.moveTo(x - width/2, optionY - height/2);
                optionHighlight.lineTo(x + width/2, optionY - height/2);
                optionHighlight.moveTo(x - width/2, optionY - height/2);
                optionHighlight.lineTo(x - width/2, optionY + height/2);
                optionHighlight.strokePath();
                optionsContainer.add(optionHighlight);
            }
            
            // Option text with enhanced styling
            const optionText = this.add.text(x - width/2 + 15, optionY, option, {
                fontSize: '28px',
                fill: index === this.currentDifficulty ? '#3CEFFF' : '#888888',
                stroke: '#000000',
                strokeThickness: 5,
                fontFamily: '"Jersey 10", sans-serif'
            }).setOrigin(0, 0.5);
            
            // Make option interactive with enhanced effects
            const optionZone = this.add.zone(x, optionY, width, height)
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerover', () => {
                    optionBg.clear();
                    optionBg.fillStyle(0x000000, 0.3);
                    optionBg.fillRect(x - width/2, optionY - height/2, width, height);
                    
                    if (index === this.currentDifficulty) {
                        optionBg.lineStyle(2, '#3CEFFF', 1);
                        optionBg.strokeRect(x - width/2, optionY - height/2, width, height);
                    } else {
                        optionBg.lineStyle(2, '#3CEFFF', 0.7);
                        optionBg.strokeRect(x - width/2, optionY - height/2, width, height);
                        optionText.setFill('#FFFFFF');
                    }
                })
                .on('pointerout', () => {
                    optionBg.clear();
                    optionBg.fillStyle(0x000000, 0.2);
                    optionBg.fillRect(x - width/2, optionY - height/2, width, height);
                    
                    if (index === this.currentDifficulty) {
                        optionBg.lineStyle(2, '#3CEFFF', 1);
                        optionBg.strokeRect(x - width/2, optionY - height/2, width, height);
                    } else {
                        optionText.setFill('#888888');
                    }
                })
                .on('pointerdown', () => {
                    this.currentDifficulty = index;
                    dropdownText.setText(option);
                    localStorage.setItem('difficulty', index.toString());
                    optionsContainer.destroy();
                    this.isDropdownOpen = false;
                });
            
            optionsContainer.add([optionBg, optionText, optionZone]);
        });
        
        // Close dropdown when clicking outside
        this.input.once('pointerdown', (pointer) => {
            const bounds = new Phaser.Geom.Rectangle(
                x - width/2,
                y - height/2,
                width,
                height * (this.difficultyOptions.length + 1)
            );
            
            if (!Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
                optionsContainer.destroy();
                this.isDropdownOpen = false;
            }
        });
        
        // Add container to scene
        this.add.existing(optionsContainer);
    }
} 