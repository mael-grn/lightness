"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Musique } from "@/app/modeles";

interface MusiqueCardProps {
    musique: Musique;
}

export function MusiqueCard({ musique }: MusiqueCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setIsLoading(true);
            audioRef.current.play().catch(() => {
                setIsLoading(false);
                setIsPlaying(false);
            });
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current || isInteracting) return;
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration || 0;
        setCurrentTime(current);
        setProgress(total > 0 ? (current / total) * 100 : 0);
    };

    const handleLoadedMetadata = () => {
        if (!audioRef.current) return;
        setDuration(audioRef.current.duration || 0);
    };

    const calculateSeek = (clientX: number) => {
        if (!audioRef.current || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const newProgress = (clickX / rect.width) * 100;
        const newTime = (clickX / rect.width) * (audioRef.current.duration || 0);

        setProgress(newProgress);
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        calculateSeek(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches[0]) {
            calculateSeek(e.touches[0].clientX);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || !isFinite(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio && audio.readyState >= 1) {
            setDuration(audio.duration || 0);
        }
        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, []);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                layout: { type: "spring", stiffness: 220, damping: 26 },
                duration: 0.4,
            }}
            className={`relative flex flex-col w-full overflow-hidden rounded-3xl bg-background/85 backdrop-blur-md border shadow-sm transition-all duration-300 ${
                isPlaying
                    ? "p-6 border-primary/60 shadow-lg"
                    : "p-4 border-secondary/40 hover:border-secondary/70"
            }`}
        >
            <audio
                ref={audioRef}
                src={musique.chemin_son}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={() => setIsLoading(false)}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => {
                    setIsLoading(false);
                    setIsPlaying(true);
                }}
                onPause={() => {
                    setIsLoading(false);
                    setIsPlaying(false);
                }}
                onError={() => {
                    setIsLoading(false);
                    setIsPlaying(false);
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    setIsLoading(false);
                    setProgress(0);
                    setCurrentTime(0);
                }}
            />

            {/* En-tête : Pochette, infos et bouton de contrôle */}
            <div className="flex items-center gap-5 w-full">
                {/* Pochette sans bordure */}
                <motion.div
                    layout
                    className="relative shrink-0 overflow-hidden rounded-2xl bg-secondary/30 shadow-inner"
                    animate={{
                        width: isPlaying ? 112 : 72,
                        height: isPlaying ? 112 : 72,
                    }}
                    transition={{ type: "spring", stiffness: 240, damping: 24 }}
                >
                    <motion.img
                        src={musique.chemin_photo}
                        alt={musique.nom}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        animate={{ scale: isPlaying ? 1.08 : 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    <AnimatePresence>
                        {isPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.2 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-primary pointer-events-none"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Titre & sous-titre */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    <motion.p
                        layout="position"
                        className={`font-semibold text-foreground truncate tracking-tight transition-all duration-200 ${
                            isPlaying ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                        }`}
                    >
                        {musique.nom}
                    </motion.p>
                    <motion.p
                        layout="position"
                        className="text-xs sm:text-sm font-medium uppercase tracking-wider text-foreground/60 truncate mt-0.5"
                    >
                        {musique.attribut}
                    </motion.p>
                </div>

                {/* Bouton de contrôle */}
                <motion.button
                    type="button"
                    onClick={togglePlay}
                    initial={{ scale: 0, opacity: 0, rotate: 45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    whileHover={{
                        boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.22)",
                        scale: 1.12,
                    }}
                    whileTap={{
                        boxShadow: "0px 0px 14px 0px rgba(0, 0, 0, 0.35)",
                        scale: 0.96,
                    }}
                    transition={{
                        scale: { type: "spring", stiffness: 260, damping: 25, mass: 0.8 },
                        rotate: { type: "spring", stiffness: 260, damping: 25 },
                        boxShadow: { duration: 0.25, ease: "easeOut" },
                    }}
                    aria-label={
                        isLoading
                            ? "Chargement"
                            : isPlaying
                                ? "Mettre en pause"
                                : "Écouter"
                    }
                    className="relative flex items-center justify-center w-12 h-12 shrink-0 rounded-full border border-primary bg-background text-primary shadow-sm focus:outline-none cursor-pointer"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isLoading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ duration: 0.15 }}
                                className="absolute flex items-center justify-center"
                            >
                                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                        ) : isPlaying ? (
                            <motion.svg
                                key="pause-icon"
                                viewBox="0 0 24 24"
                                className="absolute w-5 h-5 fill-current"
                                initial={{ opacity: 0, scale: 0.75 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.75 }}
                                transition={{ duration: 0.12, ease: "easeOut" }}
                            >
                                <rect x="5.5" y="4" width="4" height="16" rx="2" />
                                <rect x="14.5" y="4" width="4" height="16" rx="2" />
                            </motion.svg>
                        ) : (
                            <motion.svg
                                key="play-icon"
                                viewBox="0 0 24 24"
                                className="absolute w-5 h-5 fill-current -translate-x-0.5"
                                initial={{ opacity: 0, scale: 0.75 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.75 }}
                                transition={{ duration: 0.12, ease: "easeOut" }}
                            >
                                <path d="M7 6.041a2 2 0 0 1 3.033 -1.714l10.05 5.959a2 2 0 0 1 0 3.428l-10.05 5.959A2 2 0 0 1 7 17.959V6.041z" />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Zone dépliée : Barre de progression & chronomètres */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 22 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 26 }}
                        className="w-full flex flex-col gap-2.5 overflow-hidden"
                    >
                        {/* Piste de progression sans bordure avec fond foreground/20 */}
                        <div
                            ref={progressBarRef}
                            onClick={handleSeek}
                            onMouseEnter={() => setIsInteracting(true)}
                            onMouseLeave={() => setIsInteracting(false)}
                            onTouchStart={() => setIsInteracting(true)}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={() => setIsInteracting(false)}
                            className="group relative w-full py-2 cursor-pointer touch-none select-none flex items-center"
                        >
                            <motion.div
                                animate={{ height: isInteracting ? 8 : 5 }}
                                transition={{ duration: 0.15 }}
                                className="relative w-full rounded-full bg-foreground/20 overflow-hidden"
                            >
                                <motion.div
                                    className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
                                    animate={{ width: `${progress}%` }}
                                    transition={
                                        isInteracting
                                            ? { duration: 0.05, ease: "easeOut" }
                                            : { duration: 0.15, ease: "linear" }
                                    }
                                />
                            </motion.div>

                            {/* Pastille (thumb) */}
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background shadow-md pointer-events-none"
                                animate={{
                                    left: `${progress}%`,
                                    scale: isInteracting ? 1 : 0,
                                    opacity: isInteracting ? 1 : 0,
                                }}
                                transition={{
                                    left: isInteracting
                                        ? { duration: 0.05, ease: "easeOut" }
                                        : { duration: 0.15, ease: "linear" },
                                    scale: { duration: 0.15 },
                                    opacity: { duration: 0.15 },
                                }}
                            />
                        </div>

                        <div className="flex justify-between items-center text-xs text-foreground/60 font-mono tracking-tight px-0.5">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}