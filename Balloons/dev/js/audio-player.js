const audio = (() => {
    "use strict";

    var introTune = document.getElementById('intro'),
        themeTune = document.getElementById('theme'),
        outroTune = document.getElementById('outro'),
        shotSounds = document.getElementsByClassName('shot'),
        pickCoinSounds = document.getElementsByClassName('pickCoin');

    return {
        gameOver: function () {
            themeTune.pause();
            outroTune.play();
        },
        fireShot: function () {
            var count = shotSounds.length;
            do {
                if (shotSounds[count - 1].paused) {
                    shotSounds[count - 1].play();
                    break;
                }

                count -= 1;
            } while (count);
        },
        pickCoin: function () {
            var count = pickCoinSounds.length;
            do {
                if (pickCoinSounds[count - 1].paused) {
                    pickCoinSounds[count - 1].play();
                    break;
                }

                count -= 1;
            } while (count);
        },
        startGame: function () {
            introTune.pause();
            themeTune.volume = 0.4;
            themeTune.play();
        }
    };
})();