# game-three-js

This project is built with Vite and using ThreeJS.

The game is optimized for desktop.

To run the project, clone it and install dependencies :

```bash
npm install
```

## Features

- Bonus (blue) increase score by 1
- Malus (red) decrease life by 1 (pushback airplane effect)
- Restart game option after loosing
- Life system (5 lifes when starting defined by heart model)
- Crash animation
- Particles effect on collision

Scene is composed of :
1. Sky (clouds, bird and a sun)
1. Airplane with pilot
1. Ground with rocks and trees

### Working on

- Leaderboard system

#### Upcoming

- Level system
- Show rules of the game for user
- Airplane controls with arrows/spacebar
- Wooden fences object always showed
- Biomes system
- End game
- Sounds effects

#### To improve
- Effect with text on bonus
- Stock email with backend server or webservice (ex: https://formspree.io/)

#### Known issues
- Disappearing objects on mobile
- Click button to play to big on mobile (not taking full width)
- Remove dezoom on mobile