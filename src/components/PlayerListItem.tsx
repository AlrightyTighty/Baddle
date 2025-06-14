import React from 'react'
import { Player } from './GameScreen'
import Letter from './Letter';

import styles from "./PlayerListItem.module.css"

interface PlayerListItemProps {
    player: Player;
}

const PlayerListItem: React.FC<PlayerListItemProps> = ({ player }) => {
    return (
        <li className={styles['player-list-item']}>
            <img className={styles["player-icon"]}
                src="https://cdn.discordapp.com/attachments/1371521144162619485/1378756011594092647/image.png?ex=683dc219&is=683c7099&hm=e33338add06cdb8ad4ffb28f30a0bb5283188e9abd33289d5e17d72a80329119&"
            />
            <div className={styles["name-and-best-hint"]}>
                <p>
                    {player.name}
                </p>
                <div className={styles["best-guess-display"]}>
                    {player.bestGuessHint.map((val, index) => {
                        return <div style={{ width: "16%", aspectRatio: "1:1" }}>
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