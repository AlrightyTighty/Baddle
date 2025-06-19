import React from 'react'
import styles from './Keyboard.module.css'
import Letter from './Letter'

interface KeyboardProps {
  keys: { [letter: string]: number }
}

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

const Keyboard: React.FC<KeyboardProps> = ({ keys }) => {
  return (
    <div className={styles['keyboard']}>
      {ROWS.map((row, index) => {
        return <div key={"row" + index} className={styles['keyboard-row']}>
          {row.split('').map((letter, index) => {
            return <div key={letter} className={styles['key']}>
              <Letter key={letter} letter={letter} color={keys[letter]} />
            </div>
          })}
        </div>
      })}
    </div>
  )
}

export default Keyboard