const game = {

    frame: 0,
    animationFrameId: 0,
    isGamePlaying: false,

    initialize: () => {
        game.canvas = document.getElementById("canvasGame");
        game.context = game.canvas.getContext('2d');
        game.sprite = new Image();
        game.sprite.onload = () => {
            playerSpaceShip.screenPosition.y = (game.canvas.height * 0.5) - (playerSpaceShip.screenPosition.height/2);
            game.isGamePlaying = true;
            game.loop()
        };
        game.sprite.src = "src/img/Sprites.png";
        window.onkeydown = playerSpaceShip.changeCurrentMove;
        window.onkeyup = playerSpaceShip.changeCurrentMove;
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

    loop: () => {
        console.log("Loop rodando");
        
        if(game.isGamePlaying){
            game.update();
            game.paint();
            game.frame++;
            game.animationFrameId = requestAnimationFrame(game.loop);
        }else{
            cancelAnimationFrame(game.animationFrameId);
        }
    }
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
            x: 0, y:0,
            height: 70, width:128
        },
        frames:{
            toLeft: {
                x: 0, y:81,
                height: 70, width:128
            },
            toTop: {
                x: 28, y:302,
                height: 128, width:68
            },
            toRight: {
                x: 0, y:0,
                height: 70, width:128
            },
            toBottom: {
                x: 28, y:163,
                height: 128, width:67
            },
        },
    },
    screenPosition:{
        x: 0, y: 0,
        height: 70 * 0.5, width: 128 * 0.5,
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
            x: 414, y:267,
            height: 95, width:95
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
            x: 800, y: Math.random() * 200,
            height: 95, width: 95,
        },
        {
            x: 900, y: Math.random() * 200 + 150,
            height: 95, width: 95,
        }
    ],

    speed: 2,

    paint: () => {
        obstacleAsteroid.asteroidsRendered.forEach( (asteroid) => {
            game.context.drawImage(
                game.sprite,
                obstacleAsteroid.source.position.x, obstacleAsteroid.source.position.y,
                obstacleAsteroid.source.position.width, obstacleAsteroid.source.position.height,
                asteroid.x, asteroid.y,
                asteroid.width, asteroid.height,
            );
        });
    },

    update: () => {
        obstacleAsteroid.generateAsteroids();
        obstacleAsteroid.deleteAsteroids();
        obstacleAsteroid.asteroidsRendered.forEach( (asteroid) => {
            asteroid.x -= obstacleAsteroid.speed;
        });
    },

    generateAsteroids: () => {
        let lastAsteroidPostion = obstacleAsteroid.asteroidsRendered[obstacleAsteroid.asteroidsRendered.length-1].x;
        if(lastAsteroidPostion <= 700){
            obstacleAsteroid.asteroidsRendered.push(
                {
                    x: 800, y: Math.random() * 200,
                    height: 95, width: 95,
                },
                {
                    x: 900, y: Math.random() * 200 + 150,
                    height: 95, width: 95,
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
