# Flappy Bird Clone - Game Plan

## Core Components

### 1. Bird (Player Character)
- Single sprite with flapping animation
- Vertical movement only
- Physics:
  - Constant downward gravity
  - Upward boost when spacebar pressed
  - Smooth acceleration/deceleration

### 2. Obstacles (Pipes)
- Top and bottom pipe pairs
- Move left at constant speed
- Random heights (but consistent gap size)
- Spawn system:
  - Create new pipes at regular intervals
  - Remove pipes when off-screen
  - Maintain proper spacing

### 3. Scoring System
- Variable to track current score
- Score increases when passing pipes
- Display score prominently
- Store and display high score
- Clear visual/audio feedback when scoring

### 4. Game States
1. Start Screen
   - Game title
   - "Press Space to Start"
   - Basic instructions
2. Playing State
   - Active gameplay
   - Score display
3. Game Over Screen
   - Final score
   - High score
   - "Press Space to Restart"

## Technical Implementation (Scratch)

### Bird Controls
```
When game starts:
- Set initial position
- Reset gravity
- Wait for spacebar

During gameplay:
- Apply constant gravity
- On spacebar: Apply upward force
- Animate sprite (switch costumes)
```

### Pipe System
```
When game starts:
- Set initial pipe positions
- Start movement loop

Pipe generation:
- Clone pipes at intervals
- Randomize gap position
- Move left continuously
- Delete when off-screen
```

### Collision Detection
```
Check continuously for:
- Bird hitting pipes
- Bird hitting ground
- Bird hitting ceiling
```

### Scoring Logic
```
When bird passes pipes:
- Increment score
- Update display
- Play success sound
- Check/update high score
```

## Development Phases

1. **Setup Phase**
   - Create bird sprite and animations
   - Set up basic controls
   - Test gravity and jump mechanics

2. **Obstacle Phase**
   - Create pipe sprites
   - Implement pipe movement
   - Set up spawning system

3. **Game Logic Phase**
   - Add collision detection
   - Implement scoring system
   - Create game states

4. **Polish Phase**
   - Add sounds
   - Improve visuals
   - Add particle effects
   - Fine-tune difficulty

## Controls
- Spacebar: Flap/Jump
- Automatic horizontal movement
- Single button gameplay 