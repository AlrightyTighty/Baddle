'use client';

import React, { useEffect, useState } from 'react'
import GameScreen from './GameScreen'
import { useRouter } from 'next/navigation'
import HomeButtons from './HomeButtons';

const GameAndButtons = () => {
    const [gameScreenVisible, setGameScreenVisible] = useState(false);
    const [loginInfo, setLoginInfo] = useState({ roomCode: "", makeRoom: false, name: "" })

    const router = useRouter();

    useEffect(() => {
        if (loginInfo.name != "" && (loginInfo.makeRoom || loginInfo.roomCode != "")) {
            router.push("/play?name=" + loginInfo.name + (loginInfo.makeRoom ? "&makeRoom=true" : `&roomCode=${loginInfo.roomCode}`));
        }
    });

    return (
        <>
            <HomeButtons setConnectionInfo={setLoginInfo} />
        </>
    )
}

export default GameAndButtons