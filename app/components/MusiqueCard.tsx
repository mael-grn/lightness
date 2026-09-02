"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Musique } from "@/app/modeles";

interface MusiqueCardProps {
    musique: Musique;
}

export function MusiqueCard({ musique }: MusiqueCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
        setProgress(
            (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0
        );
    };

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress((newTime / audioRef.current.duration) * 100);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex flex-col md:flex-row items-center gap-6 p-5 sm:p-7 rounded-3xl bg-[var(--background)]/60 backdrop-blur-md border border-[var(--secondary)]/40 shadow-sm w-full"
        >
            <audio
                ref={audioRef}
                src={musique.chemin_son}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                    setIsPlaying(false);
                    setProgress(0);
                }}
            />

            {/* Pochette */}
            <div className="relative w-full md:w-44 h-44 shrink-0 overflow-hidden rounded-2xl bg-[var(--secondary)]/20 shadow-inner">
                <motion.img
                    src={musique.chemin_photo}
                    alt={musique.nom}
                    className="w-full h-full object-cover"
                    animate={{
                        scale: isPlaying ? 1.05 : 1,
                    }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {/* Subtil voile coloré pendant la lecture */}
                <AnimatePresence>
                    {isPlaying && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[var(--primary)] pointer-events-none"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Informations & Contrôles */}
            <div className="flex flex-col justify-between w-full h-full gap-5">
                {/* Titre et description */}
                <div className="flex flex-col gap-1">
                    <motion.h3
                        layout="position"
                        className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] tracking-wide"
                    >
                        {musique.nom}
                    </motion.h3>
                    <motion.p
                        layout="position"
                        className="text-sm font-medium tracking-wider uppercase opacity-60 text-[var(--foreground)]"
                    >
                        {musique.attribut}
                    </motion.p>
                </div>

                {/* Zone de commandes : Bouton Play/Pause + Barre de progression */}
                <div className="flex items-center gap-4 w-full mt-auto pt-2">
                    {/* Bouton de contrôle sobre */}
                    <motion.button
                        onClick={togglePlay}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        aria-label={isPlaying ? "Mettre en pause" : "Écouter"}
                        className="relative flex items-center justify-center w-11 h-11 shrink-0 rounded-full border border-[var(--secondary)]/50 bg-[var(--foreground)]/5 text-[var(--foreground)] hover:bg-[var(--foreground)]/10 transition-colors"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isPlaying ? (
                                <motion.svg
                                    key="pause"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.15 }}
                                    className="w-4 h-4 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="play"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ duration: 0.15 }}
                                    className="w-4 h-4 fill-current translate-x-0.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Barre de progression & Temps */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <div
                            onClick={handleSeek}
                            className="relative w-full h-1.5 rounded-full bg-[var(--secondary)]/30 cursor-pointer overflow-hidden"
                        >
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 bg-[var(--primary)] rounded-full"
                                style={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </div>

                        <div className="flex justify-between items-center text-xs opacity-60 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}