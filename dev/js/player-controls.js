const setupControls = (player, onPlayerShoot) => {
    'use strict';

    var width = window.innerWidth - 120,
        height = window.innerHeight - 130,
        halfPlayerWidth = player.width() / 2,
        halfPlayerHeight = player.height() / 2,
        direction = {
            left: false,
            right: false,
            down: false,
            up: false
        },
        playerSpeed = 8;

    function keyUpHandler(ev) {
        if (ev.which === 37) {
            direction.left = false;
        } else if (ev.which === 39) {
            direction.right = false;
        } else if (ev.which === 40) {
            direction.down = false;
        } else if (ev.which === 38) {
            direction.up = false;
        }
    }

    function keyDownHandler(ev) {
        if (ev.which === 37) {
            direction.left = true;
        } else if (ev.which === 39) {
            direction.right = true;
        } else if (ev.which === 40) {
            direction.down = true;
        } else if (ev.which === 38) {
            direction.up = true;
        }

        if (ev.which === 32) { // space
            onPlayerShoot();
        }
    }

    function updatePosition() {
        var x = player.getX(),
            y = player.getY();

        if (direction.up && y + halfPlayerHeight > halfPlayerHeight) {
            player.setY(y - playerSpeed);
        }
        if (direction.down && y + halfPlayerHeight < height) {
            player.setY(y + playerSpeed);
        }
        if (direction.left && x + halfPlayerWidth > halfPlayerWidth) {
            player.setX(x - playerSpeed);
        }
        if (direction.right && x + halfPlayerWidth < width) {
            player.setX(x + playerSpeed);
        }
    }

    return {
        updatePosition,
        keyUpHandler,
        keyDownHandler
    }
};