/* globals window, Kinetic, audio, components, randomBalloon*/

(function () {
    'use strict';

    function initGame() {
        audio.startGame();
        document.getElementById('player-info').className = 'hidden';

        var player = components.player,
            score = components.score,
            stage = components.stage,
            mainLayer = components.mainLayer,
            width = stage.getWidth(),
            height = stage.getHeight(),
            playerScore = 0,
            playerLives = 5,
            animationFrame,
            getAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        mainLayer.add(score);
        mainLayer.add(player);
        stage.add(mainLayer);

        var playerController = setupControls(player, fireShot);

        function addNewBalloon() {
            var balloon = components.balloon(
                randomBalloon.getX(),
                randomBalloon.getY(),
                randomBalloon.getRadius(),
                randomBalloon.getColour()
            );

            balloon.deltaX = 1;
            balloon.deltaY = 1;
            balloon.horizontalOffset = randomBalloon.getHorizontalOffset();
            balloon.verticalOffset = randomBalloon.getVerticalOffset();

            mainLayer.add(balloon);
            setTimeout(addNewBalloon, 1000);
        }

        function updateBalloonPosition(currentBalloon) {
            function isCurrentBalloonCollidingWith(otherBalloon) {
                if (otherBalloon === currentBalloon) {
                    return false;
                }
                var b1 = {
                        x: currentBalloon.getX(),
                        y: currentBalloon.getY(),
                        r: currentBalloon.getRadius()
                    },
                    b2 = {
                        x: otherBalloon.getX(),
                        y: otherBalloon.getY(),
                        r: otherBalloon.getRadius()
                    },
                    d = Math.sqrt((b1.x - b2.x) * (b1.x - b2.x) + (b1.y - b2.y) * (b1.y - b2.y));

                return d <= (b1.r + b2.r);
            }

            var r = currentBalloon.getRadius(),
                oldX = currentBalloon.getX(),
                oldY = currentBalloon.getY(),
                deltaY = currentBalloon.deltaY,
                deltaX = currentBalloon.deltaX,
                newX = oldX + (deltaX * currentBalloon.horizontalOffset),
                newY = oldY + (deltaY * currentBalloon.verticalOffset);

            if (newX + r >= width || newX - r <= 0) {
                currentBalloon.deltaX *= -1;
            }

            if (newY - r <= 0 || newY + r >= height) {
                currentBalloon.deltaY *= -1;
            }

            // if balloon falls on ground player looses 1 live
            if (newY + r >= height) {
                playerLives -= 1;
            }

            if (mainLayer.find('Circle').some(isCurrentBalloonCollidingWith)) {
                currentBalloon.deltaX += -0.1;
                currentBalloon.deltaY += -0.1;
            }

            removeIfHit(currentBalloon);

            currentBalloon.setX(oldX + currentBalloon.deltaX * currentBalloon.horizontalOffset);
            currentBalloon.setY(oldY + currentBalloon.deltaY * currentBalloon.verticalOffset);
        }

        function updateShotPosition(rect) {
            var currentY = rect.getY(),
                offset = 10,
                newY = currentY - offset;
            if (rect !== player) {
                rect.setY(newY);
            }
            if (newY <= 0) {
                rect.remove();
            }
        }

        function removeIfHit(balloon) {
            var current = balloon;
            mainLayer.find('Rect').forEach(function (shot) {
                var shotX = shot.getX(),
                    balloonX = current.getX(),
                    balloonRadius = current.getRadius(),
                    balloonY = current.getY(),
                    shotY = shot.getY(),
                    inRangeLeftRight = (shotX <= balloonX)
                        ? (balloonX - balloonRadius < shotX)
                        : (balloonX + balloonRadius > shotX),
                    inRangeTopBottom = (shotY >= balloonY)
                        ? (shotY < balloonY - balloonRadius)
                        : (shotY < balloonY + balloonRadius),
                    isHit = (inRangeLeftRight && inRangeTopBottom);

                if (isHit) {
                    audio.pickCoin();
                    playerScore += Math.floor(balloonRadius);
                    current.remove();
                }
            });
        }

        function fireShot() {
            var shot = new Kinetic.Rect({
                x: player.getX() + player.width() / 2,
                y: player.getY(),
                width: 5,
                height: 10,
                fill: 'black'
            });

            mainLayer.add(shot);
            audio.fireShot();
        }

        function updateHUD() {
            score.setText('Lives: \n' + playerLives + '\nScore: \n' + playerScore);
        }

        function gameOver() {
            audio.gameOver();

            window.removeEventListener('keydown', playerController.keyDownHandler);
            window.removeEventListener('keyup', playerController.keyUpHandler);
            document.getElementById('new-game').classList.remove('hidden');

            var gameOverLayer = components.gameOverLayer,
                gameOverText = components.gameOverText;

            gameOverLayer.add(gameOverText);
            stage.add(gameOverLayer);
            stage.draw();
        }

        function animate() {
            mainLayer.find('Circle').forEach(updateBalloonPosition);
            mainLayer.find('Rect').forEach(updateShotPosition);
            updateHUD();
            playerController.updatePosition();

            animationFrame = getAnimationFrame(animate);

            if (playerLives <= 0) {
                window.cancelAnimationFrame(animationFrame);
                gameOver();
            }

            mainLayer.draw();
        }

        window.addEventListener('keydown', playerController.keyDownHandler);
        window.addEventListener('keyup', playerController.keyUpHandler);
        document.getElementById('new-game').addEventListener('click', function (ev) {
            ev.preventDefault();
            window.location.reload(true);
        });

        addNewBalloon(mainLayer);
        animate();
    }

    document.getElementById('player-info')
            .addEventListener('submit', function (ev) {
                ev.preventDefault();
                initGame();
            });
}());
