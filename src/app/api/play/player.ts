import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";
import { Game } from "./game";

export const HintStatus = {
  UNKNOWN: 0,
  UNUSED: 1,
  KNOWN: 2,
  SOLVED: 4,
};

export class Player {
  static Players: { [uuid: string]: Player } = {};
  name: string;
  socket: WebSocket;
  guesses: string[];
  bestGuessScore: number;
  score: number;
  bestGuessHint: number[];
  game: Game;
  isHost: boolean;
  uuid: string;
  hints: number[][];
  canGuess: boolean;
  icon: number;
  hasAccount: boolean;

  constructor(name: string, socket: WebSocket, game: Game, isHost: boolean, icon: number, hasAccount = false) {
    this.name = name;
    this.socket = socket;
    this.guesses = [];
    this.bestGuessScore = 0;
    this.score = 0;
    this.bestGuessHint = [HintStatus.UNKNOWN, HintStatus.UNKNOWN, HintStatus.UNKNOWN, HintStatus.UNKNOWN, HintStatus.UNKNOWN];
    this.game = game;
    this.isHost = isHost;
    this.uuid = uuidv4();
    this.hints = [];
    this.canGuess = false;
    this.icon = icon;
    this.hasAccount = hasAccount;
    Player.Players[this.uuid] = this;
  }

  clearRoundData() {
    this.guesses = [];
    this.bestGuessScore = 0;
    this.bestGuessHint = [HintStatus.UNKNOWN, HintStatus.UNKNOWN, HintStatus.UNKNOWN, HintStatus.UNKNOWN, HintStatus.UNKNOWN];
    this.hints = [];
  }

  scoreHints(hint: number[]) {
    let score = 0;
    hint.forEach((element) => {
      score += Math.floor(element / 2);
    });
    if (score > this.bestGuessScore) {
      this.bestGuessScore = score;
      this.bestGuessHint = hint;
    }
    return score;
  }

  makeGuess(guess: string) {
    if (!this.canGuess) return;
    const newHint = this.game.guessDifference(guess);
    this.hints.push(newHint);
    const newScore = this.scoreHints(newHint);
    this.score += newScore;
    const correct = JSON.stringify(newHint) == JSON.stringify([4, 4, 4, 4, 4]);
    if (correct) {
      this.score += 10 * (6 - this.hints.length);
      this.game.playerFinishedRound(this, true);
    } else if (this.hints.length == 6) {
      this.game.playerFinishedRound(this, false);
    }

    this.game.fireAllClients(
      JSON.stringify({
        id: 5,
        uuid: this.uuid,
        player: this.getPublicInfo(),
      })
    );
    this.game.fireClient(
      this,
      JSON.stringify({
        id: 6,
        hints: this.hints,
        canGuess: this.canGuess,
      })
    );
    this.game.fireClient(
      this,
      JSON.stringify({
        id: 1,
        guess: guess,
        hints: newHint,
        correct: correct,
      })
    );
  }

  getPublicInfo() {
    return { name: this.name, bestGuessHint: this.bestGuessHint, isHost: this.isHost, uuid: this.uuid, score: this.score, icon: this.icon };
  }
}
