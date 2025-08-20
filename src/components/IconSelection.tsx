'use client'

import React from 'react'

import styles from './IconSelection.module.css'
import Image from 'next/image'

import arrow_img from '../../public/graphics/arrow image.png'

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
import pi12 from '../../public/player_icons/cutze.gif'
import pi13 from '../../public/player_icons/potato.png'

export const icons = [pi1, pi2, pi3, pi4, pi5, pi6, pi7, pi8, pi9, pi10, pi11, pi12, pi13]

interface IconSelectionProps {
    selectedIcon: number;
    setSelectedIcon: React.Dispatch<React.SetStateAction<number>>;
}

const IconSelection: React.FC<IconSelectionProps> = ({ selectedIcon, setSelectedIcon }) => {
    return (
        <div className={styles['icon-selector']}>
            <div style={{ margin: "auto", width: "fit-content", height: "100%" }}>
                <Image onClick={() => { if (selectedIcon > 0) setSelectedIcon(selectedIcon - 1) }} src={arrow_img} alt="Choose previous icon" />
                <Image src={icons[selectedIcon]} alt={`Currently selecting icon: ${selectedIcon}`} className={styles['selected-icon']} />
                <Image onClick={() => { if (selectedIcon < 7) setSelectedIcon(selectedIcon + 1) }} src={arrow_img} alt="Choose next icon" style={{ transform: "scaleX(-1)" }} />
            </div>
        </div>
    )
}

export default IconSelection