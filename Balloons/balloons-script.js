/* jshint undef:true, unused:true */
/* globals window, Kinetic, Everlive */

(function () {
    'use strict';

    var introTune = document.getElementById('intro'),
        themeTune = document.getElementById('theme'),
        outroTune = document.getElementById('outro'),
        shotSound = document.getElementById('shot'),
        pickCoinSound = document.getElementById('pickCoin'),
        audio = {
            gameOver: function () {
                themeTune.pause();
                outroTune.play();
            },
            fireShot: function () {
                shotSound.play();
            },
            pickCoin: function () {
                pickCoinSound.play();
            },
            startGame: function () {
                introTune.pause();
                themeTune.volume = 0.6;
                themeTune.play();
            }
        };

    function initGame() {
        audio.startGame();

        document.getElementById('player-info')
            .className = 'hidden';

        var stage = new Kinetic.Stage({
                container: 'balloons-container',
                width: (window.innerWidth || document.body.clientWidth) - 23,
                height: (window.innerHeight || document.body.clientHeight) - 33
            }),
            width = stage.getWidth(),
            height = stage.getHeight(),
            circlesColors = ['red', 'blue', 'green', 'orange', 'purple', 'grey', 'pink', 'brown', 'yellow', 'lime'],
            newBallHorizontalCoors = [width * 0.3, width * 0.5, width * 0.75, width / 2, width / 3, width / 4],
            newBallVerticalCoors = [height / 6, height / 7, height / 8, height / 9],
            playerScore = 0,
            playerLives = 5,
            ballsDirections = [-1, 1],
            ballsSpeed = 4,
            len = circlesColors.length - 1,
            mainLayer = new Kinetic.Layer(),
            player = new Kinetic.Rect({
                x: stage.getWidth() / 2,
                y: stage.getHeight() - 50,
                fill: 'black',
                width: 30,
                height: 50
            }),
            score = new Kinetic.Text({
                x: 50,
                y: 50,
                text: 'Lives: \n' + playerLives + '\nScore: \n' + playerScore,
                fontFamily: 'Edwardian script',
                fontSize: 50,
                stroke: 'orange',
                fill: 'white'
            }),
            initAnimation,
            isPaused = false,
            requestAnimationFrame =
                window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        mainLayer.add(score);
        mainLayer.add(player);
        stage.add(mainLayer);

        function playerControls(target) {
            var x = player.getX();
            // Left direction
            if (target.keyCode === 37) {
                if (x >= 20) {
                    player.setX(x - 20);
                }
            }
            // Right direction
            if (target.keyCode === 39) {
                if (x < width - 40) {
                    player.setX(x + 20);
                }
            }
            // space bar
            if (target.keyCode === 32) {
                makeShot();
            }
            // p button
            if (target.keyCode === 80) {
                isPaused = true;
            }
            // esq button, resume game
            if (target.keyCode === 27) {
                isPaused = false;
                animate();
            }
        }

        window.addEventListener('keydown', playerControls);

        function addNewBall() {
            var newCircle = new Kinetic.Circle({
                x: newBallHorizontalCoors[Math.floor(Math.random() * newBallHorizontalCoors.length)],
                y: newBallVerticalCoors[Math.floor(Math.random() * newBallVerticalCoors.length)],
                radius: ( Math.random() * 40) + 15,
                fill: circlesColors[Math.floor(Math.random() * len)],
                stroke: 'black',
                lineWidth: 1
            });
            newCircle.deltaX = 1;
            newCircle.deltaY = 1;
            newCircle.horizontalOffset = Math.random() * ballsSpeed * ballsDirections[Math.floor(Math.random() * 2)];
            newCircle.verticalOffset = Math.random() * ballsSpeed * ballsDirections[Math.floor(Math.random() * 2)];
            mainLayer.add(newCircle);

            setTimeout(addNewBall, 3500);
        }

        function updateBallPosition(currentBall) {
            function isCurrentBallCollidingWith(otherBall) {
                if (otherBall === currentBall) {
                    return false;
                }
                var b1 = {
                        x: currentBall.getX(),
                        y: currentBall.getY(),
                        r: currentBall.getRadius()
                    },
                    b2 = {
                        x: otherBall.getX(),
                        y: otherBall.getY(),
                        r: otherBall.getRadius()
                    },
                    d = Math.sqrt((b1.x - b2.x) * (b1.x - b2.x) + (b1.y - b2.y) * (b1.y - b2.y));

                return d <= (b1.r + b2.r);
            }

            var r = currentBall.getRadius(),
                oldX = currentBall.getX(),
                oldY = currentBall.getY(),
                deltaY = currentBall.deltaY,
                deltaX = currentBall.deltaX,
                newX = oldX + (deltaX * currentBall.horizontalOffset),
                newY = oldY + (deltaY * currentBall.verticalOffset);

            if (newX + r >= width || newX - r <= 0) {
                currentBall.deltaX *= -1;
            }

            if (newY - r <= 0 || newY + r >= height) {
                currentBall.deltaY *= -1;
            }

            // if ball falls on ground player looses 1 live
            if (newY + r >= height) {
                playerLives -= 1;
            }

            if (mainLayer.find('Circle').some(isCurrentBallCollidingWith)) {
                currentBall.deltaX += -0.1;
                currentBall.deltaY += -0.1;
            }

            removeIfHit(currentBall);

            currentBall.setX(oldX + currentBall.deltaX * currentBall.horizontalOffset);
            currentBall.setY(oldY + currentBall.deltaY * currentBall.verticalOffset);
        }

        function makeShot() {
            var shot = new Kinetic.Rect({
                x: player.getX() + (player.getWidth() / 2),
                y: height - player.getHeight(),
                width: 5,
                height: 10,
                fill: 'black'
            });
            audio.fireShot();
            mainLayer.add(shot);
        }

        function removeIfHit(ball) {
            var current = ball;
            mainLayer.find('Rect').forEach(function (shot) {
                var shotX = shot.getX(),
                    ballX = current.getX(),
                    ballRadius = current.getRadius(),
                    ballY = current.getY(),
                    shotY = shot.getY(),
                    inRangeLeftRight = (shotX <= ballX) ? (ballX - ballRadius < shotX) : (ballX + ballRadius > shotX),
                    inRangeTopBottom = (shotY >= ballY) ? (shotY < ballY - ballRadius) : (shotY < ballY + ballRadius),
                    isHit = (inRangeLeftRight && inRangeTopBottom);

                if (isHit) {
                    audio.pickCoin();
                    playerScore += Math.floor(ballRadius);
                    current.remove();
                }
            });
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

        function updateHUD() {
            score.setText('Lives: \n' + playerLives + '\nScore: \n' + playerScore);
        }

        function animate() {
            mainLayer.find('Circle')
                     .forEach(updateBallPosition);
            mainLayer.find('Rect')
                     .forEach(updateShotPosition);
            updateHUD();

            if (!isPaused) {
                initAnimation = requestAnimationFrame(animate);
            }

            if (isPaused) {
                window.cancelAnimationFrame(initAnimation);
            }

            if (playerLives <= 0) {
                window.cancelAnimationFrame(initAnimation);
                gameOver();
            }
            mainLayer.draw();
        }

        function gameOver() {
            window.removeEventListener('keydown', playerControls);

            document.getElementById('reload')
                    .classList
                    .remove('hidden');

            audio.gameOver();

            var gameOverLayer = new Kinetic.Layer(),
                gameOverText = new Kinetic.Text({
                    fill: 'black',
                    fontFamily: 'Edwardian script',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    fontSize: 200,
                    stroke: 'red',
                    x: width / 5,
                    y: height / 10,
                    text: 'GAME OVER \n'
                });

            gameOverLayer.add(gameOverText);
            stage.add(gameOverLayer);

            stage.draw();
        }

        addNewBall();
        animate();
    }

    document.getElementById('player-info')
            .addEventListener('submit', function (ev) {
                ev.preventDefault();
                initGame();
            });

    document.getElementById('new-game')
            .addEventListener('submit', function () {
                window.location.reload(true);
            });

}());
