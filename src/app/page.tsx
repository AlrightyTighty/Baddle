import Image from "next/image";
import styles from "./page.module.css";

import baddle_icon from "../../public/baddle icon.png"
import yt_icon from "../../public/graphics/yt_logo.png"
import li_icon from "../../public/graphics/li_logo.png"

import UserInfoForm from "@/components/UserInfoForm";


export default function Home() {
  return (
    <>
      <Image className={styles['title-text']} src={baddle_icon} alt="baddle icon" />
      <UserInfoForm />
      <div className={styles['info-boxes']}>
        <div className={styles['how-to-play-box']}>
          <p className={styles['box-header']}>
            How To Play
          </p>
          <div style={{ width: "90%", margin: "auto" }}>
            Play Baddle as if it were a normal game of Wordle, but you gain points for guessing well.
            <br />
            <br />
            2 points for a green letter, 1 point for a yellow one. Getting the word will give you an extra 10 points per guess before the 6th guess (5th guess gives you +10, 4th gives you +20, etc).
            <br />
            <br />
            At the end of all your rounds, whoever has the most points wins.
          </div>


        </div>
        <div className={styles['updates-box']}>
          <p className={styles['box-header']}>
            Updates
          </p>
          v 1.0.0: Full Release!
          <br />
          <br />
          The game is now fully playable and representative of the true full game.
          <br />
          <br />
          Minor bugfixes relating to host issues and leaderboard display.
        </div>
        <div className={styles['socials-box']}>
          <p className={styles['box-header']}>
            Socials
          </p>
          <div className={styles['socials-list']}>
            <a href="https://www.youtube.com/@alrightytighty1572" target="blank">
              <Image src={yt_icon} alt="yt_icon" />
            </a>
            <a href="https://www.linkedin.com/in/alrightytighty/" target="blank">
              <Image src={li_icon} alt="li_icon" />
            </a>
            <p>
              {"msg me about anything you\'d like, i\'d love to talk"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
