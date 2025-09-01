import styles from "./page.module.css"
import loginGraphic from "../../../public/graphics/login-icon.png"
import Image from "next/image";
import LoginForm from "../../components/LoginForm";

const page = () => {
  return <div className={styles['main-content']}>
    <Image src={loginGraphic} alt="login image" className={styles['login-image']} />
    <LoginForm />
  </div>
}

export default page;