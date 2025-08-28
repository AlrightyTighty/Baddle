import Image from "next/image";
import styles from "./page.module.css";

import baddle_icon from "../../public/baddle icon.png";
import account_icon from "../../public/graphics/usericon.png";
import info_icon from "../../public/graphics/info icon.png";

import UserInfoForm from "@/components/UserInfoForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles["home-page"]}>
      <Image
        className={styles["title-text"]}
        src={baddle_icon}
        alt="baddle icon"
      />
      <UserInfoForm />
      <div className={styles["menu-icons"]}>
        <Link href="/me">
          <Image src={account_icon} alt="User icon" />
        </Link>
        <Link href="/about">
          <Image src={info_icon} alt="Info icon" />
        </Link>
      </div>
    </div>
  );
}
