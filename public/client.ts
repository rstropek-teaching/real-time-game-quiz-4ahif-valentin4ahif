declare const io: SocketIOStatic;

//player one or player two
let playerNumber: number;

//coordinates of the selected <td>
let currentX: number;
let currentY: number;

//local safed game field
let gF: States[][];

//definition: see "data.ts"
enum States {
    neutral = 'neutral',
    one = 'one',
    two = 'two'
}

const socket = io();


//show login form; hide all other stuff
socket.on('input data', function () {
    console.log("input data called!");
    $("#gameDiv").hide();
    $("#loginDiv").show();
    $("#end1").hide();
    $("#turnData").hide();
});

//call 'add player' function at server with the input username
function safeData() {
    console.log('safeData called!');
    $("#loginDiv").hide();
    $("#gameDiv").show();
    $("#turnData").show();
    socket.emit('add player', $("#username"));
}

//safe client ID locally
socket.on('client data', function (identity: number) {
    playerNumber = identity;
    console.log('Client ID safed: ' + playerNumber);
});

//Game ends
socket.on('end', function (endNumber: number) {
    $("#gameFieldTable tr").remove();
    if (endNumber === 0) {
        console.log("Game over!: ${endNumber}");
    } else if (endNumber === 1) {
        console.log("Game ends! Something went wrong!");
        window.alert('Game ends! Something went wrong.');
    }
});

//outputs warning if there are already two players logged in
socket.on('too many', function () {
    console.log("Too many called");
    window.alert('Sorry! There are already two players logged in!');
});

//updates local game field; updates table at index.html
socket.on('updateGame', function (gameField: States[][]) {
    console.log("updateGame at client called!");
    gF = gameField;
    const table = $('#gameFieldTable');
    $("#gameFieldTable tr").remove();
    // Build 6 x 6 grid for battleground
    for (let row = 0; row < 6; row++) {
        const tr = $('<tr>');
        for (let column = 0; column < 6; column++) {
            $('<td onclick="tempSafeCoords(' + row + ', ' + column + ')">').addClass(gameField[row][column].toString()).attr('data-r', row).attr('data-c', column).appendTo(tr);
        }
        tr.appendTo(table);
    }
});

//safes the current clicked data table coordinates locally
function tempSafeCoords(x: number, y: number) {
    console.log('tempSafeCoords(x: ' + x + ', y: ' + y + ') called!');

    if (gF[x][y].toString() == 'neutral') {
        if (playerNumber === 1) {
            $('td[data-r=' + x + '][data-c=' + y + ']').removeClass('neutral').addClass('one');
        } else if (playerNumber === 2) {
            $('td[data-r=' + x + '][data-c=' + y + ']').removeClass('neutral').addClass('two');
        } else {
            window.alert('Unexpected ID failure!');
            socket.close();
        }

    } else {
        window.alert('Field already taken! Please choose another.');
    }
    currentX = x;
    currentY = y;

}

//sends turn data to server
function emitTurn() {
    console.log('emitTurn called!');
    socket.emit('turn', currentX, currentY, $("#fieldNr"), $("#dir"), playerNumber);
}