import React from 'react'
import { Player } from './GameScreen'
import Image from 'next/image'
import Letter from './Letter';

import styles from "./PlayerListItem.module.css"

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

interface PlayerListItemProps {
    player: Player;
}

const PlayerListItem: React.FC<PlayerListItemProps> = ({ player }) => {
    return (
        <li className={styles['player-list-item']}>
            <Image alt="player-icon" className={styles["player-icon"]}
                src={icons[player.icon]}
            />
            <div className={styles["name-and-best-hint"]}>
                <p>
                    {player.name}
                </p>
                <div className={styles["best-guess-display"]}>
                    {player.bestGuessHint.map((val, index) => {
                        return <div key={index} style={{ width: "16%", aspectRatio: "1:1" }}>
                            <Letter letter="" color={val} key={index} />
                        </div>
                    })}
                </div>

            </div>
            <p className={styles["score-text"]}>
                {player.score}
            </p>
        </li>
    )
}

export default PlayerListItem