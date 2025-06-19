'use client';

import React, { useEffect, useState } from 'react'
import GameScreen from './GameScreen'
import { useRouter } from 'next/navigation'
import HomeButtons from './HomeButtons';
import IconSelection from './IconSelection';

import pi1 from '../../public/player_icons/pi1.png'
import pi2 from '../../public/player_icons/pi2.png'
import pi3 from '../../public/player_icons/pi3.png'
import pi4 from '../../public/player_icons/pi4.png'
import pi5 from '../../public/player_icons/pi5.png'
import pi6 from '../../public/player_icons/pi6.png'
import pi7 from '../../public/player_icons/pi7.png'
import pi8 from '../../public/player_icons/pi8.png'

const icons = [pi1, pi2, pi3, pi4, pi5, pi6, pi7, pi8]

const GameAndButtons = () => {
    const [gameScreenVisible, setGameScreenVisible] = useState(false);
    const [loginInfo, setLoginInfo] = useState({ roomCode: "", makeRoom: false, name: "", icon: 0 })

    const [selectedIcon, setSelectedIcon] = useState(0);

    const router = useRouter();

    useEffect(() => {
        if (loginInfo.name != "" && (loginInfo.makeRoom || loginInfo.roomCode != "")) {
            loginInfo.icon = selectedIcon
            router.push("/play?name=" + loginInfo.name + `&icon=${selectedIcon}` + (loginInfo.makeRoom ? "&makeRoom=true" : `&roomCode=${loginInfo.roomCode}`));
        }
    });

    return (
        <>
            <HomeButtons setConnectionInfo={setLoginInfo} />
            <IconSelection setSelectedIcon={setSelectedIcon} icons={icons} selectedIcon={selectedIcon} />
        </>
    )
}

export default GameAndButtons