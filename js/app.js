// Set this to true only if you want to see the player/enemy hitboxes (may cause a decrease in rendering performance)
var showHitbox = true;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
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
    var enemyHitbox = { x: this.x + this.hitbox.xOffset, y: this.y + this.hitbox.yOffset, width: this.hitbox.width, height: this.hitbox.height };
    var playerHitbox = { x: player.x + player.hitbox.xOffset, y: player.y + player.hitbox.yOffset, width: player.hitbox.width, height: player.hitbox.height };

    if (enemyHitbox.x < playerHitbox.x + playerHitbox.width &&
        enemyHitbox.x + enemyHitbox.width > playerHitbox.x &&
        enemyHitbox.y < playerHitbox.y + playerHitbox.height &&
        enemyHitbox.height + enemyHitbox.y > playerHitbox.y) {
        // collision detected!
        console.log("Collision!"); 
        player.x = 303;
        player.y = 465;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.hitbox = { xOffset: 34, yOffset: 114, width: 35, height: 25 };
}

Player.prototype.update = function(dt) {
    this.checkWin();
}

Player.prototype.checkWin = function() {
    if (this.y === -33) {
        this.x = 303;
        this.y = 465;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // If hitbox display is enabled, draw hitbox
    if (showHitbox) {
        drawHitbox(this);
    }
}

Player.prototype.handleInput = function(kc) {
    switch (kc) {
        case 'w':
        case 'up': {
            if(this.y > -33){
                this.y -= 83;
            }
            break;
        }
        case 's':
        case 'down': {
            if(this.y < 465){
                this.y += 83;
            }
            break;
        }
        case 'a':
        case 'left': {
            if(this.x > 0){
                this.x -= 101;
            }
            break;
        }
        case 'd':
        case 'right': {
            if(this.x < 606){
                this.x += 101;
            }
            break;
        }
    }
}

function drawHitbox(ele) {
    ctx.strokeStyle = "#FF0000";
    ctx.strokeRect(ele.x + ele.hitbox.xOffset, ele.y + ele.hitbox.yOffset, ele.hitbox.width, ele.hitbox.height);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
function generateInitialEnemies(num) {
    var enemies = [];
    const enemyCount = num;
    for(var i = 0; i < enemyCount; i++){
        enemies.push(new Enemy());
    }
    return enemies;
}
var allEnemies = generateInitialEnemies(4);

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
