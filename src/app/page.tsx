import Image from "next/image";
import styles from "./page.module.css";

import baddle_icon from "../../public/baddle icon.png"

import GameBoard from "@/components/GameBoard";
import GameScreen from "@/components/GameScreen";
import GameAndButtons from "@/components/GameAndButtons";

export default function Home() {
  return (
    <main className={styles['page']}>
      <div className={styles['intro']}>
        <Image className={styles['title-text']} src={baddle_icon} alt={"Baddle Icon"} />
        <p className={styles['intro-text']}>
          Your favorite word game - with a competetive twist! Play wordle against your friends in real time! <br /> <br /> Create a lobby or join your friends with a room code to start playing!
        </p>
        <GameAndButtons />
      </div>
    </main>
  );
}
