import * as express from "express";
import * as http from 'http';
import * as sio from 'socket.io';
import { playerList, highscores, IPlayer, IList, gameField, initGameField, States, currentPlayer, getCurrentPlayer } from './data';

const app = express();
const server = http.createServer(app);
const io = sio(server);

let oneOrTwo: number;
let counter: number;

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("User connected!");

    //Username input
    if (currentPlayer[0].username != 'default') {
        console.log('' || currentPlayer[0].username);
        switch (currentPlayer.length) {
            case 0 | 1:
                console.log("currentPlayer is 0 or 1!");
                socket.emit('input data');
                break;
            case 2:
                console.log("currentPlayer is bigger than 2!");
                socket.emit('too many');
        }
    } else if (currentPlayer[0].username == 'default') {
        console.log('' || currentPlayer[0].username);
        console.log("currentPlayer is on default!");
        io.emit('input data');
    }

    //START OF GAME
    initGameField();
    //io.emit('updateGame', gameField);

    //store username of client two times: one time for the list of players and another time for the storage of the current player
    socket.on('add player', function (username) {
        console.log("add player called! " || username);
        const newPlayer: IPlayer = {
            id: playerList.length + 1,
            username: username
        };
        playerList.push(newPlayer);
        currentPlayer.push(newPlayer);
        io.emit('client data', currentPlayer.length);
        console.log("safed playerdata!");

        //prepareGame();
    })

    //if one client disconnects, a error event sent to client
    socket.on('disconnect', function () {
        console.log("User disconnected");
        //TODO
        //update "currentPlayer"
        //set winner or disconnect with error
        io.emit("end", 1);
    });

    //update the game field and check if there is a winner
    socket.on('turn', function (x, y, fieldNumber, direction, playerID) {
        console.log("turn called!");
        //updateField(x, y, fieldNumber, direction, playerID);
        //checkWinner();
    });

    //send logged in player the gameField
    function prepareGame() {
        console.log('sending gameField for prepare');
        io.emit('updateGame', gameField);
    }
});

//update the gamefield: setting colors and turning the selected field
function updateField(x: number, y: number, fN: number, dir: number, ID: number) {
    console.log("updateField called!");
    //Abfrage ob Feld frei ist geschieht bereits beim Client!!!
    if (ID === currentPlayer[0].id) {
        gameField[x][y] = States.one;
        oneOrTwo = 1;
    } else if (ID === currentPlayer[1].id) {
        gameField[x][y] = States.two;
        oneOrTwo = 2;
    } else {
        console.log("Something messed up with the currentPlayers and their ID!");
    }

    turnField(fN, dir);
}

//turn the selected field arount 90 degrees in the selected direction
function turnField(fN: number, dir: number) {
    if (dir === 0) { //turn left

    } else if (dir === 1) { //turn right
        let x: number = 10;
        let y: number = 10;
        switch (fN) {
            case 1:
                x = 0;
                y = 0;
                break;
            case 2:
                x = 3;
                y = 0;
                break;
            case 3:
                x = 0;
                y = 3;
                break;
            case 4:
                x = 3;
                y = 3;
                break;
            default:
                console.log("Something messed up with the fieldNumber!");
        }
    }
}

//checks if a player has won the game
function checkWinner() {

}

//opens the server
server.listen(3000, function () {
    console.log('listening on *:3000');
});
