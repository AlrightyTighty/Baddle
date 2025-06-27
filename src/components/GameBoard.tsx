import React from "react";
import Letter from "./Letter";

import styles from "./GameBoard.module.css"

interface GameBoardProps {
  words: string[];
  hints: number[][];
}

const GameBoard: React.FC<GameBoardProps> = ({ words, hints }) => {
  return (
    <div className={styles['game-board']}>
      {words.map((word, row) => {
        if (row > 5) return false
        return word.padEnd(5, " ").split("").map((char, col) => {
          return (
            <div className="grid-letter-container">
              <Letter key={"" + row + col} color={hints[row][col]} letter={char} />
            </div>
          );
        });
      })}
    </div>
  );
};

export default GameBoard;
