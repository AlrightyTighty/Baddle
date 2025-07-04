import React, { FC, useEffect, useRef } from "react";
import styles from "./Chatbar.module.css";

interface ChatbarProps {
    messages: string[];
    toggleChatbarActive: (isActive: boolean) => void;
    sendMessage: (msg: string) => void;
}

const Chatbar: FC<ChatbarProps> = ({ messages, toggleChatbarActive, sendMessage }) => {

    const isTyping = useRef(false);
    const form = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isTyping.current && event.key == "Enter" && form.current) {
                form.current.requestSubmit()
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isTyping, form])

    return (
        <div className={styles["chatbox"]}>
            <div className={styles["chat-messages"]}>
                {messages.map((msgText, index) => {
                    return <p key={index} className={styles["chat-message"]}>{msgText}</p>;
                })}
            </div>
            <form ref={form} className={styles["chat-message-entry"]} action={
                (formData: FormData) => {
                    const val = formData.get('messageInput');
                    if (!val) return
                    sendMessage(val.toString())
                }
            }>
                <input
                    autoComplete="off"
                    name="messageInput"
                    type="text"
                    className={styles["message-entry-box"]}
                    placeholder="Send a message here"
                    onFocus={() => {
                        isTyping.current = true;
                        toggleChatbarActive(true);
                    }}
                    onBlur={() => {
                        isTyping.current = false;
                        toggleChatbarActive(false);
                    }}
                />
            </form>
        </div>
    );
};

export default Chatbar;
