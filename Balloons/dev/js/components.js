/*globals Kinetic*/

const components = (() => {
    "use strict";
    let image = new Image();
    image.src = 'images/plane.png';

    let gameOverLayer = new Kinetic.Layer();
    let gameOverText = new Kinetic.Text({
        fill: 'black',
        fontFamily: 'Edwardian script',
        textAlign: 'center',
        textBaseline: 'middle',
        fontSize: 200,
        stroke: 'red',
        x: window.innerWidth / 5,
        y: window.innerHeight / 10,
        text: 'GAME OVER \n'
    });
    let stage = new Kinetic.Stage({
        container: 'balloons-container',
        width: (window.innerWidth || document.body.clientWidth) - 50,
        height: (window.innerHeight || document.body.clientHeight) - 60
    });
    let mainLayer = new Kinetic.Layer();
    let player = new Kinetic.Image({
        x: stage.getWidth() / 2,
        y: stage.getHeight() - 150,
        width: 220,
        height: 145,
        image: image
    });
    let score = new Kinetic.Text({
        x: 50,
        y: 50,
        text: 'Lives: \n' + 5 + '\nScore: \n' + 0,
        fontFamily: 'Edwardian script',
        fontSize: 50,
        stroke: 'orange',
        fill: 'white'
    });
    let balloon = (x, y, radius, colour) => {
        return new Kinetic.Circle({
            x: x,
            y: y,
            radius: radius,
            fill: colour,
            stroke: 'black',
            lineWidth: 1
        });
    };

    return {
        gameOverLayer,
        gameOverText,
        stage,
        mainLayer,
        score,
        player,
        balloon
    };
})();