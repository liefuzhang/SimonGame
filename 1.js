$(document).ready(() => {
    setupClickHandler();
    audios[0].volume = 0.02;
});

var game = {
    series: [],
    isStrict: false,
    currentCount: 0,
    timeoutHandler: 0
};

var audios = [new Audio('res/error.mp3'),
    new Audio('res/simonSound1.mp3'),
    new Audio('res/simonSound2.mp3'),
    new Audio('res/simonSound3.mp3'),
    new Audio('res/simonSound4.mp3')];

function setupClickHandler() {
    $('#start-button').click(() => {
        generateSeries();
        startGame();
    });

    $('.plate-button').click(function () {

    });
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
    setTimeout(()=> {
        playCurrentSeries();
    }, 800);
}

function startGame() {
    playCurrentSeries();
}

function playAudio(num, sec) {
    audios[num].load();
    audios[num].play();
    setTimeout(function() {
        audios[num].pause();
    }, sec*1000);
}

function playCurrentSeries() {
    for (var i = 0; i <= game.currentCount; i++) {
        var index = i;
        var num = game.series[i];
        setTimeout(() => {
            $("#button" + num)[0].classList.add("light");
            playAudio(num, 1);
        }, 1000);
        setTimeout(() => {
            $("#button" + num)[0].classList.remove("light");
            if (index === game.currentCount) {
                toggleButtons(true);
                waitForInputSeries();
            }
        }, 2000);
    }    
}

function toggleButtons(enable) {
    var buttons = $(".plate-button");
    if (enable) {
        $(".plate-button").removeClass("unclickable");
    } else {
        $(".plate-button").addClass("unclickable");
    }
}

