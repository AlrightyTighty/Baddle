"use client";

import React, { useEffect, useState, useRef } from "react";
import GameBoard from "./GameBoard";
import useWebSocket from "react-use-websocket";
import styles from "./GameScreen.module.css";
import ServerMessage from "./ServerMessage";
import PlayerList from "./PlayerList";
import Keyboard from "./Keyboard";
import Chatbar from "./Chatbar";
import SettingsPane from "./SettingsPane";

export interface Player {
  name: string;
  bestGuessHint: number[];
  isHost: boolean;
  uuid: string;
  score: number;
  icon: number;
}

interface GameOptions {
  roundLength: number;
  roomSize: number;
  allowLateJoin: boolean;
  numRounds: number;
}

interface Game {
  started: boolean;
  code: string;
  options: GameOptions;
  time: number;
  roundsPlayed: number;
}

interface GameScreenProps {
  queryParams: { name: string; makeRoom: string; roomCode: string; selectedIcon: number };
}

const test_keyboard: { [key: string]: number } = {};

for (const letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  test_keyboard[letter] = Math.round(0);
}

const GameScreen: React.FC<GameScreenProps> = ({ queryParams }) => {
  const WS_URL = "ws://localhost:3001";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: queryParams,
  });

  const [keyStates, setKeyStates] = useState(test_keyboard);
  const players = useRef([] as Player[]);
  const game = useRef({} as Game);
  const self = useRef(null as Player | null);

  const [hints, setHints] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const [words, setWords] = useState(["", "", "", "", "", ""]);

  const currentRow = useRef(0);
  const [currentWord, setCurrentWord] = useState("");

  const lastInterpretedMessage = useRef<any>({});

  const [serverMessages, setServerMessages] = useState<string[]>([]);

  words[currentRow.current] = currentWord;

  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const isTyping = useRef(false);

  /* console.log("players: ");
   console.log(players);
   console.log("game: ");
   console.log(game);
   console.log("self: ");
   console.log(self);
   */

  // awesome!

  const removeMessage = (messages: string[]) => {
    const newMessages = [...messages];
    newMessages.splice(0, 1);
    return newMessages;
  };

  const displayServerMessage = (message: string) => {
    serverMessages.push(message);
    setServerMessages(serverMessages);
    setTimeout(() => {
      setServerMessages((serverMessages) => removeMessage(serverMessages));
    }, 3000);
  };

  const sendChatMessage = (message: string) => {
    sendJsonMessage({ id: 4, message: message });
  };

  const handleMessage = (message: any) => {
    // console.log("msg: ");
    // console.log(message);
    if (message.id == 5) {
      const playerIndex = players.current.findIndex((player) => player.uuid == message.uuid);
      const newPlayers = [...players.current];
      newPlayers[playerIndex] = message.player;
      players.current = newPlayers;
    }

    if (message.id == 7) {
      players.current = message.players;
      if (self.current == null) self.current = message.players[message.players.length - 1];
      else
        self.current = message.players.filter((p: any) => {
          if (!self.current) return false;
          return p.uuid == self.current.uuid;
        })[0];
      game.current = message.game;
    }

    if (message.id == 1) {
      hints[currentRow.current] = message.hints;
      lastInterpretedMessage.current = message;
      setHints(hints);
      setWords(words);
      setCurrentWord("");
      for (let i = 0; i < 5; i++) {
        keyStates[message.guess[i].toUpperCase()] = message.hints[i] > keyStates[message.guess[i].toUpperCase()] ? message.hints[i] : keyStates[message.guess[i].toUpperCase()];
      }

      setKeyStates(keyStates);
      currentRow.current += 1;
    }

    if (message.id == 8) {
      if (!players.current) return;
      game.current.started = true;
      setHints([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ]);
      setWords(["", "", "", "", "", ""]);
      setKeyStates(Object.assign({}, test_keyboard));
      for (const player of players.current) player.bestGuessHint = [0, 0, 0, 0, 0];
      currentRow.current = 0;
      displayServerMessage("Round Starting!");
    }

    if (message.id == 9) {
      displayServerMessage(message.message);
    }

    if (message.id == 4) {
      console.log("Received message: " + message);
      const newChatMessages = [...chatMessages];
      const playerWhoAdded = players.current.find((player) => player.uuid == message.uuid);

      newChatMessages.unshift(playerWhoAdded?.name + ": " + message.message);
      setChatMessages(newChatMessages);
    }

    if (message.id == 2) {
      game.current.options = message.options
      message.options = {}
    }

    lastInterpretedMessage.current = message;
  };

  if (lastJsonMessage && JSON.stringify(lastJsonMessage) != JSON.stringify(lastInterpretedMessage.current)) handleMessage(lastJsonMessage);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!game.current.started || isTyping.current) return;
      if (currentWord.length < 5 && event.key.length == 1 && /^[a-zA-Z]+$/.test(event.key)) {
        setCurrentWord(currentWord + event.key.toUpperCase());
      } else if (currentWord.length > 0 && event.key == "Backspace") {
        setCurrentWord(currentWord.substring(0, currentWord.length - 1));
      } else if (currentWord.length == 5 && event.key == "Enter") {
        sendJsonMessage({
          id: 0,
          guess: currentWord.toLowerCase(),
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentWord, isTyping]);

  const startGame = () => {
    sendJsonMessage({
      id: 3,
    });
  };

  const onSettingsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Settings Changed!")
    const newSettings: GameOptions = game.current.options
    if (event.target.name == "num-rounds")
      newSettings.numRounds = parseInt(event.target.value)
    else if (event.target.name == "round-length")
      newSettings.roundLength = parseInt(event.target.value)
    else
      newSettings.allowLateJoin = event.target.checked

    sendJsonMessage({ id: 2, options: newSettings });

  }

  return (
    <>
      {self.current && self.current.isHost && !game.current.started && <SettingsPane roomID={game.current.code} onFormChanged={onSettingsChanged} startGame={startGame} />}
      <div className={styles["game-screen"]}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", width: "520px", gap: "60px", marginTop: "80px" }}>
          <GameBoard words={words} hints={hints} />
          <Keyboard keys={keyStates} />
        </div>
        {self.current != null && self.current.isHost && !game.current.started && <button onClick={startGame}> start </button>}
      </div>
      <div className={styles["chat-message-area"]}>
        <Chatbar
          messages={chatMessages}
          toggleChatbarActive={(canType) => {
            isTyping.current = canType;
          }}
          sendMessage={sendChatMessage}
        />
      </div>
      <div className={styles["server-message-box"]}>
        {serverMessages.map((value) => {
          return <ServerMessage key={value} message={value} />;
        })}
      </div>
      <PlayerList players={players.current} />
    </>
  );
};

export default GameScreen;
