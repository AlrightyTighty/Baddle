"use client"
import { useRouter } from "next/navigation";
import styles from "../components/LoginForm.module.css"
import React, { FormEvent, useEffect, useRef } from "react"

const LoginForm = () => {

    const usernameRef: React.RefObject<HTMLInputElement | null> = useRef(null);
    const passwordRef: React.RefObject<HTMLInputElement | null> = useRef(null);

    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("login") == "true") {
            router.push(
                `/me`
            );
        }
    })


    const login = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const usernameInput = usernameRef.current;
        const passwordInput = passwordRef.current;

        if (!usernameInput || !passwordInput)
            return;

        const usernameOrEmail = usernameInput.value;
        const password = passwordInput.value;

        const body = JSON.stringify({ usernameOrEmail, password });
        const result = await fetch("/api/auth", {
            method: "POST",
            body
        })

        if (result.status == 200) {
            localStorage.setItem("login", "true");
            router.push(
                `/me`
            );
        }

    }

    return (
        <form onSubmit={login} className={styles['login-form']}>
            <input ref={usernameRef}
                type="text"
                className={styles["lif-text-input"]}
                name="username"
                placeholder="Username/Email" />
            <input ref={passwordRef}
                type="password"
                className={styles["lif-text-input"]}
                name="password"
                placeholder="Password"
            />
            <input type="submit"
                className={styles["lif-submit"]}
                name="submit"
                value="LOGIN"
            />
        </form>
    )
}

export default LoginForm;