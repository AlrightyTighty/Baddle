import Image from 'next/image'
import React from 'react'
import { Player } from './GameScreen'
import styles from "./Winscreen.module.css"

import pi1 from '../../public/player_icons/pi1.png'
import pi2 from '../../public/player_icons/pi2.png'
import pi3 from '../../public/player_icons/pi3.png'
import pi4 from '../../public/player_icons/pi4.png'
import pi5 from '../../public/player_icons/pi5.png'
import pi6 from '../../public/player_icons/pi6.png'
import pi7 from '../../public/player_icons/pi7.png'
import pi8 from '../../public/player_icons/pi8.png'
import pi9 from '../../public/player_icons/pi9.png'
import pi10 from '../../public/player_icons/pi10.png'
import pi11 from '../../public/player_icons/fariha_icon.png'

const icons = [pi1, pi2, pi3, pi4, pi5, pi6, pi7, pi8, pi9, pi10, pi11]

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
                <Image alt={"player1-image"} src={icons[winner1.icon]} className={styles["dancing-image"]} />
            </div>
            <div className={styles["podium-position"] + " " + styles["second"]}>
                2
                <Image alt={"player2-image"} src={icons[winner2.icon]} className={styles["dancing-image"]} />
            </div>
            <div className={styles["podium-position"] + " " + styles["third"]}>
                3
                <Image alt={"player3-image"} src={icons[winner3.icon]} className={styles["dancing-image"]} />
            </div>
        </div>
    )
}

export default Winscreen