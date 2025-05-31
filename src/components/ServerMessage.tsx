import React from 'react'

interface ServerMessageProps {
    message: string
}

const ServerMessage: React.FC<ServerMessageProps> = ({ message }) => {
    return (
        <div className="message-box">
            <p>
                {message}
            </p>
        </div>
    )
}

export default ServerMessage