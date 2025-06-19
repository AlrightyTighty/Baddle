import React from 'react'

import styles from './IconSelection.module.css'
import { StaticImageData } from 'next/image'
import Image from 'next/image'

interface IconSelectionProps {
    setSelectedIcon: React.Dispatch<React.SetStateAction<number>>
    selectedIcon: number
    icons: StaticImageData[]
}

const IconSelection: React.FC<IconSelectionProps> = ({ setSelectedIcon, selectedIcon, icons }) => {
    return (
        <div className={styles['icon-choices']}>
            {icons.map((icon, index) => {
                return <button style={{ borderRadius: "10%", backgroundColor: (selectedIcon == index ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)") }} onClick={() => { setSelectedIcon(index) }} key={index} className={styles['icon-choice']}>
                    <Image src={icon} alt={`icon ${index}`} />
                </button>
            })}
        </div>
    )
}

export default IconSelection