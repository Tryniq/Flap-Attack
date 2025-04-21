class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
        this.difficultyOptions = ['EASY', 'NORMAL', 'HARD'];
        this.currentDifficulty = 1; // Default to NORMAL
        this.isDropdownOpen = false;
    }

    preload() {
        // Load background image
        this.load.image('settingsBackground', 'assets/MenuImage1.png');
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Create background
        const background = this.add.image(gameWidth/2, gameHeight/2, 'settingsBackground');
        
        // Scale the background to cover the screen
        const scaleX = gameWidth / background.width;
        const scaleY = gameHeight / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        // Title
        this.add.text(gameWidth/2, gameHeight * 0.12, 'SETTINGS', {
            fontSize: '48px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);

        // Back button
        const backButton = this.add.text(50, 50, '< BACK', {
            fontSize: '28px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3,
            fontFamily: '"Jersey 10", sans-serif'
        })
        .setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => backButton.setScale(1.1))
        .on('pointerout', () => backButton.setScale(1))
        .on('pointerdown', () => this.scene.start('HomeScene'));

        // Move settings container more to the right to prevent label clipping
        const settingsContainer = this.add.container(gameWidth * 0.7, gameHeight * 0.32);

        // Settings content - removed difficulty as it's handled separately
        const settingsContent = [
            { label: 'SOUND:', options: ['ON', 'OFF'], current: 0 },
            { label: 'MUSIC:', options: ['ON', 'OFF'], current: 0 }
        ];

        // Adjusted vertical spacing
        const rowSpacing = 95; // Increased from 80 to 95
        
        // Calculate display positions
        settingsContent.forEach((setting, index) => {
            const yOffset = index * rowSpacing;
            
            // Adjust label position to be more to the left and consistent
            const label = this.add.text(-150, yOffset, setting.label, {
                fontSize: '32px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 2,
                fontFamily: '"Jersey 10", sans-serif'
            }).setOrigin(1, 0.5);
            
            settingsContainer.add(label);
            
            // Options positioned directly after the label
            const optionsContainer = this.add.container(10, yOffset);
            
            // Fixed spacing between options
            let xOffset = 0;
            
            setting.options.forEach((option, optIndex) => {
                const optStyle = {
                    fontSize: '28px',
                    fill: optIndex === setting.current ? '#3CEFFF' : '#aaa',
                    fontFamily: '"Jersey 10", sans-serif',
                    stroke: optIndex === setting.current ? '#000' : null,
                    strokeThickness: optIndex === setting.current ? 1 : 0
                };
                
                const optText = this.add.text(xOffset, 0, option, optStyle)
                    .setOrigin(0, 0.5)
                    .setInteractive({ useHandCursor: true })
                    .on('pointerover', () => {
                        if (optIndex !== setting.current) {
                            optText.setFill('#fff');
                        }
                    })
                    .on('pointerout', () => {
                        if (optIndex !== setting.current) {
                            optText.setFill('#aaa');
                        }
                    })
                    .on('pointerdown', () => {
                        // Reset all options to gray
                        optionsContainer.list.forEach(opt => {
                            opt.setFill('#aaa');
                            opt.setStroke(null);
                            opt.setStrokeThickness(0);
                        });
                        
                        // Set selected option to blue
                        optText.setFill('#3CEFFF');
                        optText.setStroke('#000');
                        optText.setStrokeThickness(1);
                        
                        // Update current selection
                        setting.current = optIndex;
                    });
                
                optionsContainer.add(optText);
                // Fixed spacing of 25px between options
                xOffset += optText.width + 25;
            });
            
            settingsContainer.add(optionsContainer);
        });

        // Create difficulty dropdown with consistent positioning
        this.createDifficultyDropdown(settingsContainer, rowSpacing * 2);

        // Add visual dividers between options with appropriate width
        for (let i = 0; i < 2; i++) {
            const divider = this.add.graphics();
            divider.lineStyle(2, 0x3CEFFF, 0.3);
            divider.beginPath();
            divider.moveTo(-150, i * rowSpacing + rowSpacing/2); // Adjusted width
            divider.lineTo(200, i * rowSpacing + rowSpacing/2);  // Adjusted width
            divider.closePath();
            divider.strokePath();
            
            settingsContainer.add(divider);
        }

        // Add version text - moved slightly higher
        this.add.text(gameWidth/2, gameHeight - 30, 'v1.0.0', {
            fontSize: '18px',
            fill: '#666',
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(0.5);
    }

    createDifficultyDropdown(container, yPosition) {
        // Match the label position with other labels
        const diffLabel = this.add.text(-150, yPosition, 'DIFFICULTY:', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2,
            fontFamily: '"Jersey 10", sans-serif'
        }).setOrigin(1, 0.5);
        
        container.add(diffLabel);

        // Align with other options
        const dropdownContainer = this.add.container(10, yPosition);
        container.add(dropdownContainer);

        // Create dropdown header
        const selectedOption = this.difficultyOptions[this.currentDifficulty];
        const dropdownHeader = this.add.container(0, 0);
        
        // Adjusted width to better match spacing
        const dropdownWidth = 100;
        
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x000000, 0.3);
        headerBg.fillRect(-10, -18, dropdownWidth, 36);
        headerBg.lineStyle(2, 0x3CEFFF, 0.7);
        headerBg.strokeRect(-10, -18, dropdownWidth, 36);
        
        const headerText = this.add.text(0, 0, selectedOption, {
            fontSize: '28px',
            fill: '#3CEFFF',
            fontFamily: '"Jersey 10", sans-serif',
            stroke: '#000',
            strokeThickness: 1
        }).setOrigin(0, 0.5);
        
        const arrow = this.add.text(dropdownWidth - 20, 0, '▼', {
            fontSize: '16px',
            fill: '#3CEFFF'
        }).setOrigin(0.5);
        
        dropdownHeader.add([headerBg, headerText, arrow]);
        dropdownHeader.setInteractive(new Phaser.Geom.Rectangle(-10, -18, dropdownWidth, 36), Phaser.Geom.Rectangle.Contains)
            .on('pointerover', () => dropdownHeader.setScale(1.05))
            .on('pointerout', () => dropdownHeader.setScale(1))
            .on('pointerdown', () => this.toggleDropdown());
            
        dropdownContainer.add(dropdownHeader);
        
        // Dropdown options container
        this.dropdownOptions = this.add.container(0, 22);
        this.dropdownOptions.visible = false;
        dropdownContainer.add(this.dropdownOptions);
        
        // Update dropdown options sizing to match
        this.difficultyOptions.forEach((option, index) => {
            const optionContainer = this.add.container(0, index * 36);
            
            const optionBg = this.add.graphics();
            optionBg.fillStyle(0x000000, 0.5);
            optionBg.fillRect(-10, -16, dropdownWidth, 32);
            if (index === this.currentDifficulty) {
                optionBg.lineStyle(2, 0x3CEFFF, 0.7);
                optionBg.strokeRect(-10, -16, dropdownWidth, 32);
            }
            
            const optionText = this.add.text(0, 0, option, {
                fontSize: '28px',
                fill: index === this.currentDifficulty ? '#3CEFFF' : '#aaa',
                fontFamily: '"Jersey 10", sans-serif'
            }).setOrigin(0, 0.5);
            
            optionContainer.add([optionBg, optionText]);
            optionContainer.setInteractive(new Phaser.Geom.Rectangle(-10, -16, dropdownWidth, 32), Phaser.Geom.Rectangle.Contains)
                .on('pointerover', () => {
                    if (index !== this.currentDifficulty) {
                        optionText.setFill('#fff');
                    }
                })
                .on('pointerout', () => {
                    if (index !== this.currentDifficulty) {
                        optionText.setFill('#aaa');
                    }
                })
                .on('pointerdown', () => {
                    this.selectDifficulty(index, headerText);
                });
                
            this.dropdownOptions.add(optionContainer);
        });
    }
    
    toggleDropdown() {
        // Simplified toggle approach
        this.isDropdownOpen = !this.isDropdownOpen;
        this.dropdownOptions.visible = this.isDropdownOpen;
    }
    
    selectDifficulty(index, headerText) {
        this.currentDifficulty = index;
        headerText.setText(this.difficultyOptions[index]);
        
        const dropdownWidth = 100;
        
        // Update option styling
        this.dropdownOptions.list.forEach((optContainer, i) => {
            const optText = optContainer.list[1];
            const optBg = optContainer.list[0];
            
            optText.setFill(i === index ? '#3CEFFF' : '#aaa');
            
            // Clear existing stroke
            optBg.clear();
            optBg.fillStyle(0x000000, 0.5);
            optBg.fillRect(-10, -16, dropdownWidth, 32);
            
            // Add stroke only to selected
            if (i === index) {
                optBg.lineStyle(2, 0x3CEFFF, 0.7);
                optBg.strokeRect(-10, -16, dropdownWidth, 32);
            }
        });
        
        // Close dropdown after selection
        this.toggleDropdown();
    }
} 