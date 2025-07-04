"use client"

import GameScreen from "@/components/GameScreen";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Game() {

  const game_info = useSearchParams();
  const router = useRouter();

  let makeRoom = game_info.get('makeRoom');
  let roomCode = game_info.get('roomCode');
  const name = game_info.get('name');
  const icon = game_info.get('icon');

  if (!name || (!roomCode && !makeRoom) || !icon || Number.isNaN(parseInt(icon))) {
    router.push("/");
    return;
  }

  if (!roomCode)
    roomCode = "";

  if (!makeRoom)
    makeRoom = "";

  return (
    <main>
      <GameScreen queryParams={{ name: name, roomCode: roomCode, makeRoom: makeRoom, selectedIcon: parseInt(icon) }} />
    </main>
  );
}

export default function GamePage() {
  <Suspense>
    <Game />
  </Suspense>
}