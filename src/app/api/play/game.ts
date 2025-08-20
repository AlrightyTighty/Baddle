import { parse } from "papaparse";
import { Player } from "./player";

import fs from "fs";
import { HintStatus } from "./player";

export class Game {
  static activeRoomCodes: string[] = [];
  static activeGames: { [id: string]: Game } = {};

  static makeRoomCode = () => {
    const chars: number[] = [];

    do {
      for (let i = 0; i < 5; i++) {
        chars[i] = Math.round(Math.random() * 25) + 65;
      }
    } while (Game.activeRoomCodes.includes(String.fromCharCode(...chars)));
    return String.fromCharCode.apply(this, chars);
  };

  started: boolean;
  players: Player[];
  word: string;
  wordOccurrences: { [letter: string]: number };
  roundsPlayed: number;
  code: string;
  options: GameOptions;
  host: Player | null;
  time: number;
  timeout: NodeJS.Timeout | null;

  constructor() {
    this.started = false;
    this.players = [];
    this.word = "";
    this.wordOccurrences = {};
    this.roundsPlayed = 0;
    this.code = Game.makeRoomCode();
    this.options = new GameOptions();
    this.host = null;
    this.time = 0;
    this.timeout = null;
    Game.activeGames[this.code] = this;
    Game.activeRoomCodes.push(this.code);
  }

  guessDifference(guess: string) {
    const occurances = Object.assign({}, this.wordOccurrences);
    console.log(occurances);
    const output = [];
    for (let i = 0; i < 5; i++) {
      if (guess[i] == this.word[i]) {
        output[i] = HintStatus.SOLVED;
        occurances[guess[i]] -= 1;
      }
    }

    console.log(occurances);

    for (let i = 0; i < 5; i++) {
      if (guess[i] == this.word[i]) continue;
      if (occurances[guess[i]] != null && occurances[guess[i]] > 0) {
        output[i] = HintStatus.KNOWN;
        occurances[guess[i]] -= 1;
      } else {
        output[i] = HintStatus.UNUSED;
      }
    }
    return output;
  }

  getAllInfoPacket() {
    return {
      id: 7,
      players: this.players.map((player) => {
        return player.getPublicInfo();
      }),
      game: this.getPublicGameInfo(),
    };
  }

  getPublicGameInfo() {
    return { started: this.started, code: this.code, options: this.options, time: this.time, roundsPlayed: this.roundsPlayed };
  }

  fireClient(player: Player, packet: string) {
    player.socket.send(packet);
  }

  fireClients(players: Player[], packet: string) {
    players.forEach((player) => {
      this.fireClient(player, packet);
    });
  }

  fireAllClients(packet: string) {
    this.fireClients(this.players, packet);
  }

  // only allowing 5-letter words atm.
  static getRandomWord() {
    const wordsFile = fs.readFileSync(`${process.cwd()}/words.csv`, "utf-8");

    const data = parse<string>(wordsFile, {});
    return data.data[Math.round(Math.random() * data.data.length)];
  }

  // updates the started flag, sends all players a new round packet

  start() {
    this.started = true;
    this.startRound();
  }

  setWord() {
    this.word = Game.getRandomWord()[0];
    this.wordOccurrences = {};
    for (const char of this.word) {
      if (this.wordOccurrences[char]) this.wordOccurrences[char] += 1;
      else this.wordOccurrences[char] = 1;
    }
    console.log(this.word);
    console.log(this.wordOccurrences);
    this.timeout = setTimeout(this.endRound.bind(this), this.options.roundLength * 1000);
  }

  endRound() {
    if (!this.timeout) return;
    clearTimeout(this.timeout);
    this.timeout = null;
    this.fireAllClients(
      JSON.stringify({
        id: 9,
        message: "Round over! Setting up for next round...",
      })
    );
    setTimeout(this.startRound.bind(this), 3000);
  }

  playerFinishedRound(player: Player, won: boolean) {
    player.canGuess = false;
    const message = won ? `${player.name} has guessed the word in ${player.hints.length} guesses!` : `${player.name} failed to guess the word in 6 guesses.`;

    this.fireAllClients(
      JSON.stringify({
        id: 9,
        message: message,
      })
    );

    for (const player of this.players) {
      if (player.canGuess) return;
    }

    this.endRound();
  }

  startRound() {
    this.players.forEach((player) => {
      player.clearRoundData();
    });

    this.roundsPlayed++;

    if (this.roundsPlayed > this.options.numRounds) {
      this.started = false;
      this.roundsPlayed = 0;
      this.players.forEach((player) => {
        player.score = 0;
      });
      this.fireAllClients(JSON.stringify({ id: 10 }));
      this.fireAllClients(JSON.stringify(this.getAllInfoPacket()));

      return;
    }

    this.players.forEach((player) => {
      player.canGuess = true;
    });

    this.setWord();

    this.fireAllClients(JSON.stringify({ id: 8 }));
  }

  removePlayer(player: Player) {
    this.players = this.players.filter((p) => p != player);
    if (player.isHost && this.players.length > 0) {
      this.host = this.players[0];
      this.players[0].isHost = true;
    }
    delete Player.Players[player.uuid];

    this.fireAllClients(JSON.stringify(this.getAllInfoPacket()));

    if (this.players.length == 0) {
      this.closeRoom();
    }
  }

  closeRoom() {
    if (this.timeout) clearTimeout(this.timeout);

    delete Game.activeGames[this.code];
    Game.activeRoomCodes = Game.activeRoomCodes.filter((c) => c != this.code);
  }
}

export class GameOptions {
  roundLength: number;
  roomSize: number;
  allowLateJoin: boolean;
  numRounds: number;

  constructor() {
    this.roundLength = 180;
    this.roomSize = 10;
    this.allowLateJoin = false;
    this.numRounds = 3;
  }
}
