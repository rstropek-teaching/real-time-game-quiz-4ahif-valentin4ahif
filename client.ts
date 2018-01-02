declare const io: SocketIOStatic;
const socket = io();

socket.on('input data', function () {
    console.log("input data called!");
    $("#outerDiv").load("login.html");
});

function safeData() {
    socket.emit('add player', $("#username"));
}

socket.on('end', function (endNumber: number) {
    if (endNumber === 0) {
        console.log("Game over!: ${endNumber}");
    } else if (endNumber === 1) {
        console.log("Game ends! Something went wrong!");
    }
});

socket.on('too many', function () {
    console.log("Too many called");
    $("#outerDiv").load("tooManyPlayer.html");
});



//socket.emit('turn', 2, 0, 1, 1, 1);