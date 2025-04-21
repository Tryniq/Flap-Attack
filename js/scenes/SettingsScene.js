class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
        
        // Initialize settings with values from localStorage or defaults
        this.difficultyOptions = ['Easy', 'Normal', 'Hard'];
        this.currentDifficulty = localStorage.getItem('difficulty') || 'Normal';
        this.musicVolume = parseFloat(localStorage.getItem('musicVolume') || '0.5');
        this.music = null;
        
        // Reference to the dropdown component
        this.dropdownOptions = null;
        this.isDropdownOpen = false;
    }

    preload() {
        // Load background image
        this.load.image('menuBackground', 'assets/MenuImage1.png');
        
        // No longer loading these files as they don't exist
        // this.load.image('largeButton', 'assets/button-large.png');
        // this.load.image('smallButton', 'assets/button-small.png');
        // this.load.audio('testSound', 'assets/pop.mp3');
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
        
        // Get reference to the game music from the global storage
        if (this.sys.game.globals && this.sys.game.globals.music) {
            this.music = this.sys.game.globals.music;
        }
        
        // TITLE
        const title = this.add.text(gameWidth/2, 60, 'SETTINGS', {
            fontSize: '48px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        // Add a subtle animation to the title
        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // BACK BUTTON
        const backButton = this.add.text(80, 60, '< BACK', {
            fontSize: '32px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);
        
        backButton.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                backButton.setScale(1.1);
                backButton.setFill('#3CEFFF');
            })
            .on('pointerout', () => {
                backButton.setScale(1);
                backButton.setFill('#FFFFFF');
            })
            .on('pointerdown', () => {
                // Return to the home scene
                this.scene.start('HomeScene');
            });
            
        // SETTINGS CONTENT CONTAINER
        const settingsContainer = this.add.container(gameWidth/2, 150);
        settingsContainer.setSize(gameWidth - 100, gameHeight - 200);
        
        // Create a background for the settings area
        const settingsBg = this.add.graphics();
        settingsBg.fillStyle(0x000000, 0.3);
        settingsBg.fillRoundedRect(-settingsContainer.width/2, 0, settingsContainer.width, settingsContainer.height, 16);
        settingsBg.lineStyle(2, 0x3CEFFF, 0.3);
        settingsBg.strokeRoundedRect(-settingsContainer.width/2, 0, settingsContainer.width, settingsContainer.height, 16);
        settingsContainer.add(settingsBg);

        // SETTINGS CONTENT
        const settingsStartY = 35;
        const sectionSpacing = 100; // Consistent spacing between sections
        
        // DIFFICULTY SETTINGS
        this.add.text(80, settingsStartY, 'DIFFICULTY:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);
        
        // Improved dropdown for difficulty selection
        const dropdownWidth = 200;
        const dropdownHeight = 40;
        const dropdownX = 280;
        const dropdownY = settingsStartY;
        
        // Create dropdown box with background
        const dropdownBg = this.add.graphics();
        dropdownBg.fillStyle(0x222222, 0.8);
        dropdownBg.fillRoundedRect(dropdownX, dropdownY - dropdownHeight/2, dropdownWidth, dropdownHeight, 8);
        dropdownBg.lineStyle(2, 0x3CEFFF, 0.5);
        dropdownBg.strokeRoundedRect(dropdownX, dropdownY - dropdownHeight/2, dropdownWidth, dropdownHeight, 8);
        
        // Create dropdown text
        const dropdownText = this.add.text(dropdownX + 15, dropdownY, this.currentDifficulty, {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);
        
        // Create dropdown arrow
        const arrowX = dropdownX + dropdownWidth - 25;
        const arrowY = dropdownY;
        const dropdownArrow = this.add.text(arrowX, arrowY, '▼', {
            fontSize: '16px',
            fill: '#3CEFFF'
        }).setOrigin(0.5);
        
        // Make the dropdown interactive
        const dropdownHitArea = this.add.zone(dropdownX + dropdownWidth/2, dropdownY, dropdownWidth, dropdownHeight)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                dropdownBg.clear();
                dropdownBg.fillStyle(0x333333, 0.8);
                dropdownBg.fillRoundedRect(dropdownX, dropdownY - dropdownHeight/2, dropdownWidth, dropdownHeight, 8);
                dropdownBg.lineStyle(2, 0x3CEFFF, 0.8);
                dropdownBg.strokeRoundedRect(dropdownX, dropdownY - dropdownHeight/2, dropdownWidth, dropdownHeight, 8);
                dropdownArrow.setFill('#FFFFFF');
            })
            .on('pointerout', () => {
                dropdownBg.clear();
                dropdownBg.fillStyle(0x222222, 0.8);
                dropdownBg.fillRoundedRect(dropdownX, dropdownY - dropdownHeight/2, dropdownWidth, dropdownHeight, 8);
                dropdownBg.lineStyle(2, 0x3CEFFF, 0.5);
                dropdownBg.strokeRoundedRect(dropdownX, dropdownY - dropdownHeight/2, dropdownWidth, dropdownHeight, 8);
                dropdownArrow.setFill('#3CEFFF');
            })
            .on('pointerdown', () => {
                this.toggleDropdown(dropdownX, dropdownY + dropdownHeight/2, dropdownWidth, dropdownHeight, dropdownText);
            });
            
        // Section divider
        const divider1 = this.add.graphics();
        divider1.lineStyle(2, 0x3CEFFF, 0.3);
        divider1.lineTo(settingsContainer.width - 80, 0);
        divider1.x = 40;
        divider1.y = settingsStartY + 50;
        settingsContainer.add(divider1);

        // SOUND SETTINGS
        const soundY = settingsStartY + sectionSpacing;
        this.add.text(80, soundY, 'SOUND:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);

        const soundOnText = this.add.text(220, soundY, 'ON', {
            fontSize: '28px',
            fill: localStorage.getItem('sound') === '0' || localStorage.getItem('sound') === null ? '#3CEFFF' : '#888888',
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

        soundOnText.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                if (localStorage.getItem('sound') !== '0' && localStorage.getItem('sound') !== null) {
                    soundOnText.setFill('#FFFFFF');
                }
            })
            .on('pointerout', () => {
                if (localStorage.getItem('sound') !== '0' && localStorage.getItem('sound') !== null) {
                    soundOnText.setFill('#888888');
                }
            })
            .on('pointerdown', () => {
                // Resume audio context on interaction
                this.resumeAudioContext();
                
                soundOnText.setFill('#3CEFFF');
                soundOffText.setFill('#888888');
                localStorage.setItem('sound', '0');
                
                // Use existing game music instead of test sound
                if (this.music) {
                    // Just set volume temporarily to indicate sound works
                    const originalVolume = this.music.volume;
                    this.music.setVolume(0.2);
                    this.time.delayedCall(300, () => {
                        this.music.setVolume(originalVolume);
                    });
                }
            });

        soundOffText.setInteractive({ useHandCursor: true })
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
                // Resume audio context on interaction
                this.resumeAudioContext();
                
                soundOnText.setFill('#888888');
                soundOffText.setFill('#3CEFFF');
                localStorage.setItem('sound', '1');
            });

        // Section divider
        const divider2 = this.add.graphics();
        divider2.lineStyle(2, 0x3CEFFF, 0.3);
        divider2.lineTo(settingsContainer.width - 80, 0);
        divider2.x = 40;
        divider2.y = soundY + 50;
        settingsContainer.add(divider2);

        // MUSIC SETTINGS
        const musicY = soundY + sectionSpacing;
        this.add.text(80, musicY, 'MUSIC:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);

        const musicOnText = this.add.text(220, musicY, 'ON', {
            fontSize: '28px',
            fill: localStorage.getItem('music') === '0' || localStorage.getItem('music') === null ? '#3CEFFF' : '#888888',
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

        musicOnText.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                if (localStorage.getItem('music') !== '0' && localStorage.getItem('music') !== null) {
                    musicOnText.setFill('#FFFFFF');
                }
            })
            .on('pointerout', () => {
                if (localStorage.getItem('music') !== '0' && localStorage.getItem('music') !== null) {
                    musicOnText.setFill('#888888');
                }
            })
            .on('pointerdown', () => {
                // Resume audio context on interaction
                this.resumeAudioContext();
                
                musicOnText.setFill('#3CEFFF');
                musicOffText.setFill('#888888');
                localStorage.setItem('music', '0');
                
                // Play music if it's not already playing
                if (this.music && !this.music.isPlaying) {
                    this.music.play();
                }
            });

        musicOffText.setInteractive({ useHandCursor: true })
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
                // Resume audio context on interaction
                this.resumeAudioContext();
                
                musicOnText.setFill('#888888');
                musicOffText.setFill('#3CEFFF');
                localStorage.setItem('music', '1');
                
                // Stop music if it's currently playing
                if (this.music && this.music.isPlaying) {
                    this.music.stop();
                }
            });

        // VOLUME SLIDER
        const volumeY = musicY + 60;
        this.add.text(80, volumeY, 'VOLUME:', {
            fontSize: '28px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);
        
        // Create custom slider bar that looks more professional
        const sliderWidth = 200;
        const sliderHeight = 10;
        const sliderX = 220;
        
        // Background bar
        const sliderBackground = this.add.graphics();
        sliderBackground.fillStyle(0x333333, 0.5);
        sliderBackground.fillRoundedRect(sliderX, volumeY - sliderHeight/2, sliderWidth, sliderHeight, 5);
        sliderBackground.lineStyle(1, 0x3CEFFF, 0.3);
        sliderBackground.strokeRoundedRect(sliderX, volumeY - sliderHeight/2, sliderWidth, sliderHeight, 5);
        
        // Filled portion based on current volume
        const filledWidth = sliderWidth * this.musicVolume;
        const filledBar = this.add.graphics();
        filledBar.fillStyle(0x3CEFFF, 0.7);
        filledBar.fillRoundedRect(sliderX, volumeY - sliderHeight/2, filledWidth, sliderHeight, 5);
        
        // Slider knob - improved design
        const knobWidth = 16;
        const knobHeight = 24;
        let knobX = sliderX + filledWidth;
        
        const sliderKnob = this.add.graphics();
        sliderKnob.fillStyle(0x3CEFFF, 1);
        sliderKnob.fillRoundedRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
        sliderKnob.lineStyle(2, 0xFFFFFF, 0.8);
        sliderKnob.strokeRoundedRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
        
        // Create interactive zone for the entire slider
        const sliderZone = this.add.zone(sliderX + sliderWidth/2, volumeY, sliderWidth + knobWidth, knobHeight + 10)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true });
            
        // Make the entire slider clickable for easier interaction
        sliderZone.on('pointerdown', (pointer) => {
            // Calculate new volume based on click position
            let clickX = Phaser.Math.Clamp(pointer.x, sliderX, sliderX + sliderWidth);
            let newVolume = (clickX - sliderX) / sliderWidth;
            
            // Update volume
            this.musicVolume = newVolume;
            if (this.music) {
                this.music.volume = newVolume;
            }
            localStorage.setItem('musicVolume', newVolume.toString());
            
            // Update visuals
            updateSliderVisuals(newVolume);
        });
        
        // Make knob draggable
        let isDragging = false;
        
        // Create an invisible interactive area around the knob
        const knobZone = this.add.zone(knobX, volumeY, knobWidth + 20, knobHeight + 10)
            .setOrigin(0.5, 0.5)
            .setInteractive({ useHandCursor: true, draggable: true });
            
        knobZone.on('pointerover', () => {
            sliderKnob.clear();
            sliderKnob.fillStyle(0x60FFFF, 1); // Brighter color on hover
            sliderKnob.fillRoundedRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
            sliderKnob.lineStyle(2, 0xFFFFFF, 1);
            sliderKnob.strokeRoundedRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
        });
        
        knobZone.on('pointerout', () => {
            if (!isDragging) {
                sliderKnob.clear();
                sliderKnob.fillStyle(0x3CEFFF, 1);
                sliderKnob.fillRoundedRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
                sliderKnob.lineStyle(2, 0xFFFFFF, 0.8);
                sliderKnob.strokeRoundedRect(knobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
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
            if (this.music) {
                this.music.volume = newVolume;
            }
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
            sliderKnob.clear();
            sliderKnob.fillStyle(isDragging ? 0x60FFFF : 0x3CEFFF, 1);
            sliderKnob.fillRoundedRect(newKnobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
            sliderKnob.lineStyle(2, 0xFFFFFF, isDragging ? 1 : 0.8);
            sliderKnob.strokeRoundedRect(newKnobX - knobWidth/2, volumeY - knobHeight/2, knobWidth, knobHeight, 6);
            
            // Update filled bar
            filledBar.clear();
            filledBar.fillStyle(0x3CEFFF, 0.7);
            filledBar.fillRoundedRect(sliderX, volumeY - sliderHeight/2, newKnobX - sliderX, sliderHeight, 5);
        };
        
        // Add volume percentage display
        const volumePercentText = this.add.text(sliderX + sliderWidth + 20, volumeY, `${Math.round(this.musicVolume * 100)}%`, {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0, 0.5);
        
        // Update the percentage text when the volume changes
        this.events.on('volume-changed', (volume) => {
            volumePercentText.setText(`${Math.round(volume * 100)}%`);
        });
    }

    toggleDropdown(x, y, width, height, dropdownText) {
        // If dropdown is already open, close it
        if (this.isDropdownOpen) {
            if (this.dropdownOptions) {
                this.dropdownOptions.destroy();
                this.dropdownOptions = null;
            }
            this.isDropdownOpen = false;
            return;
        }
        
        this.isDropdownOpen = true;
        this.showDropdownOptions(x, y, width, height, dropdownText);
    }

    showDropdownOptions(x, y, width, height, dropdownText) {
        // Create a container for the dropdown options
        this.dropdownOptions = this.add.container(0, 0);
        
        // Calculate dimensions
        const numOptions = this.difficultyOptions.length;
        const optionHeight = height;
        const totalHeight = numOptions * optionHeight;
        
        // Background for options
        const optionsBg = this.add.graphics();
        optionsBg.fillStyle(0x222222, 0.9);
        optionsBg.fillRoundedRect(x, y, width, totalHeight, 8);
        optionsBg.lineStyle(2, 0x3CEFFF, 0.5);
        optionsBg.strokeRoundedRect(x, y, width, totalHeight, 8);
        this.dropdownOptions.add(optionsBg);
        
        // Add the options
        this.difficultyOptions.forEach((option, index) => {
            const isSelected = option === this.currentDifficulty;
            const yPos = y + (index * optionHeight) + optionHeight/2;
            
            // Option background on hover
            const optionBg = this.add.graphics();
            
            // Option text with appropriate styling
            const optionText = this.add.text(x + 15, yPos, option, {
                fontSize: '24px',
                fill: isSelected ? '#3CEFFF' : '#FFFFFF',
                fontFamily: '"Jersey 10", sans-serif'
            }).setOrigin(0, 0.5);
            
            // Add checkmark for selected option
            let checkmark = null;
            if (isSelected) {
                checkmark = this.add.text(x + width - 30, yPos, '✓', {
                    fontSize: '24px',
                    fill: '#3CEFFF',
                    fontFamily: '"Jersey 10", sans-serif'
                }).setOrigin(0, 0.5);
                this.dropdownOptions.add(checkmark);
            }
            
            // Add interaction zone
            const optionZone = this.add.zone(x + width/2, yPos, width, optionHeight)
                .setOrigin(0.5, 0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', () => {
                    optionBg.clear();
                    optionBg.fillStyle(0x3CEFFF, 0.2);
                    optionBg.fillRect(x, yPos - optionHeight/2, width, optionHeight);
                    optionText.setFill(isSelected ? '#3CEFFF' : '#FFFFFF');
                })
                .on('pointerout', () => {
                    optionBg.clear();
                    optionText.setFill(isSelected ? '#3CEFFF' : '#FFFFFF');
                })
                .on('pointerdown', () => {
                    // Update difficulty setting
                    this.selectDifficulty(index, dropdownText);
                });
                
            this.dropdownOptions.add(optionBg);
            this.dropdownOptions.add(optionText);
            this.dropdownOptions.add(optionZone);
        });
        
        // Add global click listener to close dropdown when clicking outside
        const closeDropdownListener = () => {
            if (this.isDropdownOpen) {
                this.toggleDropdown(x, y, width, height, dropdownText);
                this.input.off('pointerdown', closeDropdownListener);
            }
        };
        
        // Add small delay before enabling the global click listener
        this.time.delayedCall(200, () => {
            this.input.on('pointerdown', closeDropdownListener);
        });
    }
    
    selectDifficulty(index, headerText) {
        // Update current difficulty
        this.currentDifficulty = this.difficultyOptions[index];
        
        // Update dropdown header text
        headerText.setText(this.currentDifficulty);
        
        // Save setting to localStorage
        localStorage.setItem('difficulty', this.currentDifficulty);
        
        // Close the dropdown
        if (this.dropdownOptions) {
            this.dropdownOptions.destroy();
            this.dropdownOptions = null;
        }
        this.isDropdownOpen = false;
        
        // Update game settings if needed
        const settings = {
            difficulty: this.currentDifficulty,
            sound: localStorage.getItem('sound') || '0',
            music: localStorage.getItem('music') || '0',
            musicVolume: this.musicVolume
        };
        
        // Emit settings updated event
        this.game.events.emit('settingsUpdated', settings);
    }
    
    resumeAudioContext() {
        // Resume the audio context if it's suspended
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
    }
} 