"use client";

import React, { useEffect, useState, useRef } from "react";
import GameBoard from "./GameBoard";
import useWebSocket from "react-use-websocket";
import styles from "./GameScreen.module.css";
import ServerMessage from "./ServerMessage";

interface Player {
  name: string,
  bestGuessHint: number[],
  isHost: boolean,
  uuid: string,
  score: number
}

interface GameOptions {
  roundLength: number,
  roomSize: number,
  allowLateJoin: boolean,
  numRounds: number
}

interface Game {
  started: boolean,
  code: string,
  options: GameOptions,
  time: number,
  roundsPlayed: number,
}

interface GameScreenProps {
  queryParams: { name: string; makeRoom: string; roomCode: string };
}

const GameScreen: React.FC<GameScreenProps> = ({ queryParams }) => {

  const WS_URL = "ws://localhost:3001";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: queryParams
  });

  const players = useRef([] as Player[]);
  const game = useRef({} as Game);
  const self = useRef(null as Player | null);

  const [hints, setHints] = useState([[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]);
  const [words, setWords] = useState(['', '', '', '', '', '']);

  const currentRow = useRef(0);
  const [currentWord, setCurrentWord] = useState("");

  const lastInterpretedMessage = useRef<any>({});

  const [serverMessages, setServerMessages] = useState<string[]>([]);

  words[currentRow.current] = currentWord;

  /* console.log("players: ");
   console.log(players);
   console.log("game: ");
   console.log(game);
   console.log("self: ");
   console.log(self);
   */


  // awesome!

  const removeMessage = () => {
    serverMessages.splice(0, 1)
    setServerMessages(serverMessages);
  }

  const displayServerMessage = (message: string) => {
    serverMessages.push(message);
    setServerMessages(serverMessages);
    setTimeout(removeMessage, 3000);
  }

  const handleMessage = (message: any) => {
    console.log("msg: ");
    console.log(message);
    if (message.id == 7) {
      players.current = message.players;
      if (self.current == null)
        self.current = message.players[message.players.length - 1];
      else
        self.current = message.players.filter((p: any) => {
          if (!self.current) return false;
          return p.uuid == self.current.uuid;
        })[0]
      game.current = message.game;
    }

    if (message.id == 1) {
      hints[currentRow.current] = message.hints;
      lastInterpretedMessage.current = message;
      setHints(hints);
      setWords(words);
      setCurrentWord("");
      currentRow.current += 1;
    }

    if (message.id == 8) {
      game.current.started = true;
      setHints([[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]]);
      setWords(['', '', '', '', '', '']);
      currentRow.current = 0;
      console.log("Game Starting!")
    }

    if (message.id == 9) {
      displayServerMessage(message.message);
    }

    lastInterpretedMessage.current = message;
  }

  if (lastJsonMessage && JSON.stringify(lastJsonMessage) != JSON.stringify(lastInterpretedMessage.current))
    handleMessage(lastJsonMessage);



  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!game.current.started) return;
      if (currentWord.length < 5 && event.key.length == 1 && /^[a-zA-Z]+$/.test(event.key)) {
        setCurrentWord(currentWord + event.key.toUpperCase());
      } else if (currentWord.length > 0 && event.key == "Backspace") {
        setCurrentWord(currentWord.substring(0, currentWord.length - 1));
      } else if (currentWord.length == 5 && event.key == "Enter") {
        sendJsonMessage({
          id: 0,
          guess: currentWord.toLowerCase()
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentWord]);

  const startGame = () => {
    sendJsonMessage({
      id: 3
    })
  }

  return (
    <>
    <div className={styles['game-screen']}>
      <GameBoard
        words={words}
        hints={hints}
      />
      {(self.current != null && self.current.isHost && !game.current.started) && <button onClick={startGame}> start </button>}
    </div>
    <div className={styles['server-message-box']}>
      {serverMessages.map((value) => {
        return <ServerMessage key={value} message={value}/>
      })}
    </div>
    </>
  );
};

export default GameScreen;
