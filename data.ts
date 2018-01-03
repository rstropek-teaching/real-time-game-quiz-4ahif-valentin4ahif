//interface to safe playerdata
export interface IPlayer {
    id: number;
    username: string;
}

//interface to safe highscores 
export interface IList {
    player: IPlayer; //speichert den Spielernamen und die ID
    wins: number; //speichert die Anzahl der Gewinne
    fastestWin: number; //speichert die Anzahl der Züge bis zum Gewinn
}

//safes the two current players
export let currentPlayer: IPlayer[] = [
    { id: 0, username: 'default' }
];

//All Players get safed in this list
export const playerList: IPlayer[] = [
    { id: 1, username: 'vschuetz' }
];

//all highscores get safed in this list
export const highscores: IList[] = [
    { player: { id: playerList[0].id, username: playerList[0].username }, wins: 0, fastestWin: 0 }
];

//neutral=no player claimed this place
//one=player1 claimed this place
//two=player2 claimed this place
export enum States {
    neutral,
    one,
    two
}

export let gameField: States[][];
gameField = [];

for (let i = 0; i < 7; i++) {
    gameField[i] = Array(7);
    for (let j = 0; j < 7; j++) {
        gameField[i][j] = States.neutral;
    }
}