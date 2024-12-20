class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load all game assets
        this.loadAssets();
        // Load audio assets
        this.loadAudioAssets();

        this.createLoadingBar();
    }

    loadAudioAssets() {
        // Load local audio files
        const audioFiles = [
            { key: 'bgMusic', path: '/assets/audio/background.wav' },
            { key: 'buttonClick', path: '/assets/audio/mouse.wav' },
            { key: 'correct', path: '/assets/audio/correct.wav' },
            { key: 'wrong', path: '/assets/audio/wrong.wav' },
            { key: 'levelComplete', path: '/assets/audio/levelup.wav' },
            { key: 'pickup', path: '/assets/audio/pickup.wav' }
        ];

        audioFiles.forEach(audio => {
            this.load.audio(audio.key, audio.path);
        });
    }


    loadAssets() {
        // You can replace these placeholder images with real game assets
        const assets = [
            { key: 'background', url: '/assets/images/space3.png' },
            { key: 'bowl', url: '/assets/images/bowl.png' },
            { key: 'compartment-plate', url: '/assets/images/compartment.png' },
            { key: 'plate', url: '/assets/images/plate.png'},
            { key: 'avatar', url: '/assets/images/avatar.png' },
            { key: 'apple', url: 'https://labs.phaser.io/assets/sprites/apple.png' },
            { key: 'cherry', url: '/assets/images/Cherry.png' },
            { key: 'eggs', url: '/assets/images/Eggs.png' },
            { key: 'watermelon', url: '/assets/images/watermelon.png' },
            { key: 'potato', url: '/assets/images/potato.png' },
            { key: 'salad', url: '/assets/images/salad.png' },
            {key: 'grape', url: '/assets/images/grape.png'},
            { key: 'banana', url: '/assets/images/banana.png' },
            { key: 'pizza', url: '/assets/images/pizza.png' },
            { key: 'burger', url: '/assets/images/burger.png' },
            { key: 'cookie', url: '/assets/images/cookie.png' },
            { key: 'corn', url: '/assets/images/corn.png' },
            { key: 'noodle', url: '/assets/images/noodle.png' },
            { key: 'bringal', url: '/assets/images/bringal.png' },
            { key: 'burrito', url: '/assets/images/burrito.png' },
            { key: 'carrot', url: '/assets/images/carrot.png' },
            { key: 'button', url: 'https://labs.phaser.io/assets/sprites/button-bg.png' },
            { key: 'trophy', url: 'assets/images/trophy.png' }
        ];

        assets.forEach(asset => {
            this.load.image(asset.key, asset.url);
        });
    }

    createLoadingBar() {
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0x00ff00, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            this.scene.start('MenuScene');
        });
    }
}

// Add new PlayerNameScene
class PlayerNameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerNameScene' });
    }

    create() {
        this.add.image(400, 300, 'background');
        
        this.add.text(400, 200, 'Enter Your Name', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Create input field using DOM element
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('placeholder', 'Your name here');
        inputElement.style.padding = '8px';
        inputElement.style.width = '200px';
        inputElement.style.textAlign = 'center';
        inputElement.style.border = '2px solid #fff';
        inputElement.style.borderRadius = '8px';
        inputElement.style.backgroundColor = '#333';
        inputElement.style.color = '#fff';
        inputElement.style.fontSize = '16px';
        inputElement.style.outline = 'none';

        this.add.dom(400, 270, inputElement);

        // Add start button
        const startButton = this.add.image(400, 400, 'button')
            .setInteractive();
        
        this.add.text(400, 400, 'Start Game', {
            fontSize: '24px',
            fill: '#000'
        }).setOrigin(0.5);

        startButton.on('pointerup', async () => {
            const playerName = inputElement.value.trim();
            if (playerName) {
                try {
                    // Register/get player
                    const response = await fetch('http://localhost:3000/api/players', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: playerName })
                    });
                    
                    const player = await response.json();
                    
                    // Store player data
                    localStorage.setItem('playerName', player.name);
                    localStorage.setItem('playerLevel', player.level);
                    localStorage.setItem('totalScore', player.points);
                    
                    // Start game from player's current level
                    this.scene.start('GameScene', { level: player.level });
                } catch (error) {
                    console.error('Error saving player:', error);
                    // Show error message to player
                    this.add.text(400, 450, 'Error connecting to server', {
                        fontSize: '16px',
                        fill: '#ff0000'
                    }).setOrigin(0.5);
                }
            }
        });
    }
}

// Add new Options and Help scenes
class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }

    create() {
        this.add.image(400, 300, 'background');
        
        // Add title
        this.add.text(400, 100, 'Options', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Volume controls
        this.add.text(400, 200, 'Music Volume', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Create volume slider
        const volumeBar = this.add.rectangle(400, 250, 200, 20, 0x666666);
        const volumeSlider = this.add.rectangle(400, 250, 20, 30, 0x00ff00)
            .setInteractive({ draggable: true });

        volumeSlider.on('drag', (pointer, dragX) => {
            const boundedX = Phaser.Math.Clamp(dragX, volumeBar.x - 100, volumeBar.x + 100);
            volumeSlider.x = boundedX;
            const volume = (boundedX - (volumeBar.x - 100)) / 200;
            this.sound.volume = volume;
        });

        // Back button
        const backButton = this.add.image(400, 500, 'button')
            .setInteractive();
        this.add.text(400, 500, 'Back', {
            fontSize: '24px',
            fill: '#000'
        }).setOrigin(0.5);

        backButton.on('pointerup', () => {
            this.scene.start('MenuScene');
        });
    }
}

class HelpScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HelpScene' });
    }

    create() {
        this.add.image(400, 300, 'background');

        const instructions = [
            'StoryLine: There is a disease attacking a school hospital.',
            'How to Play:',
            '',
            '1. Drag healthy foods into the container',
            '2. Each healthy food gives positive points',
            '3. Avoid unhealthy foods (negative points)',
            '4. Complete each level by reaching the target score',
            '5. Container changes as you progress',
            '',
            'Trophies Earned:',
            'Level 1-3: Snack Knight Trophy',
            'Level 4-6: Salad King Trophy',
            'Level 7+: Special Platter',
            'Collect different trophies for each level!'
        ];

        instructions.forEach((text, index) => {
            this.add.text(390, 30 + (index * 30), text, {
                fontSize: '20px',
                fill: '#fff'
            }).setOrigin(0.5);
        });

        const backButton = this.add.image(400, 500, 'button')
            .setInteractive();
        this.add.text(400, 500, 'Back', {
            fontSize: '24px',
            fill: '#000'
        }).setOrigin(0.5);

        backButton.on('pointerup', () => {
            this.scene.start('MenuScene');
        });
    }
}

// Menu Scene code remains the same as before
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        const playerName = localStorage.getItem('playerName');
        
        // Add title text
        this.add.text(400, 160, 'HEG-Game', {
            fontSize: '32px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        
        this.add.text(630, 550, 'Created By: Suman', {
            fontSize: '30px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Create menu buttons
        const buttonData = [
            { text: 'Start Game', y: 250, scene: playerName ? 'GameScene': 'PlayerNameScene' },
            { text: 'Options', y: 320, scene: 'OptionsScene' },
            { text: 'Help', y: 390, scene: 'HelpScene' },
            { text: 'Leaderboard', y: 460, scene: 'LeaderboardScene' }
        ];

        buttonData.forEach(button => {
            const buttonSprite = this.add.image(400, button.y, 'button')
                .setInteractive();
            this.add.text(400, button.y, button.text, {
                fontSize: '24px',
                fill: '#000'
            }).setOrigin(0.5);

            buttonSprite.on('pointerup', () => {
                this.sound.play('buttonClick', { volume: 0.5 });
                this.scene.start(button.scene, button.data);
            });
        });

        // Start background music if it's not already playing
        if (!this.sound.get('bgMusic')) {
            const music = this.sound.add('bgMusic', {
                volume: 0.5,
                loop: true
            });
            music.play();
        }

        // Add mute button
        const muteButton = this.add.text(750, 50, '🔊', {
            fontSize: '32px',
            fill: '#fff'
        })
        .setInteractive()
        .setOrigin(0.5);

        muteButton.on('pointerup', () => {
            const isMuted = this.sound.mute = !this.sound.mute;
            muteButton.setText(isMuted ? '🔇' : '🔊');
            
            // Play click sound
            this.sound.play('buttonClick', { volume: 0.5 });
        });
        
         // Add avatar and name
         this.add.image(50, 540, 'avatar');
         this.add.text(90, 550, 'Player123', {
             fontSize: '16px',
             fill: '#fff'
         }).setOrigin(0, 0.5);
     
    }
}

// Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.selectedFoods = [];
    }

    init(data) {
        this.currentLevel = data.level ||parseInt(localStorage.getItem('playerLevel')) || 0;
        this.score = 0; // Reset score for each level
        this.totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
        this.playerName = localStorage.getItem('playerName') || 'Suman';
    }

    async updatePlayerData(){
        try{
            await fetch(`http://localhost:3000/api/players/${this.playerName}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    level: this.currentLevel,
                    points: this.totalScore
                })
            });
        }catch(error){
            console.error('Error updating player data:', error);
        }
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Add mute button
        const muteButton = this.add.text(750, 50, this.sound.mute ? '🔇' : '🔊', {
            fontSize: '32px',
            fill: '#fff'
        })
        .setInteractive()
        .setOrigin(0.5);

        muteButton.on('pointerup', () => {
            const isMuted = this.sound.mute = !this.sound.mute;
            muteButton.setText(isMuted ? '🔇' : '🔊');
            this.sound.play('buttonClick', { volume: 0.5 });
        });

        // Add UI elements
        this.createUI();
        
        // Add container and drop zone
        this.createContainer();
        
        // Add foods based on level
        this.createFoodItems();
        
        // Setup drag and drop with sounds
        this.setupDragDrop();
        
        // Add player avatar
        this.createPlayerAvatar();
    }

    createUI() {
        // Add score text
        this.scoreText = this.add.text(16, 16, 'Health Score: 0', {
            fontSize: '24px',
            fill: '#fff'
        });
        
        // Add level text
        this.add.text(16, 50, `Level ${this.currentLevel}`, {
            fontSize: '24px',
            fill: '#fff'
        });

        // Add target score text
        const requiredScore = this.getRequiredScore();
        this.add.text(16, 84, `Target Score: ${requiredScore}`, {
            fontSize: '24px',
            fill: '#fff'
        });
    }

    createContainer() {
        // Remove existing container if it exists
        if (this.container) {
            this.container.destroy();
        }

        const containerConfig = {
            0: { key: 'bowl', scale: 1 },
            4: { key: 'compartment-plate', scale: 1.2 },
            7: { key: 'plate', scale: 1.3 }
        };

        const config = Object.entries(containerConfig)
            .reverse()
            .find(([level]) => this.currentLevel >= parseInt(level))?.[1] || containerConfig[1];

        this.container = this.add.image(400, 490, config.key)
            .setScale(config.scale);
        
        // Create drop zone matching the container size
        const zone = this.add.zone(400, 500, 200, 100)
            .setRectangleDropZone(200, 100);
    }

    setupDragDrop() {
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0x00ff00);
            this.sound.play('pickup', { volume: 0.5 });
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            gameObject.clearTint();
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            this.handleFoodDrop(gameObject);
        });
    }

    createPlayerAvatar() {
        const avatar = this.add.image(50, 540, 'avatar').setInteractive();
        this.add.text(90, 550, this.playerName, {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0, 0.5);
        avatar.on('pointerup', () => {
            this.scene.start('MenuScene');
        })
    }

    getRequiredScore() {
        const requiredScores = {
            0: 5,
            1: 10,
            2: 10,
            3: 10,
            4: 30,
            5: 30,
            6: 30,
            7: 40,
            8: 40,
            9: 50,
            10: 50
        };
        return requiredScores[this.currentLevel] || 100;
    }

    getLevelFoods() {
        const foods = [
            { id: 'apple', name: 'Apple', points: 5 },
            { id: 'banana', name: 'Banana', points: 10 },
            { id: 'cookie', name: 'Cookie', points: -5 },
            { id: 'carrot', name: 'Carrot', points: 10 },
            { id: 'noodle', name: 'Noodle', points: -5 },
            { id: 'corn', name: 'Corn', points: 10 },
            { id: 'burrito', name: 'Burrito', points: -5 },
            { id: 'bringal', name: 'Bringal', points: 10 },
            { id: 'grape', name: 'Grape', points: 10 },
            { id: 'cherry', name: 'Cherry', points: 10 },
            { id: 'eggs', name: 'Eggs', points: 15 },
            { id: 'watermelon', name: 'Watermelon', points: 20 },
            { id: 'salad', name: 'Salad', points: 25 },
            { id: 'potato', name: 'Potato', points: 15 },
            { id: 'burger', name: 'Burger', points: -20 },
            { id: 'pizza', name: 'Pizza', points: -10 }
        ];
    
        const positiveFoods = foods.filter(food => food.points > 0);
        const negativeFoods = foods.filter(food => food.points < 0);
    
        if (this.currentLevel === 0) {
            // Level 0: Only one healthy food
            return [positiveFoods[0]]; // Apple
        } else if (this.currentLevel >= 1 && this.currentLevel <= 3) {
            // Levels 1-3: One positive and one negative food
            return [
                Phaser.Utils.Array.Shuffle(positiveFoods)[0],
                Phaser.Utils.Array.Shuffle(negativeFoods)[0]
            ];
        } else if (this.currentLevel >= 4 && this.currentLevel <= 6) {
            // Levels 4-6: 3 positive and 3 negative foods, randomized
            const randomPositive = Phaser.Utils.Array.Shuffle(positiveFoods).slice(0, 3);
            const randomNegative = Phaser.Utils.Array.Shuffle(negativeFoods).slice(0, 3);
            return Phaser.Utils.Array.Shuffle([...randomPositive, ...randomNegative]);
        } else if (this.currentLevel >= 7 && this.currentLevel <= 10) {
            // Levels 7-10: Higher points, more challenging
            const highPositiveFoods = positiveFoods.filter(food => food.points >= 15);
            const randomPositive = Phaser.Utils.Array.Shuffle(highPositiveFoods).slice(0, 3);
            const randomNegative = Phaser.Utils.Array.Shuffle(negativeFoods).slice(0, 3);
            return Phaser.Utils.Array.Shuffle([...randomPositive, ...randomNegative]);
        }
    
        // Default: return a random selection of 6 foods if level is undefined
        return Phaser.Utils.Array.Shuffle(foods).slice(0, 6);
    }
    

    createFoodItems() {
        const foods = this.getLevelFoods();
        const startX = 500 - (foods.length * 75);
        
        foods.forEach((food, index) => {
            const x = startX + (index * 130);
            const foodSprite = this.add.image(x, 200, food.id)
                .setInteractive()
                .setData('points', food.points);
            
            this.input.setDraggable(foodSprite);
            
            this.add.text(x, 260, food.name, {
                fontSize: '16px',
                fill: '#fff'
            }).setOrigin(0.5);
        });
    }

    handleFoodDrop(food) {
        const points = food.getData('points');
        this.score += points;
        this.totalScore += points;
        this.scoreText.setText(`Health Score: ${this.score}`);
        this.selectedFoods.push(food);
        localStorage.setItem('totalScore', this.totalScore.toString());

        // Play appropriate sound
        this.sound.play(points > 0 ? 'correct' : 'wrong', { volume: 0.5 });
        
        // Check level completion
        if (this.score >= this.getRequiredScore()) {
            const nextLevel = this.currentLevel + 1;
            localStorage.setItem('playerLevel', nextLevel.toString());
            this.updatePlayerData();

            this.sound.play('levelComplete', { volume: 0.7 });
            this.time.delayedCall(1000, () => {
                if(this.currentLevel >= 10){
                    this.scene.start('LeaderboardScene', {finalScore: this.totalScore});
                }else{
                this.scene.start('TrophyScene', {
                    message: this.currentLevel >= 10 ? 'Game Complete!' : 'Level Complete!',
                    nextLevel: this.currentLevel >= 10 ? null : this.currentLevel + 1,
                    score: this.score
                });
                }
            });
        }
    }
}

// New LeaderboardScene
class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
    }

    async displayLeaderboard() {
        try {
            const response = await fetch('http://localhost:3000/api/leaderboard');
            const leaders = await response.json();
            console.log(leaders);
            this.add.text(400, 100, 'Leaderboard', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);
            
            leaders.forEach((leader, index) => {
                this.add.text(400, 150 + (index * 30), 
                    `${index + 1}. ${leader.name} - ${"🏆".repeat(leader.level)}  - ${leader.points} Points`, {
                    fontSize: '25px',
                    fill: '#fff',
                    align: 'center',
                }).setOrigin(0.5);
            });
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        }
    }

    create() {
        this.add.image(400, 300, 'background');
        this.displayLeaderboard();

        const backButton = this.add.image(400, 500, 'button')
            .setInteractive();
        this.add.text(400, 500, 'Back', {
            fontSize: '24px',
            fill: '#000'
        }).setOrigin(0.5);

        backButton.on('pointerup', () => {
            this.scene.start('MenuScene');
        });
    }
}

// Trophy Scene
class TrophyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TrophyScene' });
    }

    init(data) {
        this.message = data.message;
        this.nextLevel = data.nextLevel;
        this.score = data.score;
        this.trophyName = this.getTrophyName(this.nextLevel - 1);
    }

    getTrophyName(level) {
        const trophyNames = {
            1: '2 More Levels to Go!',
            2: '1 more Level to Go!',
            3: 'Snack Knight Trophy',
            4: 'Snack Knight Champion',
            5: 'Snack Knight Champion',
            6: 'Snack Knight Champion',
            7:'Salad King Trophy',
            8: 'Salad King Trophy',
            9: 'Legendary Health Guru',
            10: 'Ultimate Food Hero'
        };
        return trophyNames[level] || 'Champion Trophy';
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');

        // Add mute button
        const muteButton = this.add.text(750, 50, this.sound.mute ? '🔇' : '🔊', {
            fontSize: '32px',
            fill: '#fff'
        })
        .setInteractive()
        .setOrigin(0.5);

        muteButton.on('pointerup', () => {
            const isMuted = this.sound.mute = !this.sound.mute;
            muteButton.setText(isMuted ? '🔇' : '🔊');
            this.sound.play('buttonClick', { volume: 0.5 });
        });
        
        // Add trophy
        this.add.image(400, 200, 'trophy');
        this.sound.play('levelComplete', { volume: 0.7 });
        
        // Add congratulations text
        this.add.text(400, 40, this.trophyName, {
            fontSize: '28px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Add score text
        this.add.text(400, 370, `Final Score: ${this.score}`, {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // Add continue button
        const continueButton = this.add.image(400, 450, 'button').setInteractive();
        this.add.text(400, 450, this.nextLevel ? 'Next Level' : 'Play Again', {
            fontSize: '24px',
            fill: '#000'
        }).setOrigin(0.5);
        
        continueButton.on('pointerup', () => {
            if (this.nextLevel) {
                this.scene.start('GameScene', { level: this.nextLevel });
            } else {
                this.scene.start('MenuScene');
            }
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene,PlayerNameScene, MenuScene,OptionsScene,HelpScene, GameScene, TrophyScene, LeaderboardScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Create the game instance
const game = new Phaser.Game(config);