$(document).ready(() => {
    setupClickHandler();
    gameInit = Object.assign({}, game);
    audios[0].volume = 0.02;
});

var game = {
    series: [],
    isStrict: false,
    currentCount: 0,
    expectedIndex: 0,
    timeoutHandler: 0
};

var gameInit = {};

var audios = [new Audio('res/error.mp3'),
new Audio('res/simonSound1.mp3'),
new Audio('res/simonSound2.mp3'),
new Audio('res/simonSound3.mp3'),
new Audio('res/simonSound4.mp3')];

function setupClickHandler() {
    $('#start-button').click(() => {
        startGame();
    });

    $('.plate-button').click(function () {
        var id = $(this).attr("id").match(/\d+/)[0];
        onButtonClick(Number(id));
    });
}

function onButtonClick(id) {
    if (id === game.series[game.expectedIndex]) {
        clearTimeout(game.timeoutHandler);
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
    if (game.currentCount === 20) {
        // you win

    } else {
        toggleButtons(false);
        game.expectedIndex = 0;
        playCurrentSeries(0);
    }
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
    playAudio(0, 0.8);
    setTimeout(() => {
        playCurrentSeries(0);
    }, 800);
}

function startGame() {
    game = Object.assign({}, gameInit);
    generateSeries();
    playCurrentSeries(0);
}

function playAudio(num, sec) {
    audios[num].load();
    audios[num].play();
    setTimeout(function () {
        audios[num].pause();
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
                playCurrentSeries(index+1);
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

