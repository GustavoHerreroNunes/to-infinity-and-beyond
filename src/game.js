const game = {

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
        playerSpaceShip.update();
        background.update();
    },

    paint: () => {
        game.context.clearRect(0, 0, 800, 400);
        background.paint();
        playerSpaceShip.paint();
    },

    loop: () => {
        console.log("Loop rodando");
        
        game.update();
        
        if(game.isGamePlaying){
            game.paint();
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
    sourcePosition:{
        x: 0, y:0,
        height: 70, width:128
    },
    screenPosition:{
        x: 0, y: 0,
        height: 70 * 0.5, width: 128 * 0.5
    },

    speed: 4,
    currentMove: {
        toLeft: false,
        toTop: false,
        toBottom: false,
        toRight: false
    },

    changeCurrentMove: (keyPressed) => {
        let isMoveStart = (keyPressed.type == "keydown");
        switch(keyPressed.keyCode){
            case 37:// ← 
            case 65:// a
                playerSpaceShip.currentMove.toLeft = isMoveStart;
                break;
            case 38:// ↑
            case 87://  w
                playerSpaceShip.currentMove.toTop = isMoveStart;
                break;
            case 39:// →
            case 68://d
                playerSpaceShip.currentMove.toRight = isMoveStart;
                break;
            case 40:// ↓ 
            case 83:// s
                playerSpaceShip.currentMove.toBottom = isMoveStart;
                break;
        }
    },

    update: () => {
        if(playerSpaceShip.currentMove.toLeft){
            playerSpaceShip.screenPosition.x -= playerSpaceShip.speed;
        }
        if(playerSpaceShip.currentMove.toTop){
            playerSpaceShip.screenPosition.y -= playerSpaceShip.speed;
        }
        if(playerSpaceShip.currentMove.toBottom){
            playerSpaceShip.screenPosition.y += playerSpaceShip.speed;
        }
        if(playerSpaceShip.currentMove.toRight){
            playerSpaceShip.screenPosition.x += playerSpaceShip.speed;
        }
    },

    paint: () => {
        game.context.drawImage(
            game.sprite,
            playerSpaceShip.sourcePosition.x, playerSpaceShip.sourcePosition.y,
            playerSpaceShip.sourcePosition.width, playerSpaceShip.sourcePosition.height,
            playerSpaceShip.screenPosition.x, playerSpaceShip.screenPosition.y,
            playerSpaceShip.screenPosition.width, playerSpaceShip.screenPosition.height,
        );
    }
}

window.addEventListener('load', () => {
    game.initialize();
});

