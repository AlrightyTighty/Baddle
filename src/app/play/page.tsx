"use client"

import Image from "next/image";
import styles from "./page.module.css";

import GameScreen from "@/components/GameScreen";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";


export default function Game() {

  const game_info = useSearchParams();
  const router = useRouter();

  let makeRoom = game_info.get('makeRoom');
  let roomCode = game_info.get('roomCode');
  const name = game_info.get('name');

  if (!name || (!roomCode && !makeRoom)) {
    router.push("/");
    return;
  }

  if (!roomCode)
    roomCode = "";

  if (!makeRoom)
    makeRoom = "";

  return (
    <main>
      <GameScreen queryParams={{ name: name, roomCode: roomCode, makeRoom: makeRoom }} />
    </main>
  );
}
