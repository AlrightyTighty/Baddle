import React from 'react'
import styles from './ServerMessage.module.css'

interface ServerMessageProps {
    message: string
}

const ServerMessage: React.FC<ServerMessageProps> = ({ message }) => {
    return (
        <div className={styles['message-box']}>
            <p>
                {message}
            </p>
        </div>
    )
}

export default ServerMessage