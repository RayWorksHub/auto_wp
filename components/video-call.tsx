"use client"

import { useEffect, useRef, useState } from "react"
import { Icon } from "@/components/icons"
import { initials } from "@/lib/utils"

type Phase = "connecting" | "connected" | "ended"

const OPERATOR = {
  name: "Nagy Anna",
  role: "Ügyfélszolgálati operátor",
  photo: "/support/operator.png",
}

function fmt(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0")
  const s = (total % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

/**
 * Simulated operator video call. This is a faithful UI imitation of a live
 * support call — it does NOT access the real camera or microphone, so no browser
 * permission prompts appear. The remote feed is a static operator portrait and
 * the flow runs on timers to feel like a real connection.
 */
export function VideoCall({
  topic,
  userName,
  onClose,
}: {
  topic: string
  userName: string
  onClose: () => void
}) {
  const [phase, setPhase] = useState<Phase>("connecting")
  const [seconds, setSeconds] = useState(0)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [speaking, setSpeaking] = useState(false)
  const connectTimer = useRef<number | null>(null)

  // Connecting -> connected after a short, realistic delay.
  useEffect(() => {
    connectTimer.current = window.setTimeout(() => setPhase("connected"), 3600)
    return () => {
      if (connectTimer.current) window.clearTimeout(connectTimer.current)
    }
  }, [])

  // Call timer + a gentle "operator is speaking" pulse while connected.
  useEffect(() => {
    if (phase !== "connected") return
    const tick = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    const talk = window.setInterval(() => setSpeaking((v) => !v), 2200)
    return () => {
      window.clearInterval(tick)
      window.clearInterval(talk)
    }
  }, [phase])

  // Lock background scroll while the call overlay is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const endCall = () => setPhase("ended")

  const selfView = (
    <div className="absolute bottom-24 right-4 z-20 h-32 w-24 overflow-hidden rounded-2xl border-2 border-white/15 bg-zinc-800 shadow-xl sm:bottom-28 sm:right-6 sm:h-40 sm:w-32">
      {camOn ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/70 to-primary-dark/80">
          <span className="text-lg font-bold text-white sm:text-2xl">{initials(userName)}</span>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-zinc-900 text-zinc-400">
          <Icon.videoOff width={20} height={20} />
          <span className="text-[10px]">Kamera ki</span>
        </div>
      )}
      <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-medium text-white/90">Ön</span>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950 text-white" role="dialog" aria-modal="true" aria-label="Videóhívás">
      {/* ===== CONNECTING ===== */}
      {phase === "connecting" && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="relative mb-6">
            <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-primary/30" />
            <span className="absolute inset-0 -m-6 animate-pulse rounded-full bg-primary/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={OPERATOR.photo || "/placeholder.svg"}
              alt=""
              className="relative h-28 w-28 rounded-full object-cover opacity-90 ring-4 ring-white/10"
            />
          </div>
          <p className="text-sm font-medium text-primary">Kapcsolódás…</p>
          <h2 className="mt-1 font-display text-2xl font-bold">Szabad operátort keresünk</h2>
          <p className="mt-2 max-w-sm text-pretty text-sm text-zinc-400">
            Egy munkatársunk pár másodpercen belül csatlakozik, hogy segítsen ebben: <br />
            <span className="font-medium text-zinc-200">{topic}</span>
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/70 [animation-delay:-0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-white/70" />
          </span>
          <button
            onClick={onClose}
            className="mt-10 flex items-center gap-2 rounded-full bg-danger px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            <Icon.phoneOff width={18} height={18} />
            Hívás megszakítása
          </button>
        </div>
      )}

      {/* ===== CONNECTED ===== */}
      {phase === "connected" && (
        <>
          {/* Remote (operator) feed */}
          <div className="relative flex-1 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={OPERATOR.photo || "/placeholder.svg"} alt="Operátor videóképe" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />

            {/* Top bar */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-6">
              <div className="flex items-center gap-3 rounded-full bg-black/40 py-1.5 pl-1.5 pr-4 backdrop-blur">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={OPERATOR.photo || "/placeholder.svg"} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{OPERATOR.name}</p>
                  <p className="text-[11px] text-zinc-300">{OPERATOR.role}</p>
                </div>
                {speaking && (
                  <span className="ml-1 flex items-end gap-0.5" aria-hidden>
                    <span className="h-2 w-1 animate-pulse rounded-full bg-success" />
                    <span className="h-3.5 w-1 animate-pulse rounded-full bg-success [animation-delay:-0.15s]" />
                    <span className="h-2.5 w-1 animate-pulse rounded-full bg-success [animation-delay:-0.3s]" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="tabular-nums">{fmt(seconds)}</span>
              </div>
            </div>

            {/* Live subtitle-ish helper */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
              <p className="max-w-md rounded-2xl bg-black/45 px-4 py-2 text-center text-xs text-zinc-100 backdrop-blur">
                Az operátor látja a képernyőmegosztási kérését. Téma: <span className="font-medium">{topic}</span>
              </p>
            </div>

            {selfView}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 bg-zinc-950 px-4 py-5">
            <button
              onClick={() => setMicOn((v) => !v)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                micOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-zinc-900"
              }`}
              aria-pressed={!micOn}
              aria-label={micOn ? "Mikrofon némítása" : "Némítás feloldása"}
            >
              {micOn ? <Icon.mic width={22} height={22} /> : <Icon.micOff width={22} height={22} />}
            </button>
            <button
              onClick={() => setCamOn((v) => !v)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                camOn ? "bg-white/10 text-white hover:bg-white/20" : "bg-white text-zinc-900"
              }`}
              aria-pressed={!camOn}
              aria-label={camOn ? "Kamera kikapcsolása" : "Kamera bekapcsolása"}
            >
              {camOn ? <Icon.video width={22} height={22} /> : <Icon.videoOff width={22} height={22} />}
            </button>
            <button
              onClick={endCall}
              className="flex h-14 w-20 items-center justify-center rounded-full bg-danger text-white transition-transform hover:scale-105"
              aria-label="Hívás befejezése"
            >
              <Icon.phoneOff width={24} height={24} />
            </button>
          </div>
        </>
      )}

      {/* ===== ENDED ===== */}
      {phase === "ended" && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
            <Icon.check width={30} height={30} />
          </span>
          <h2 className="font-display text-2xl font-bold">A hívás véget ért</h2>
          <p className="mt-2 max-w-sm text-pretty text-sm text-zinc-400">
            Köszönjük, hogy igénybe vette a távoli segítségnyújtást. A beszélgetés hossza:{" "}
            <span className="font-medium text-zinc-200 tabular-nums">{fmt(seconds)}</span>.
          </p>
          <div className="mt-6 w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm">
            <p className="text-zinc-400">Téma</p>
            <p className="font-medium text-white">{topic}</p>
            <p className="mt-3 text-zinc-400">Operátor</p>
            <p className="font-medium text-white">{OPERATOR.name}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Bezárás
          </button>
        </div>
      )}
    </div>
  )
}
