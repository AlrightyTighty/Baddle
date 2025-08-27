import Image from "next/image";
import styles from "./page.module.css";

import baddle_icon from "../../public/baddle icon.png";

import UserInfoForm from "@/components/UserInfoForm";

export default function Home() {
  return (
    <>
      <Image
        className={styles["title-text"]}
        src={baddle_icon}
        alt="baddle icon"
      />
      <UserInfoForm />
    </>
  );
}
