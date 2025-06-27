import React from 'react'
import { Player } from './GameScreen';
import PlayerListItem from './PlayerListItem';
import styles from './PlayerList.module.css';

interface PlayerListProps {
    players: Player[];
}


const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
    return (
        <ul className={styles['player-list']}>
            {players.map((player) => {
                return <PlayerListItem player={player} />
            })}
        </ul>
    )
}

export default PlayerList