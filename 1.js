$(document).ready(() => {
    setupClickHandler();
    gameInit = Object.assign({}, game);
    audios[0].volume = 0.02;
});

var game = {
    series: [],
    currentCount: 0,
    expectedIndex: 0,
    timeoutHandler: 0,
    playSeriesHandler: 0,
    countFlickerHandler: 0
};

var gameControl = {
    isOn: false,
    isStrict: false,
    gameInit: null
}

var audios = [new Audio('res/error.mp3'),
new Audio('res/simonSound1.mp3'),
new Audio('res/simonSound2.mp3'),
new Audio('res/simonSound3.mp3'),
new Audio('res/simonSound4.mp3')];

var audioHandlers = [];

function setupClickHandler() {
    $('#start-button').click(() => {
        if (!gameControl.isOn) {
            return;
        }
        startGame();
    });

    $('#strict-button').click(() => {
        if (!gameControl.isOn) {
            return;
        }
        if (!gameControl.isStrict) {
            gameControl.isStrict = true;
            $("#strict-indicator").addClass("turned-on");
        } else {
            gameControl.isStrict = false;
            $("#strict-indicator").removeClass("turned-on");
        }
    });

    $('.plate-button').click(function () {
        var id = $(this).attr("id").match(/\d+/)[0];
        onButtonClick(Number(id));
    });

    $('#switch-container').click(function () {
        var $button = $("#switch-button");
        if ($button.hasClass("turned-on")) {
            $button.removeClass("turned-on");
            turnGameOnOff(false);
        } else {
            $button.addClass("turned-on");
            turnGameOnOff(true);
            gameControl.gameInit = Object.assign({}, game);
        }
    });
}

function turnGameOnOff(on) {
    if (on) {
        gameControl.isOn = true;
        $("#count-screen").removeClass("turned-off");
    } else {
        gameControl.isOn = false;
        gameControl.isStrict = false;
        $("#strict-indicator").removeClass("turned-on");        
        resetGame();
    }
}

function resetGame() {
    clearTimeout(game.timeoutHandler);
    clearTimeout(game.playSeriesHandler);
    clearTimeout(game.countFlickerHandler);
    toggleButtons(false);
    audioHandlers.forEach((handler) => {
        if (handler) {
            clearTimeout(handler);
        }
    });
    audios.forEach((audio) => {
        audio.pause();
    });
    $(".plate-button").removeClass("light");
    $("#count-screen").text("--").addClass("turned-off");
    game = Object.assign({}, gameControl.gameInit);
}

function onButtonClick(id) {
    clearTimeout(game.timeoutHandler);

    $("#button" + id)[0].classList.add("light");
    if (id === game.series[game.expectedIndex]) {
        playAudio(id, 0.5, () => {
            $("#button" + id)[0].classList.remove("light");
        });

        if (game.expectedIndex === game.currentCount) {
            MoveForward();
        } else {
            game.expectedIndex++;
            waitForInputSeries();
        }
    } else {
        timeoutOrFailedHandler(() => {
            $("#button" + id)[0].classList.remove("light");
        });
    }
}

function MoveForward() {
    game.currentCount++;
    toggleButtons(false);
    if (game.currentCount === 20) {
        // you win
        $("#count-screen").text("**");
        flickerCountScreen(16, 180);
        var lastNum = game.series[19];
        audioHandlers[lastNum] = setTimeout(() => {
            $("#button" + lastNum).addClass("light");
            playAudio(lastNum, 0.5, () => {
                $("#button" + lastNum).removeClass("light");
                playAudio(lastNum, 0.5, () => {
                    $("#button" + lastNum).addClass("light");
                    playAudio(lastNum, 0.5, () => {
                        $("#button" + lastNum).removeClass("light");
                        playAudio(lastNum, 0.5, () => {
                            $("#button" + lastNum).addClass("light");
                            playAudio(lastNum, 0.5, () => {
                                $("#button" + lastNum).removeClass("light");
                            })
                        })
                    })
                })
            })
        }, 500);
    } else {
        playCurrentSeries(0);
    }
}

function updateCountScreen() {
    var textCount = (game.currentCount + 1).toString();
    if (game.currentCount + 1 < 10) {
        textCount = "0" + textCount;
    }
    $("#count-screen").text(textCount).removeClass("turned-off");
}

function generateSeries() {
    game.series = [];
    for (var i = 0; i < 20; i++) {
        var rand = Math.floor(Math.random() * 4 + 1)
        game.series.push(rand);
    }
}

function waitForInputSeries() {
    game.timeoutHandler = setTimeout(() => {
        timeoutOrFailedHandler();
    }, 5000);
}

function timeoutOrFailedHandler(callback) {
    toggleButtons(false);
    playAudio(0, 0.8, () => {
        if (callback) {
            callback();
        }
    });
    $("#count-screen").text("!!");
    flickerCountScreen(6, 180, () => { 
        if (gameControl.isStrict) {
            generateSeries();
            game.currentCount = 0;
        }
        playCurrentSeries(0);
     });
}

function flickerCountScreen(times, interval, callback) {
    if (times === 0) {
        if (callback) {
            callback();
        }
        return;
    }
    game.countFlickerHandler = setTimeout(() => {
        $("#count-screen").toggleClass("turned-off");
        flickerCountScreen(times - 1, interval, callback);
    }, interval)
}

function startGame() {
    resetGame();
    $("#count-screen").removeClass("turned-off");
    flickerCountScreen(4, 180);
    generateSeries();
    playCurrentSeries(0);
}

function playAudio(num, sec, callback) {
    if (audioHandlers[num]) {
        clearTimeout(audioHandlers[num]);
    }
    audios[num].load();
    audios[num].play();
    audioHandlers[num] = setTimeout(function () {
        audios[num].pause();
        if (callback) {
            callback();
        }
    }, sec * 1000);
}

function playCurrentSeries(index) {
    var num = game.series[index];
    var delay = index === 0 ? 2000 : (19 - game.currentCount) * 30;
    game.expectedIndex = 0;
    game.playSeriesHandler = setTimeout(() => {
        $("#button" + num).addClass("light");
        updateCountScreen();
        playAudio(num, 0.5, () => {
            $("#button" + num).removeClass("light");
            if (index === game.currentCount) {
                toggleButtons(true);
                waitForInputSeries();
            } else {
                playCurrentSeries(index + 1);
            }
        });
    }, delay);
}

function toggleButtons(enable) {
    var buttons = $(".plate-button");
    if (enable) {
        $(".plate-button").removeClass("unclickable");
    } else {
        $(".plate-button").addClass("unclickable");
    }
}

