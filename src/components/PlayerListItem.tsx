import React from "react";
import { Player } from "./GameScreen";
import Image from "next/image";
import Letter from "./Letter";

import styles from "./PlayerListItem.module.css";

import { icons } from "./IconSelection";

interface PlayerListItemProps {
  player: Player;
}

const PlayerListItem: React.FC<PlayerListItemProps> = ({ player }) => {
  return (
    <li className={styles["player-list-item"]}>
      <Image
        alt="player-icon"
        className={styles["player-icon"]}
        src={icons[player.icon]}
      />
      <div className={styles["name-and-best-hint"]}>
        <p>{player.name}</p>
        <div className={styles["best-guess-display"]}>
          {player.bestGuessHint.map((val, index) => {
            return (
              <div key={index} style={{ width: "15%", aspectRatio: "1" }}>
                <Letter letter="" color={val} key={index} />
              </div>
            );
          })}
        </div>
      </div>
      <p className={styles["score-text"]}>{player.score}</p>
    </li>
  );
};

export default PlayerListItem;
