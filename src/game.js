const XMLSprite = {

    requestXMLDocument: () => {
        XMLSprite.httpRequest = new XMLHttpRequest();
        if(!XMLSprite.httpRequest) console.log("Erro ao instânciar objeto HTTP");
        
        XMLSprite.httpRequest.onreadystatechange = () => {
            console.log("Ready State mudou");

            if(XMLSprite.httpRequest.readyState == XMLHttpRequest.DONE){
                if(XMLSprite.httpRequest.status === 200){
                    XMLSprite.responseHttp = XMLSprite.httpRequest.responseXML;
                    XMLSprite.rootElement = XMLSprite.responseHttp.documentElement;
                    game.isGamePlaying = true;
                    game.loop();
                }else{
                    console.log("Erro com a requisição HTTP - Status", XMLSprite.httpRequest.status);
                }
            }else{
                console.log("Requisição HTTP",(XMLSprite.httpRequest.readyState == 0) ? "não iniciada." : 
                                               (XMLSprite.httpRequest.readyState == 1) ? "aguardando, com conexão estabelecidada com o server." :
                                               (XMLSprite.httpRequest.readyState == 2) ? "recebida." :
                                               (XMLSprite.httpRequest.readyState == 3) ? "sendo processada." :
                                               "com estado desconhecido: " + XMLSprite.httpRequest.readyState);
            }
        }
        XMLSprite.httpRequest.open('GET', 'src/sprites.xml');
        XMLSprite.httpRequest.send();
    },


};

const game = {

    animationFrameId: 0,
    isGamePlaying: false,

    initialize: () => {
        game.canvas = document.getElementById("canvasGame");
        game.context = game.canvas.getContext('2d');
        game.sprite = new Image();
        game.sprite.onload = () => {
            XMLSprite.requestXMLDocument();
        };
        game.sprite.src = "src/img/Sprites.png";
    },

    update: () => {
        playerSpaceShip.update();
    },

    paint: () => {
        game.context.clearRect(0, 0, 800, 400);
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
                bgUnity.x -= 2.5;
            });
        });

        if((background.screenPosition[0][5].x + background.sourcePosition.width) == 800){
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

    update: () => {
        if((playerSpaceShip.screenPosition.x + playerSpaceShip.screenPosition.width) < game.canvas.width){
            playerSpaceShip.screenPosition.x += 2.5;
        }else{
            console.log("Cancelando loop");
            game.isGamePlaying = false;
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

