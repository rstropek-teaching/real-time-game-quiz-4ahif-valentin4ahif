import * as express from "express";
import * as http from 'http';
import * as sio from 'socket.io';
import { playerList, highscores, IPlayer, IList, gameField, States, currentPlayer } from './data';

const app = express();
const server = http.createServer(app);
const io = sio(server);

let oneOrTwo: number;
let counter: number;

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    console.log("User connected!");

    if (currentPlayer.length != null) {
        switch (currentPlayer.length) {
            case 0 | 1:
                console.log("currentPlayer is 0 or 1!");
                socket.emit('input data');
                break;
            case 2:
                console.log("currentPlayer is bigger than 2!");
                socket.emit('too many');
        }
    } else if (currentPlayer.length == null) {
        console.log("currentPlayer is null!");
        io.emit('input data');
    }

    socket.on('add player', function (username) {
        console.log("add player called!");
        const newPlayer: IPlayer = {
            id: playerList.length + 1,
            username: username
        };
        playerList.push(newPlayer);
        currentPlayer.push(newPlayer);
        console.log("safed playerdata!");
    })

    socket.on('disconnect', function () {
        console.log("User disconnected");
        //currentPlayer aktualisieren
        //winner announcen
        io.emit("end", 1);
    });

    socket.on('turn', function (x, y, fieldNumber, direction, playerID) {
        console.log("turn called!");
        //updateField(x, y, fieldNumber, direction, playerID);
        //checkWinner();
    });
});

function updateField(x: number, y: number, fN: number, dir: number, ID: number) {
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

function turnField(fN: number, dir: number) {
    if (dir === 0) { //Linksdrehung

    } else if (dir === 1) { //Rechtsdrehung
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

        gameField[0][0] = States.one;
        gameField[1][1] = States.one;
        gameField[2][3] = States.one;
        gameField[4][0] = States.one;
        gameField[3][3] = States.one;

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                console.log("" + gameField[i][j].toString());
            }
        }
        gameField[0].map((col, i) => gameField.map(row => row[i]));
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                console.log("" + gameField[i][j].toString());
            }
        }
    }
}

function checkWinner() {

}

server.listen(3000, function () {
    console.log('listening on *:3000');
});
