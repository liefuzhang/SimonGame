$(document).ready(() => {
    setupClickHandler();
    gameInit = Object.assign({}, game);
    audios[0].volume = 0.02;
});

var game = {
    isOn: false,
    series: [],
    isStrict: false,
    currentCount: 0,
    expectedIndex: 0,
    timeoutHandler: 0,
};

var gameInit = {};

var audios = [new Audio('res/error.mp3'),
new Audio('res/simonSound1.mp3'),
new Audio('res/simonSound2.mp3'),
new Audio('res/simonSound3.mp3'),
new Audio('res/simonSound4.mp3')];

var audioHandlers = [];

function setupClickHandler() {
    $('#start-button').click(() => {
        if (!game.isOn) {
            return;
        }
        startGame();
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
        }
    });
}

function turnGameOnOff(on) {
    if (on) {
        game.isOn = true;
        $("#count-screen").removeClass("turned-off");
    } else {
        game.isOn = false;
        clearTimeout(game.timeoutHandler);
        toggleButtons(false);
        audioHandlers.forEach((handler) => {
            if (handler){
                clearTimeout(handler);
            }
        });
        audios.forEach((audio)=> {
            audio.pause();
        });
        $(".plate-button").removeClass("light");
        $("#count-screen").text("--").addClass("turned-off");
    }
}

function onButtonClick(id) {
    if (id === game.series[game.expectedIndex]) {
        clearTimeout(game.timeoutHandler);

        $("#button" + id)[0].classList.add("light");
        playAudio(id, 0.5, (args) => {
            $("#button" + args.num)[0].classList.remove("light");
        }, args = { num: id });

        if (game.expectedIndex === game.currentCount) {
            MoveForward();
        } else {
            game.expectedIndex++;
            waitForInputSeries();
        }
    }
}

function MoveForward() {
    game.currentCount++;
    updateCountScreen();
    if (game.currentCount === 20) {
        // you win

    } else {
        toggleButtons(false);
        game.expectedIndex = 0;
        playCurrentSeries(0);
    }
}

function updateCountScreen() {
    var textCount = (game.currentCount + 1).toString();
    if (game.currentCount < 10) {
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

function timeoutOrFailedHandler() {
    toggleButtons(false);
    playAudio(0, 0.8, playCurrentSeries(0));
}

function startGame() {
    game = Object.assign({}, gameInit);
    updateCountScreen();
    generateSeries();
    playCurrentSeries(0);
}

function playAudio(num, sec, callback, callbackArgs) {
    if (audioHandlers[num]) {
        clearTimeout(audioHandlers[num]);
    }
    audios[num].load();
    audios[num].play();
    audioHandlers[num] = setTimeout(function () {
        audios[num].pause();
        if (callback) {
            callback(callbackArgs);
        }
    }, sec * 1000);
}

function playCurrentSeries(index) {
    var num = game.series[index];
    setTimeout(() => {
        $("#button" + num)[0].classList.add("light");
        playAudio(num, 1);

        setTimeout(() => {
            $("#button" + num)[0].classList.remove("light");
            if (index === game.currentCount) {
                toggleButtons(true);
                waitForInputSeries();
            } else {
                playCurrentSeries(index + 1);
            }
        }, 1000);
    }, 1000);
}

function toggleButtons(enable) {
    var buttons = $(".plate-button");
    if (enable) {
        $(".plate-button").removeClass("unclickable");
    } else {
        $(".plate-button").addClass("unclickable");
    }
}

