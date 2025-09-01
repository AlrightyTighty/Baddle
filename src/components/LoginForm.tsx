"use client"
import styles from "../components/LoginForm.module.css"

const LoginForm = () => {
    return (
        <form className={styles['login-form']}>
            <input type="text"
                className={styles["uif-text-input"]}
                name="username"
                placeholder="Username/Email" />
        </form>
    )
}

export default LoginForm;