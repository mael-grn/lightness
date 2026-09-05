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
            if (audio) audio.pause();
        };
    }, []);

    return (
        <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-3xl select-none group">
            <audio
                ref={audioRef}
                src={musique.chemin_son}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
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
                onEnded={() => {
                    setIsPlaying(false);
                    setIsLoading(false);
                    setProgress(0);
                    setCurrentTime(0);
                }}
            />

            <motion.img
                src={musique.chemin_photo}
                alt={musique.nom}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                animate={{ scale: isPlaying ? 1.05 : 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="flex items-end justify-between gap-3 mb-4">
                    <div className="min-w-0 text-white flex-1 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md">
                        <p className="text-xl font-semibold tracking-tight truncate leading-tight text-white">
                            {musique.nom}
                        </p>
                        <p className="text-xs font-normal tracking-wide truncate mt-1 text-white">
                            {musique.attribut}
                        </p>
                    </div>

                    <motion.button
                        type="button"
                        onClick={togglePlay}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        aria-label={
                            isLoading ? "Chargement" : isPlaying ? "Pause" : "Lecture"
                        }
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white shrink-0 hover:bg-white/25 active:bg-white/30 cursor-pointer"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isLoading ? (
                                <motion.span
                                    key="loading"
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                    exit={{ opacity: 0 }}
                                />
                            ) : isPlaying ? (
                                <motion.svg
                                    key="pause"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-current"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <rect x="6" y="5" width="3.5" height="14" rx="1" />
                                    <rect x="14.5" y="5" width="3.5" height="14" rx="1" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="play"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-current translate-x-[0px]"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <path d="M7 5.5v13a1 1 0 0 0 1.55.83l10.5-6.5a1 1 0 0 0 0-1.66l-10.5-6.5A1 1 0 0 0 7 5.5z" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                <div
                    ref={progressBarRef}
                    onClick={(e) => calculateSeek(e.clientX)}
                    onTouchStart={() => setIsInteracting(true)}
                    onTouchMove={(e) => e.touches[0] && calculateSeek(e.touches[0].clientX)}
                    onTouchEnd={() => setIsInteracting(false)}
                    className="relative py-2 cursor-pointer touch-none"
                >
                    <motion.div
                        animate={{ height: isInteracting ? 4 : 2 }}
                        className="relative w-full rounded-full bg-white/20 overflow-hidden"
                    >
                        <motion.div
                            className="absolute left-0 top-0 bottom-0 bg-white"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: "linear", duration: 0.1 }}
                        />
                    </motion.div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-white/50 tracking-wider">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
}