"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import styles from "./page.module.css"

export default function GamePage() {

  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("login") != "true")
      router.push("/login");
  })

  return (
    <div className=""> me screen! </div>
  );
}
