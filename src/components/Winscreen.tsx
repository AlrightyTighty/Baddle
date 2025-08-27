import Image from "next/image";
import React from "react";
import { Player } from "./GameScreen";
import styles from "./Winscreen.module.css";

import { icons } from "./IconSelection";

interface WinscreenProps {
  winner1: Player;
  winner2: Player;
  winner3: Player;
}

const Winscreen: React.FC<WinscreenProps> = ({ winner1, winner2, winner3 }) => {
  return (
    <div className={styles["podium-panel"]}>
      <div className={styles["podium-position"] + " " + styles["first"]}>
        1
        <Image
          alt={"player1-image"}
          src={icons[winner1.icon]}
          className={styles["dancing-image"]}
        />
      </div>
      <div className={styles["podium-position"] + " " + styles["second"]}>
        2
        <Image
          alt={"player2-image"}
          src={icons[winner2.icon]}
          className={styles["dancing-image"]}
        />
      </div>
      <div className={styles["podium-position"] + " " + styles["third"]}>
        3
        <Image
          alt={"player3-image"}
          src={icons[winner3.icon]}
          className={styles["dancing-image"]}
        />
      </div>
    </div>
  );
};

export default Winscreen;
