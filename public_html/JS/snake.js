/*-----------------------------------------------------------------------------
 * variables
 * ----------------------------------------------------------------------------
 */
var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenwidth;
var screenheight;

var gameState;
var gameOverMenu;
var restartButton;
var playHUD;
var scoreboard;
var startscreen;
var easyButton;
var mediumButton;
var hardButton;


/*-----------------------------------------------------------------------------
 * executing game code
 * ----------------------------------------------------------------------------
 */

gameInitialize();
//showStartMenu();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000 / 30);

/*-----------------------------------------------------------------------------
 * game functions
 * ----------------------------------------------------------------------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;
    
    startscreen = document.getElementById("startscreen");
    document.addEventListener("keydown", keyboardHandler);
    
    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);
    
    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);
    
    playHUD = document.getElementById("playHUD");
    scoreboard = document.getElementById("scoreboard");
    
    easyButton = document.getElementById("easyButton");
    easyButton.addEventListener("click",gameRestart);
    
    mediumButton = document.getElementById("mediumButton");
    mediumButton.addEventListener("click", gameRestart);
    
    hardButton = document.getElementById("hardButton");
    hardButton.addEventListener("click", gameRestart);
   
   
  
    setState("MAIN MENU");
    
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
    }
    
    else if(gameState == "MAIN MENU") {
        displayStartMenu();
    }
}

function gameDraw() {
    context.fillStyle = "rgb(147, 74, 148)";
    context.fillRect(0, 0, screenWidth, screenHeight);
}

function gameRestart() {
    snakeInitialize();
    foodInitialize();
    hideMenu(gameOverMenu);
    setState("PLAY");
    
}

/*-----------------------------------------------------------------------------
 *snake function
 *-----------------------------------------------------------------------------
 */

function snakeInitialize() {
    snake = [];
    snakeLength = 5;
    snakeSize = 20;
    snakeDirection = "down";

    for (var index = snakeLength - 1; index >= 0; index--) {
        snake.push({
            x: index,
            y: 0
        });

    }
}

function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        context.fillStyle = "white";
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;

    if (snakeDirection == "down") {
        snakeHeadY++;
    }
    else if (snakeDirection == "right") {
        snakeHeadX++;
    }
    else if (snakeDirection == "left") {
        snakeHeadX--;
    }
    else if (snakeDirection == "up") {
        snakeHeadY--;
    }

    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);
  

    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/*-----------------------------------------------------------------------------
 * food functions
 * ----------------------------------------------------------------------------
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
    context.fillStyle = "white";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);

    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);

    checkFoodCollisions(randomX, randomY);
}

/*-----------------------------------------------------------------------------
 * input functions
 * ----------------------------------------------------------------------------
 */

function keyboardHandler(event) {
    console.log(event);

    if (event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if (event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    else if (event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }
    else if (event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }
}

/*-----------------------------------------------------------------------------
 * collision Handling
 * ----------------------------------------------------------------------------
 */

function checkFoodCollisions(snakeHeadX, snakeHeadY, randomX, randomY) {
    if (snakeHeadX == food.x && snakeHeadY == food.y) {
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
    }

    if (snakeHeadX == food.x && snakeHeadY == food.y) {
        randomX = Math.floor(Math.random() * screenWidth);
        randomY = Math.floor(Math.random() * screenHeight);

        food.x = Math.floor(randomX / snakeSize);
        food.y = Math.floor(randomY / snakeSize);
    }
}

function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0) {
         setState("GAME OVER");
    }
    
    else if (snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0){
        setState("GAME OVER");
    }
   
}

function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for(var index = 1; index < snake.length; index++) {
        if (snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
        setState("GAME OVER");
        return;
    }
        
    }
    
    
}

/*-----------------------------------------------------------------------------
 * Game State handling
 *----------------------------------------------------------------------------- 
 */

function setState(state) {
    console.log(state);
    gameState = state;
showMenu(state);

}

/*-----------------------------------------------------------------------------
 * Menu Functions
 * ----------------------------------------------------------------------------
 */

function displayStartMenu(menu) {
    menu.style.visibility = "visible";
}

function hideStartscreen(menu) {
    menu.style.visibility = "hidden";
}


function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden";
}

function showMenu(state){
    if(state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    
    else if(state == "PLAY"){
        displayMenu(playHUD);
        hideStartscreen(startscreen);
    }
    
    else if(state == "MAIN MENU") {
        displayStartMenu(startscreen);
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px"; 
    menu.style.right = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

function drawScoreboard() {
    scoreboard.innerHTML = "Score:" + snakeLength;
}