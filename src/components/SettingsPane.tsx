import React from 'react'

import styles from './SettingsPane.module.css'

interface SettingsPane {
  onFormChanged: (event: React.ChangeEvent<HTMLInputElement>) => void,
  startGame: () => void,
  roomID: string,
}

const SettingsPane: React.FC<SettingsPane> = ({ onFormChanged, startGame, roomID }) => {
  return (
    <div className={styles["settings-pane"]}>
      <h1> Settings </h1>
      <form className={styles["settings-form"]}>
        <label htmlFor="num-rounds"> Number of Rounds </label> <input onChange={onFormChanged} type="number" name="num-rounds" defaultValue="3" />
        <div className={styles["flex-break"]}></div>
        <label htmlFor="round-length"> Round Length </label> <input onChange={onFormChanged} type="number" name="round-length" defaultValue="180" />
        <div className={styles["flex-break"]}></div>
        <label htmlFor="allow-late-join"> Allow late join </label> <input onChange={onFormChanged} type="checkbox" name="allow-late-join" />
        <div className={styles["flex-break"]}></div>
      </form>
      <div className={styles["centered-section"]}>
        <button className={styles["start-game-button"]} onClick={startGame}>Start Game</button>
        <p className={styles["room-id"]}> {roomID} </p>
      </div>
    </div>
  )
}

export default SettingsPane