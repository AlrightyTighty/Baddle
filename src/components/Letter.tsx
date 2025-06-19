import React from "react";

import styles from "./Letter.module.css";

interface LetterProps {
    letter: string;
    color: number;
}

const COLORS = ["#5b5e80", "#404253", "#CDCD2E", "#49BA56", "#49BA56"];

const Letter: React.FC<LetterProps> = ({ letter, color }) => {
    return (
        <div className={styles['letter']} style={{ backgroundColor: COLORS[color] }}>
            <p>{letter}</p>
        </div>
    );
};

export default Letter;
