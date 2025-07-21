"use client"
import React, { useRef } from 'react'
import { useState } from 'react'

import styles from "./UserInfoForm.module.css"
import IconSelection from './IconSelection';
import { useRouter } from 'next/navigation';

const UserInfoForm = () => {

  let host = false;

  const [selectedIcon, setSelectedIcon] = useState(0);

  const usernameFieldRef = useRef<HTMLInputElement | null>(null);
  const codeFieldRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usernameFieldRef.current || !codeFieldRef.current) return;
    router.push(`/play?name=${usernameFieldRef.current.value}&makeRoom=${host}&roomCode=${codeFieldRef.current.value}&icon=${selectedIcon}`)
  }

  return (
    <form onSubmit={onFormSubmit} className={styles["user-info-form"]}>
      <input ref={usernameFieldRef} type="text" className={styles["uif-text-input"] + " " + styles["name-input"]} name="username" placeholder="Enter Username" />
      <IconSelection selectedIcon={selectedIcon} setSelectedIcon={setSelectedIcon} />
      <div className={styles["uif-code-input"]}>
        <input ref={codeFieldRef} type="text" className={styles["uif-text-input"] + " " + styles["code-input"]} name="code" placeholder="Enter Room Code" />
        <input type="submit" className={styles["code-submit"]} name="join" value="Join" />
      </div>
      <p className={styles["or-text"]}>
        Or
      </p>
      <input type="submit" onClick={() => { host = true }} className={styles["host-submit"]} name="host" value="Host" />
    </form>
  );
}

export default UserInfoForm