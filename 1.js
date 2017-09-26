$(document).ready(() => {
    setupClickHandler();
});

var game = {
    series: [],
    isStrict: false,
    currentCount: 0
};

function setupClickHandler() {
    $('#start-button').click(() => {
        generateSeries();
        startGame();
    });

    $('.plate-button').click(function () {
        if ($(this)[0].classList.contains("unclickable")) {
            return;
        }
        alert("button clicked");
    });
}

function generateSeries() {
    game.series = [];
    for (var i = 0; i < 20; i++) {
        var rand = Math.floor(Math.random() * 4 + 1)
        game.series.push(rand);
    }
}

function startGame() {

}