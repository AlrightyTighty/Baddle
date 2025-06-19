import React from 'react'
import styles from "./HomeButtons.module.css"

interface ConnectionInfo {
    roomCode: string;
    makeRoom: boolean;
    name: string;
    icon: number;
}

interface HomeButtonsProps {
    setConnectionInfo: React.Dispatch<React.SetStateAction<ConnectionInfo>>
}

const HomeButtons: React.FC<HomeButtonsProps> = ({ setConnectionInfo }) => {

    let host = false;

    return (
        <div className='button-container'>
            <form className="join-form" action={(formData: FormData) => {
                const code = formData.get('room-code');
                const name = formData.get('name')?.toString();
                if (!name) return;
                if (host) {
                    setConnectionInfo({
                        roomCode: "",
                        makeRoom: true,
                        name: name
                    })
                    return;
                }
                if (!code) return;
                setConnectionInfo(
                    {
                        roomCode: code.toString(),
                        makeRoom: false,
                        name: name,
                        icon: 0
                    }
                );
            }}>
                <input type="text" className="name-field" name="name" />
                <input type="submit" className="join-button" value="Join Room" />
                <input type="text" name="room-code" className="room-code" />
                <input type="submit" onClick={() => { host = true }} value="Host Room" className="host-button" />
            </form>

        </div>
    )
}

export default HomeButtons