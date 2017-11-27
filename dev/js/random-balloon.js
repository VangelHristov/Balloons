const randomBalloon = (() => {
    "use strict";

    let width = window.innerWidth,
        height = window.innerHeight,
        colours = ['red', 'blue', 'green', 'orange', 'purple', 'grey', 'pink', 'brown', 'yellow', 'lime', 'cyan', 'black'],
        x = [width * 0.3, width * 0.5, width * 0.75, width / 2, width / 3, width / 4],
        y = [height / 6, height / 7, height / 8, height / 9],
        len = colours.length - 1,
        ballsDirections = [-1, 1],
        ballsSpeed = 4;

    return {
        getX: () => x[Math.floor(Math.random() * x.length)],
        getY: () => y[Math.floor(Math.random() * y.length)],
        getRadius: () => ( Math.random() * 40) + 15,
        getColour: () => colours[Math.floor(Math.random() * len)],
        getHorizontalOffset : () => Math.random() * ballsSpeed * ballsDirections[Math.floor(Math.random() * 2)],
        getVerticalOffset : () => Math.random() * ballsSpeed * ballsDirections[Math.floor(Math.random() * 2)]
    };
})();