"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Musique {
    id?: number;
    nom: string;
    chemin_son: string;
}

interface MusicLectorProps {
    musique: Musique;
    autoPlay?: boolean;
}

const customEase = [0.16, 1, 0.3, 1] as const;

export default function MusicLector({ musique, autoPlay = false }: MusicLectorProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Synchronisation du chargement de la piste
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            setCurrentTime(0);
            if (autoPlay) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsPlaying(false);
            }
        }
    }, [musique.chemin_son, autoPlay]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !audioRef.current || !duration) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const newProgress = clickPosition / rect.width;
        const targetTime = newProgress * duration;

        audioRef.current.currentTime = targetTime;
        setCurrentTime(targetTime);
    };

    const formatTime = (secs: number) => {
        if (isNaN(secs)) return "0:00";
        const minutes = Math.floor(secs / 60);
        const remainingSeconds = Math.floor(secs % 60);
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <motion.div
            layout
            transition={{ duration: 0.5, ease: customEase }}
            className="w-full p-4 bg-primary text-background rounded-3xl shadow-xl flex flex-col gap-3 overflow-hidden select-none"
        >
            <audio
                ref={audioRef}
                src={musique.chemin_son}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Ligne principale : Titre, Égaliseur et Contrôle Play/Pause */}
            <div className="flex items-center justify-between gap-4">
                {/* Titre & Égaliseur animé */}
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                    {/* Barres d'égaliseur animé */}
                    <div className="flex items-end gap-1 h-6 w-6 shrink-0 justify-center">
                        {[0.2, 0.4, 0.1, 0.3].map((delay, index) => (
                            <motion.span
                                key={index}
                                className="w-1 bg-background rounded-full origin-bottom"
                                animate={
                                    isPlaying
                                        ? { height: ["20%", "100%", "30%"] }
                                        : { height: "25%" }
                                }
                                transition={
                                    isPlaying
                                        ? {
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            duration: 0.6,
                                            delay: delay,
                                            ease: "easeInOut",
                                        }
                                        : { duration: 0.2 }
                                }
                            />
                        ))}
                    </div>

                    <motion.div layout className="truncate">
                        <h4 className="font-semibold text-base truncate leading-tight">
                            {musique.nom}
                        </h4>
                        <p className="text-xs opacity-70">
                            {isPlaying ? "En lecture" : "En pause"}
                        </p>
                    </motion.div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center gap-2">
                    {/* Bouton Play / Pause */}
                    <motion.button
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-background text-foreground shrink-0 shadow-sm cursor-pointer"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isPlaying ? (
                                <motion.svg
                                    key="pause"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: customEase }}
                                    className="w-5 h-5 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="play"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: customEase }}
                                    className="w-5 h-5 fill-current ml-0.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Barre de progression cliquable */}
            <div className="flex flex-col gap-1.5 pt-1">
                <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    className="relative w-full h-2 rounded-full bg-background/20 cursor-pointer overflow-hidden group"
                >
                    <motion.div
                        className="h-full bg-background rounded-full"
                        style={{ width: `${progressPercent}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                </div>

                <div className="flex justify-between text-xs opacity-75 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Panneau dépliable avec détails ou contrôles supplémentaires */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: customEase }}
                        className="pt-2 border-t border-background/15 flex items-center justify-between text-xs"
                    >
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = Math.max(0, currentTime - 10);
                                }
                            }}
                            className="px-3 py-1.5 rounded-full bg-background/15 hover:bg-background/25 transition cursor-pointer"
                        >
                            -10s
                        </motion.button>

                        <span className="opacity-70 italic truncate">
                            ID: {musique.id ?? "N/A"}
                        </span>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                                }
                            }}
                            className="px-3 py-1.5 rounded-full bg-background/15 hover:bg-background/25 transition cursor-pointer"
                        >
                            +10s
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}