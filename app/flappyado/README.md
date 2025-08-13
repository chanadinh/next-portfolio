# 🎮 Flappy Ado - A Flappy Bird Style Game

A fun, interactive Flappy Bird-style game featuring the Ado character as the player avatar.

## 🎮 How to Play

### Controls
- **SPACEBAR** - Flap wings to fly upward
- **MOUSE CLICK** - Alternative way to flap wings
- **TOUCH** - Works on mobile devices

### Objective
Guide the Ado character through the green pipes without hitting them or the ground. Each pipe you successfully pass gives you 1 point.

### Game Mechanics
- **Gravity**: The strawberry constantly falls downward
- **Flapping**: Press spacebar or click to flap wings and gain upward velocity
- **Pipe Movement**: Pipes move from right to left continuously
- **Collision Detection**: Game ends if you hit a pipe or the ground
- **Scoring**: Score increases for each pipe passed

## ✨ Features

### Visual Elements
- **Ado Character**: The Ado character from ado.png as the player avatar
- **Dynamic Background**: Sky gradient with moving clouds
- **Animated Pipes**: Green pipes with gradient effects and highlights
- **Ground Details**: Brown ground with animated grass patterns
- **Particle Effects**: Golden particles when flapping, scoring, and colliding

### Audio Effects
- **Flap Sound**: Square wave sound when flapping wings
- **Score Sound**: Triangle wave sound that increases in pitch with score
- **Crash Sound**: Sawtooth wave sound when hitting obstacles
- **Start Sound**: Sine wave sound when starting the game
- **High Score Sound**: Celebration sound for new high scores

### Game States
- **Start Screen**: Beautiful animated start screen with instructions
- **Gameplay**: Smooth 60fps gameplay with physics
- **Game Over**: Score display with restart and return options
- **High Score Tracking**: Persistent high score storage

## 🛠️ Technical Details

### Built With
- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Canvas API** - 2D graphics rendering
- **Framer Motion** - Smooth animations
- **Web Audio API** - Sound effects generation

### Game Physics
- **Gravity**: 0.6 units per frame
- **Flap Force**: -12 units upward velocity
- **Pipe Speed**: 2 units per frame leftward
- **Pipe Spawn Rate**: Every 150 frames
- **Pipe Gap**: 150 units between top and bottom pipes

### Performance
- **60 FPS Gameplay** - Smooth animation using requestAnimationFrame
- **Efficient Rendering** - Canvas-based graphics for optimal performance
- **Memory Management** - Automatic cleanup of particles and game objects
- **Responsive Design** - Adapts to different screen sizes

## 🎯 Game Tips

1. **Timing is Key**: Don't flap too frequently or too rarely
2. **Watch the Pipes**: Anticipate where you need to be
3. **Stay Centered**: Try to stay in the middle of the pipe gaps
4. **Practice Makes Perfect**: The more you play, the better you'll get
5. **Don't Panic**: Stay calm and time your flaps carefully

## 🚀 Getting Started

1. Navigate to `/flappyado` in your browser
2. Click "Start Game" or press any key
3. Use SPACEBAR or click to flap wings
4. Try to get the highest score possible!

## 🏆 Scoring System

- **1 Point** per pipe passed
- **High Score** is saved and displayed
- **Score Display** shows current score during gameplay
- **Progressive Difficulty** - Sound pitch increases with score

## 🎨 Customization

The game is easily customizable by modifying the `GAME_CONFIG` object:
- Adjust gravity, flap force, and pipe speeds
- Change colors and visual effects
- Modify sound frequencies and durations
- Add new particle effects and animations

## 🔧 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Touch controls for mobile devices
- **Audio Support**: Web Audio API for sound effects
- **Canvas Support**: 2D graphics rendering

---

**Have fun playing Flappy Ado!** 🎮✨

*Created with ❤️ using Next.js and modern web technologies*
