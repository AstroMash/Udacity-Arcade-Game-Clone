var game = {};

game.score = 0;

var scoreDisplay = document.querySelector('.info-score');
scoreDisplay.innerHTML = game.score;

// Global variable for hitbox visibility. Set by checkbox on game board.
var hitboxCheckbox = document.getElementById("hitbox");
var showHitbox = hitboxCheckbox.checked;
// Listen for a change in the hitbox checkbox and toggle hitbox visibility
hitboxCheckbox.addEventListener('click', function() {
    showHitbox = hitboxCheckbox.checked;
});


// Global variable for difficulty. Set by dropdown on game board.
var difficultyDropdown = document.getElementById("difficulty");
// Difficulty range is 1 to 10 with 1 being the easiest. Raises or lowers the chance of generating new enemies each loop.
var difficulty = difficultyDropdown.value;
// Listen for a change in the difficulty dropdown and adjust difficulty
difficultyDropdown.addEventListener('change', function () {
    difficulty = difficultyDropdown.value;
    //Blur dropdown so that when arrow keys are used to move player after difficulty selection, the dropdown value doesn't change
    this.blur();
});

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
    // Create hitbox parameters
    this.hitbox = { xOffset: 2, yOffset: 78, width: 97, height: 65 };

    // Lanes are the rows that enemies can traverse (count starts at 0, skipping water lane)
    const lanes = [1, 2, 4, 5];

    // Randomize lanes and select one for the enemy to spawn on
    const spawnLane = (lanes[Math.floor(Math.random() * lanes.length)]) - 1;
    this.x = -101;
    this.y = 50 + (spawnLane * 83);
    this.speed = Math.floor(Math.random() * 300) + 70;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed) * dt;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(ele, ind, arr) {
    // Check enemy position, and if it's offscreen, delete from array
    if (this.x > 707) {
        delete arr[ind];
    } else {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // If hitbox display is enabled, draw hitbox
    if (showHitbox) {
        drawHitbox(this);
    }

    this.checkCollision();
    
};

Enemy.prototype.checkCollision = function () {
    // Generate hitbox using defined parameters from enemy and player objects
    var enemyHitbox = { x: this.x + this.hitbox.xOffset, y: this.y + this.hitbox.yOffset, width: this.hitbox.width, height: this.hitbox.height };
    var playerHitbox = { x: player.x + player.hitbox.xOffset, y: player.y + player.hitbox.yOffset, width: player.hitbox.width, height: player.hitbox.height };

    // Check if any edge of the enemy overlaps any edge of the player
    if (enemyHitbox.x < playerHitbox.x + playerHitbox.width &&
        enemyHitbox.x + enemyHitbox.width > playerHitbox.x &&
        enemyHitbox.y < playerHitbox.y + playerHitbox.height &&
        enemyHitbox.height + enemyHitbox.y > playerHitbox.y) {
        // Collision detected! Send player back to spawn.
        player.x = 303;
        player.y = 465;
        // Deduct half of the expected victory points (can't go below a score of zero)
        if(game.score > 0) {
            game.score -= 50 * difficulty;
            // If deduction causes score to go below zero, set score to zero
            if(game.score < 0) {
                game.score = 0;
            }
        }
        scoreDisplay.innerHTML = game.score;
    }
}

// Player class
var Player = function(x, y) {
    // The image/sprite for our character
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;

    // Creat hitbox parameters for our character
    this.hitbox = { xOffset: 34, yOffset: 114, width: 35, height: 25 };
}

Player.prototype.update = function(dt) {
    this.checkWin();
}

// Check if player sprite has made it to the water lane
Player.prototype.checkWin = function() {
    if (this.y === -33) {
        // Send back to starting tile
        this.x = 303;
        this.y = 465;
        // Update score
        game.score += 100 * difficulty;
        scoreDisplay.innerHTML = game.score;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // If hitbox display is enabled, draw hitbox
    if (showHitbox) {
        drawHitbox(this);
    }
}

// Take player inputs and translate to sprite movement
Player.prototype.handleInput = function(kc) {
    switch (kc) {
        case 'w':
        case 'up': {
            // Don't allow movement up out of playable area
            if(this.y > -33){
                this.y -= 83;
            }
            break;
        }
        case 's':
        case 'down': {
            // Don't allow movement down out of playable area
            if(this.y < 465){
                this.y += 83;
            }
            break;
        }
        case 'a':
        case 'left': {
            // Don't allow movement left out of playable area
            if(this.x > 0){
                this.x -= 101;
            }
            break;
        }
        case 'd':
        case 'right': {
            // Don't allow movement right out of playable area
            if(this.x < 606){
                this.x += 101;
            }
            break;
        }
    }
}

function drawHitbox(ele) {
    // Style the hitbox
    ctx.strokeStyle = "#FF0000";

    // Draw the hitbox around the sprite
    ctx.strokeRect(ele.x + ele.hitbox.xOffset, ele.y + ele.hitbox.yOffset, ele.hitbox.width, ele.hitbox.height);
}

// Instantiate enemy objects
function generateInitialEnemies(num) {
    var enemies = [];
    const enemyCount = num;
    for(var i = 0; i < enemyCount; i++){
        enemies.push(new Enemy());
    }
    return enemies;
}

// Create initial set of enemies
var allEnemies = generateInitialEnemies(4);

// Create player and place on starting tile
var player = new Player(303,465);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a', // Left w/ WASD
        87: 'w', // Up w/ WASD
        68: 'd', // Right w/ WASD
        83: 's' // Down w/ WASD

    };

    player.handleInput(allowedKeys[e.keyCode]);
});
