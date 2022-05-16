const game = {

    animationFrameId: 0,
    isGamePlaying: false,

    initialize: () => {
        game.canvas = document.getElementById("canvasGame");
        game.context = game.canvas.getContext('2d');
        game.sprite = new Image();
        game.sprite.onload = () => {
            game.isGamePlaying = true;
            game.loop()
        };
        game.sprite.src = "src/img/Sprites.png";
    },

    update: () => {
        playerSpaceShip.update();
    },

    paint: () => {
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

const playerSpaceShip = {
    sourcePosition:{
        x: 0, y:0,
        height: 70, width:128
    },
    screenPosition:{
        x: 0, y: 0,
        height: 70 * 0.5, width: 128 * 0.5
    },

    update: () => {
        if((playerSpaceShip.screenPosition.x + playerSpaceShip.screenPosition.width) < game.canvas.width){
            playerSpaceShip.screenPosition.x += 2.5;
        }else{
            console.log("Cancelando loop");
            game.isGamePlaying = false;
        }
    },

    paint: () => {
        game.context.clearRect(0, 0, 800, 400);
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

