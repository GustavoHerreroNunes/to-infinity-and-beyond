const game = {

    showHitBox: false,

    errorMarginOn: true,

    animationFrameId: 0,
    
    isGamePlaying: false,
    
    timePlayed: {
        start: 0,
        current: 0
    },

    score: 0,
    highScore: 0,
    timesPlayed: 0,
    
    initialize: () => {
        game.canvas = document.getElementById("canvasGame");
        game.context = game.canvas.getContext('2d');
        game.sprite = new Image();
        game.sprite.onload = () => {
            playerSpaceShip.screenPosition.y = (game.canvas.height * 0.5) - (playerSpaceShip.screenPosition.height/2);
            game.screen.initial.initialize();
        };
        game.sprite.src = "src/img/Sprites.png";
    },
    
    screen: {
        initial: {
            isActive: false,

            initialize: () => {
                game.screen.initial.isActive = true;
                
                playerSpaceShip.screenPosition.y = (game.canvas.height * 0.5) - (playerSpaceShip.screenPosition.height/2);
                
                game.screen.initial.loop();

                window.onkeydown = (keyPressed) => {
                    console.log("Tecla pressionada -", keyPressed.keyCode);
                    if(keyPressed.keyCode == 13){
                        game.screen.initial.isActive = false;
                    }
                };
                
            },

            update: () => {
                if(playerSpaceShip.screenPosition.x < (game.canvas.width/2) - (playerSpaceShip.screenPosition.width/2)){
                    playerSpaceShip.screenPosition.x += playerSpaceShip.speed * 2;
                }
                background.update();
            },

            paint: () => {
                game.context.clearRect(0, 0, 800, 400);
                background.paint();
                playerSpaceShip.paint();
                if(!(playerSpaceShip.screenPosition.x < (game.canvas.width/2) - (playerSpaceShip.screenPosition.width/2))){    
                    game.context.fillStyle = "#00DAFF";
                    game.context.strokeStyle = "#000";
                    game.context.textAlign = "center";
                    game.context.font = "600 50px Orbitron";
                    game.context.fillText("To Infinity", game.canvas.width/2, game.canvas.height/2 - (playerSpaceShip.screenPosition.height + 55));
                    game.context.fillText("and Beyond", game.canvas.width/2, game.canvas.height/2 - (playerSpaceShip.screenPosition.height + 5));
                    game.context.strokeText("To Infinity", game.canvas.width/2, game.canvas.height/2 - (playerSpaceShip.screenPosition.height + 55));
                    game.context.strokeText("and Beyond", game.canvas.width/2, game.canvas.height/2 - (playerSpaceShip.screenPosition.height + 5));

                    game.context.fillStyle = "#D5D5FF";
                    game.context.strokeStyle = "#000";
                    game.context.textAlign = "center";
                    game.context.font = "600 21px Orbitron";
                    game.context.fillText("Press ENTER to start", game.canvas.width/2, game.canvas.height/2 + (playerSpaceShip.screenPosition.height + 3));
                    game.context.strokeText("Press ENTER to start", game.canvas.width/2, game.canvas.height/2 + (playerSpaceShip.screenPosition.height + 3));
                }
            },

            loop: () =>{
                console.log("Screen Initial - Loop rodando");

                if(game.screen.initial.isActive){
                    game.screen.initial.update();
                    game.screen.initial.paint();
    
                    game.animationFrameId = requestAnimationFrame(game.screen.initial.loop);
                }else{
                    cancelAnimationFrame(game.animationFrameId);
                    game.screen.play.initialize();
                }
            },
        },

        play: {
            isActive: false,

            initialize: () => {
                game.timePlayed.start = new Date().getTime();
                game.screen.play.isActive = true;
                window.onkeydown = playerSpaceShip.changeCurrentMove;
                window.onkeyup = playerSpaceShip.changeCurrentMove;
                game.animationFrameId = requestAnimationFrame(game.screen.play.loop);
            },

            update: () => {
                background.update();
                playerSpaceShip.update();
                obstacleAsteroid.update();
            },
        
            paint: () => {
                game.context.clearRect(0, 0, 800, 400);
                background.paint();
                playerSpaceShip.paint();
                obstacleAsteroid.paint();
            },

            loop: () =>{
                console.log("Screen Play - Loop rodando");
        
                if(game.screen.play.isActive){
                    game.screen.play.update();
                    game.screen.play.paint();
                    game.screen.play.printScore();
                    game.screen.play.printHighScore();
                    game.screen.play.printTimesPlayed();
                    game.frame++;
                    game.screen.play.isActive = !game.screen.play.detectColison();         
                    game.animationFrameId = requestAnimationFrame(game.screen.play.loop);
                }else{
                    cancelAnimationFrame(game.animationFrameId);
                    game.screen.game_over.initialize();
                }
            },

            printScore: () => {
                game.timePlayed.current = new Date().getTime();
                game.score = Math.floor((game.timePlayed.current - game.timePlayed.start)/1000);
        
                game.context.fillStyle = "#D5D5FF";
                game.context.strokeStyle = "#000";
                game.context.textAlign = "left";
                game.context.font = "800 28px Orbitron";
                game.context.fillText("Score: " + game.score, 20, game.canvas.height - 20);
                game.context.strokeText("Score: " + game.score, 20, game.canvas.height - 20);
            },
        
            printHighScore: () => {
                game.highScore = Math.max(game.score, game.highScore);
                
                game.context.fillStyle = "#FF8E56";
                game.context.strokeStyle = "#000";
                game.context.textAlign = "left";
                game.context.font = "800 22px Orbitron";
                game.context.fillText("High Score: "+ game.highScore.toString(), 20, 40);
                game.context.strokeText("High Score: "+ game.highScore.toString(), 20, 40);

            },

            printTimesPlayed: () => {

                game.context.fillStyle = "#FBEDEC";
                game.context.strokeStyle = "#000";
                game.context.textAlign = "left";
                game.context.font = "bold 22px Orbitron";
                game.context.fillText("Times Played: "+ game.timesPlayed.toString(), 20, 70);
                game.context.strokeText("Times Played: "+ game.timesPlayed.toString(), 20, 70);

            },

            detectColison: () => {
                let errorMargin = 15 * game.errorMarginOn;
                let spaceShipParts = {
                    back: playerSpaceShip.screenPosition.x,
                    front: playerSpaceShip.screenPosition.x + playerSpaceShip.screenPosition.width,
                    top: playerSpaceShip.screenPosition.y,
                    bottom: playerSpaceShip.screenPosition.y + playerSpaceShip.screenPosition.height
                }
                
                for(asteroid of obstacleAsteroid.asteroidsRendered){
                    let asteroidParts = {
                        back: asteroid.x + errorMargin,
                        front: asteroid.x + asteroid.width - errorMargin,
                        top: asteroid.y + errorMargin,
                        bottom: asteroid.y + asteroid.height - errorMargin
                    }
            
                    if(spaceShipParts.back <= asteroidParts.front && spaceShipParts.front >= asteroidParts.back){
                        if(spaceShipParts.top >= asteroidParts.top && spaceShipParts.top <= asteroidParts.bottom){
                            console.log("Entrou no asteroide!");
                            console.log("Nave:", spaceShipParts);
                            console.log("Asteroide:", asteroidParts);
                            return true;
                        }
                        if(spaceShipParts.bottom >= asteroidParts.top && spaceShipParts.bottom <= asteroidParts.bottom){
                            console.log("Entrou no asteroide!");
                            console.log("Nave:", spaceShipParts);
                            console.log("Asteroide:", asteroidParts);
                            return true;
                        }
                    }
                }
        
                return false;
            },
        },
        
        game_over: {
            isActive: false,

            initialize: () => {
                game.screen.game_over.isActive = true;

                game.context.fillStyle = "#FFAA00";
                game.context.strokeStyle = "#000";
                game.context.textAlign = "center";
                game.context.font = "600 50px Orbitron";
                game.context.fillText("Game Over", game.canvas.width/2, game.canvas.height/2);
                game.context.strokeText("Game Over", game.canvas.width/2, game.canvas.height/2);

                game.context.fillStyle = "#D5D5FF";
                game.context.strokeStyle = "#000";
                game.context.textAlign = "center";
                game.context.font = "600 21px Orbitron";
                game.context.fillText("Press ENTER to try again", game.canvas.width/2, game.canvas.height/2 + 53);
                game.context.strokeText("Press ENTER to try again", game.canvas.width/2, game.canvas.height/2 + 53);

                window.onkeydown = (keyPressed) => {
                    console.log("Tecla pressionada -", keyPressed.keyCode);
                    if(keyPressed.keyCode == 13){
                        game.timesPlayed++;
                        game.screen.game_over.isActive = false;
                        game.screen.game_over.resetValues();
                        game.screen.initial.initialize();
                    }
                };
            },

            resetValues: () => {
                playerSpaceShip.source.position = playerSpaceShip.source.frames.toRight;
                playerSpaceShip.screenPosition.height = playerSpaceShip.source.position.height * 0.5;
                playerSpaceShip.screenPosition.width = playerSpaceShip.source.position.width * 0.5;
                playerSpaceShip.screenPosition.x = 0;
                obstacleAsteroid.asteroidsRendered = [
                    {
                        x: 800, y: 200,
                        height: 78, width:76,
                    },
                    {
                        x: 900, y: Math.random() * 200 + 150,
                        height: 78, width:76,
                    }
                ]
            },
        }
    },
}

const background = {
    sourcePosition:{
        x: 545, y:0,
        height: 166, width:158
    },
    screenPosition:[
        [{x:0, y:0}, {x:158, y:0}, {x:316, y:0}, {x:474, y:0}, {x:632, y:0}, {x:790, y:0}],
        [{x:0, y:166}, {x:158, y:166}, {x:316, y:166}, {x:474, y:166}, {x:632, y:166}, {x:790, y:166}],
        [{x:0, y:332}, {x:158, y:332}, {x:316, y:332}, {x:474, y:332}, {x:632, y:332}, {x:790, y:332}]
    ],

    paint: () => {
        background.screenPosition.forEach( (bgRow) => {
            bgRow.forEach( (bgUnity) => {
                game.context.drawImage(
                    game.sprite,
                    background.sourcePosition.x, background.sourcePosition.y,
                    background.sourcePosition.width, background.sourcePosition.height,
                    bgUnity.x, bgUnity.y,
                    background.sourcePosition.width, background.sourcePosition.height,
                );
            });
        });
    },

    update: () => {
        background.screenPosition.forEach( (bgRow) => {
            bgRow.forEach( (bgUnity) => {
                bgUnity.x -= 2;
            });
        });

        if((background.screenPosition[0][(background.screenPosition[0].length - 1)].x + background.sourcePosition.width) == 800){
            let coordY = 0;
            background.screenPosition.forEach( (bgRow) => {
                bgRow.push({x:800, y: coordY});
                coordY+=166;
            });
        }
        if((background.screenPosition[0][0].x + background.sourcePosition.width) <= -158){
            background.screenPosition.forEach( (bgRow) => {
                bgRow.shift();
            });
        }
    }
}

const playerSpaceShip = {
    source:{
        position: {
            x: 278, y:0,
            height: 101, width:94
        },
        frames:{
            toLeft: {
                x: 278, y:112,
                height: 101, width:94
            },
            toTop: {
                x: 278, y:331,
                height: 94, width:101
            },
            toRight: {
                x: 278, y:0,
                height: 101, width:94
            },
            toBottom: {
                x: 278, y:225,
                height: 94, width:101
            },
        },
    },
    screenPosition:{
        x: 0, y: 0,
        height: 101 * 0.5, width: 94 * 0.5,
    },

    speed: 3,
    currentMove: {
        toLeft: false,
        toRight: false,
        toTop: false,
        toBottom: false,
    },

    changeCurrentMove: (keyPressed) => {
        let isMoveStart = (keyPressed.type == "keydown");
        switch(keyPressed.keyCode){
            case 37:// ← 
            case 65:// a
                playerSpaceShip.currentMove.toLeft = isMoveStart;
                break;
            case 39:// →
            case 68://d
                playerSpaceShip.currentMove.toRight = isMoveStart;
                break;
            case 38:// ↑
            case 87://  w
                playerSpaceShip.currentMove.toTop = isMoveStart;
                break;
            case 40:// ↓ 
            case 83:// s
                playerSpaceShip.currentMove.toBottom = isMoveStart;
                break;
        }
    },

    verifyPositionOnCanvas: () => {
        let isBeforeBorderLeft, isBeforeBorderRight, isBeforeBorderTop, isBeforeBorderBottom;
        let spaceShipParts = {
            back: playerSpaceShip.screenPosition.x,
            front: playerSpaceShip.screenPosition.x + playerSpaceShip.screenPosition.width,
            top: playerSpaceShip.screenPosition.y,
            bottom: playerSpaceShip.screenPosition.y + playerSpaceShip.screenPosition.height
        }
        
        isBeforeBorderLeft = (spaceShipParts.back > 0);
        isBeforeBorderRight = (spaceShipParts.front < 800);
        isBeforeBorderTop = (spaceShipParts.top > 0);
        isBeforeBorderBottom = (spaceShipParts.bottom < 400);

        return {isBeforeBorderLeft, isBeforeBorderRight, isBeforeBorderTop, isBeforeBorderBottom}
    },

    update: () => {
        let {isBeforeBorderLeft, isBeforeBorderRight, isBeforeBorderTop, isBeforeBorderBottom} = playerSpaceShip.verifyPositionOnCanvas(); 

        if(playerSpaceShip.currentMove.toLeft && isBeforeBorderLeft){
            playerSpaceShip.screenPosition.x -= playerSpaceShip.speed;
            playerSpaceShip.source.position = playerSpaceShip.source.frames.toLeft;
        }
        if(playerSpaceShip.currentMove.toRight && isBeforeBorderRight){
            playerSpaceShip.screenPosition.x += playerSpaceShip.speed;
            playerSpaceShip.source.position = playerSpaceShip.source.frames.toRight;
        }
        if(playerSpaceShip.currentMove.toTop && isBeforeBorderTop){
            playerSpaceShip.screenPosition.y -= playerSpaceShip.speed;
            playerSpaceShip.source.position = playerSpaceShip.source.frames.toTop;
        }
        if(playerSpaceShip.currentMove.toBottom && isBeforeBorderBottom){
            playerSpaceShip.screenPosition.y += playerSpaceShip.speed;
            playerSpaceShip.source.position = playerSpaceShip.source.frames.toBottom;
        }
        playerSpaceShip.screenPosition.height = playerSpaceShip.source.position.height * 0.5;
        playerSpaceShip.screenPosition.width = playerSpaceShip.source.position.width * 0.5;
    },

    paint: () => {
        if(game.showHitBox){
            game.context.fillStyle = "#4444AA";
            game.context.fillRect( 
                playerSpaceShip.screenPosition.x, playerSpaceShip.screenPosition.y,
                playerSpaceShip.screenPosition.width, playerSpaceShip.screenPosition.height
            );
        }
        game.context.drawImage(
            game.sprite,
            playerSpaceShip.source.position.x, playerSpaceShip.source.position.y,
            playerSpaceShip.source.position.width, playerSpaceShip.source.position.height,
            playerSpaceShip.screenPosition.x, playerSpaceShip.screenPosition.y,
            playerSpaceShip.screenPosition.width, playerSpaceShip.screenPosition.height,
        );
    },
}

const obstacleAsteroid = {
    source:{
        position: {
            x: 423, y:178,
            height: 78, width:76
        },
        frames:{
            comet: {
                x: 421, y:0,
                height: 78, width:78
            },
            whiteAteroid: {
                x: 421, y:89,
                height: 78, width:78
            },
            redAsteroid: {
                x: 423, y:178,
                height: 78, width:76
            },
            groupAsteroids: {
                x: 414, y:267,
                height: 95, width:95
            },
        },
    },
    asteroidsRendered:[
        {
            x: 800, y: 200,
            height: 78, width:76,
        },
        {
            x: 900, y: Math.random() * 200 + 150,
            height: 78, width:76,
        }
    ],

    speed: 2,
    
    update: () => {
        obstacleAsteroid.generateAsteroids();
        obstacleAsteroid.deleteAsteroids();
        obstacleAsteroid.asteroidsRendered.forEach( (asteroid) => {
            asteroid.x -= obstacleAsteroid.speed;
        });
    },
    
    paint: () => {
        obstacleAsteroid.asteroidsRendered.forEach( (asteroid) => {
            if(game.showHitBox){
                game.context.fillStyle = "#AA0000";
                game.context.fillRect(
                    asteroid.x, asteroid.y,
                    asteroid.width, asteroid.height,
                );
            }
            game.context.drawImage(
                game.sprite,
                obstacleAsteroid.source.position.x, obstacleAsteroid.source.position.y,
                obstacleAsteroid.source.position.width, obstacleAsteroid.source.position.height,
                asteroid.x, asteroid.y,
                asteroid.width, asteroid.height,
            );
        });
    },

    generateAsteroids: () => {
        let lastAsteroidPostion = obstacleAsteroid.asteroidsRendered[obstacleAsteroid.asteroidsRendered.length-1].x;
        if(lastAsteroidPostion <= 650){
            obstacleAsteroid.asteroidsRendered.push(
                {
                    x: 800, y: Math.random() * game.canvas.height/2,
                    height: 78, width:76,
                },
                {
                    x: 950, y: Math.random() * game.canvas.height/2 + 150,
                    height: 78, width:76
                }
            );
        }
    },

    deleteAsteroids: () => {
        let firstAsteroidFront = obstacleAsteroid.asteroidsRendered[0].x + obstacleAsteroid.asteroidsRendered[0].width;
        if(firstAsteroidFront <= 0){
            obstacleAsteroid.asteroidsRendered.shift();
        }
    },
}

window.addEventListener('load', () => {
    game.initialize();
});
