class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Load saved settings or use defaults
        this.settings = this.loadSettings();

        // Create background
        this.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000).setOrigin(0);

        // Create settings container with padding
        this.settingsContainer = this.add.container(gameWidth/2, 40);

        // Add title
        const titleText = this.add.text(0, 0, 'SETTINGS', {
            fontSize: '36px',
            fill: '#fff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        this.settingsContainer.add(titleText);

        // Settings groups
        const groups = [
            {
                title: 'Sound',
                settings: [
                    { key: 'musicVolume', text: 'Music', type: 'slider', min: 0, max: 100, value: this.settings.musicVolume },
                    { key: 'sfxVolume', text: 'SFX', type: 'slider', min: 0, max: 100, value: this.settings.sfxVolume }
                ]
            },
            {
                title: 'Gameplay',
                settings: [
                    { key: 'difficulty', text: 'Difficulty', type: 'select', options: ['Easy', 'Normal', 'Hard'], value: this.settings.difficulty },
                    { key: 'pipeSpeed', text: 'Speed', type: 'slider', min: 50, max: 200, value: this.settings.pipeSpeed },
                    { key: 'gapSize', text: 'Gap Size', type: 'slider', min: 100, max: 200, value: this.settings.gapSize }
                ]
            },
            {
                title: 'Debug',
                settings: [
                    { key: 'showTrail', text: 'Show Trail', type: 'toggle', value: this.settings.showTrail },
                    { key: 'screenShake', text: 'Screen Shake', type: 'toggle', value: this.settings.screenShake }
                ]
            }
        ];

        let yOffset = 60;
        groups.forEach(group => {
            // Add group title with padding
            const groupTitle = this.add.text(0, yOffset, group.title, {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            this.settingsContainer.add(groupTitle);
            yOffset += 40;

            // Add settings for this group
            group.settings.forEach(setting => {
                this.createSettingControl(setting, 0, yOffset);
                yOffset += 50;
            });

            yOffset += 20; // Increased space between groups
        });

        // Add back button with proper padding
        const backButton = this.add.text(gameWidth/2, gameHeight - 60, 'Back', {
            fontSize: '28px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: 'Arial Black'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => backButton.setScale(1.1))
        .on('pointerout', () => backButton.setScale(1))
        .on('pointerdown', () => {
            this.saveSettings();
            // Check if GameScene is paused, if so return there
            if (this.scene.isPaused('GameScene')) {
                this.scene.resume('GameScene');
                this.scene.stop();
            } else {
                this.scene.start('HomeScene');
            }
        });
    }

    createSettingControl(setting, x, y) {
        const labelStyle = {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial'
        };

        // Add label
        const label = this.add.text(-120, y, setting.text, labelStyle).setOrigin(0, 0.5);
        this.settingsContainer.add(label);

        switch (setting.type) {
            case 'slider':
                this.createSlider(setting, x, y);
                break;
            case 'toggle':
                this.createToggle(setting, x, y);
                break;
            case 'select':
                this.createSelect(setting, x, y);
                break;
        }
    }

    createSlider(setting, x, y) {
        const width = 160;
        const height = 8;

        // Create slider background
        const background = this.add.rectangle(x + 30, y, width, height, 0x666666).setOrigin(0, 0.5);
        
        // Create slider handle
        const handle = this.add.rectangle(
            x + 30 + (setting.value - setting.min) / (setting.max - setting.min) * width,
            y,
            16,
            16,
            0x00ff00
        ).setOrigin(0.5);
        
        handle.setInteractive({ draggable: true });
        
        // Add value text
        const valueText = this.add.text(x + width + 45, y, setting.value.toString(), {
            fontSize: '18px',
            fill: '#fff'
        }).setOrigin(0, 0.5);

        this.settingsContainer.add([background, handle, valueText]);

        handle.on('drag', (pointer, dragX) => {
            const minX = x + 30;
            const maxX = minX + width;
            handle.x = Phaser.Math.Clamp(dragX, minX, maxX);
            
            const value = Math.round(
                setting.min + (handle.x - minX) / width * (setting.max - setting.min)
            );
            this.settings[setting.key] = value;
            valueText.setText(value.toString());
        });
    }

    createToggle(setting, x, y) {
        const width = 50;
        const height = 26;
        
        // Create toggle background
        const background = this.add.rectangle(x + 30, y, width, height, 0x666666)
            .setOrigin(0, 0.5)
            .setInteractive({ useHandCursor: true });
        
        // Create toggle handle
        const handle = this.add.rectangle(
            x + 30 + (setting.value ? width - height/2 : height/2),
            y,
            height - 4,
            height - 4,
            setting.value ? 0x00ff00 : 0xffffff
        ).setOrigin(0.5);

        this.settingsContainer.add([background, handle]);

        background.on('pointerdown', () => {
            this.settings[setting.key] = !this.settings[setting.key];
            handle.x = x + 30 + (this.settings[setting.key] ? width - height/2 : height/2);
            handle.setFillStyle(this.settings[setting.key] ? 0x00ff00 : 0xffffff);
        });
    }

    createSelect(setting, x, y) {
        const optionStyle = {
            fontSize: '18px',
            fill: '#fff',
            fontFamily: 'Arial'
        };

        let currentIndex = setting.options.indexOf(setting.value);
        const optionText = this.add.text(x + 30, y, setting.value, optionStyle).setOrigin(0, 0.5);
        
        // Add arrows
        const leftArrow = this.add.text(x + 10, y, '<', optionStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        
        const rightArrow = this.add.text(x + 120, y, '>', optionStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.settingsContainer.add([optionText, leftArrow, rightArrow]);

        leftArrow.on('pointerdown', () => {
            currentIndex = (currentIndex - 1 + setting.options.length) % setting.options.length;
            this.settings[setting.key] = setting.options[currentIndex];
            optionText.setText(setting.options[currentIndex]);
        });

        rightArrow.on('pointerdown', () => {
            currentIndex = (currentIndex + 1) % setting.options.length;
            this.settings[setting.key] = setting.options[currentIndex];
            optionText.setText(setting.options[currentIndex]);
        });
    }

    loadSettings() {
        const defaultSettings = {
            musicVolume: 70,
            sfxVolume: 80,
            difficulty: 'Normal',
            pipeSpeed: 100,
            gapSize: 150,
            showTrail: true,
            screenShake: true
        };

        const savedSettings = localStorage.getItem('flappyBirdSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('flappyBirdSettings', JSON.stringify(this.settings));
        
        // Safely emit settings updated event
        // This prevents errors when GameScene isn't running
        if (this.game && this.game.events) {
            const gameScene = this.scene.get('GameScene');
            if (gameScene && gameScene.scene.isActive()) {
                this.game.events.emit('settingsUpdated', this.settings);
            }
        }
    }
} 