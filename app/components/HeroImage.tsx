"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroImage({ heroImageUrl }: { heroImageUrl?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Suit le défilement de l'élément à l'écran
    const { scrollYProgress } = useScroll({
        target: containerRef,
        // Commence quand le haut de l'élément atteint le haut de l'écran,
        // et termine quand le bas de l'élément quitte l'écran par le haut
        offset: ["start start", "end start"],
    });

    // Plus on scroll vers le bas :
    // - L'échelle diminue de 1 à 0.75
    const scaleOnScroll = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
    // - L'opacité diminue de 1 à 0.2
    const opacityOnScroll = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
    // - Le border-radius augmente de 30px à 80px (ou "50%" si tu veux un effet ovale)
    const borderRadiusOnScroll = useTransform(scrollYProgress, [0, 1], ["30px", "80px"]);

    return (
        <div ref={containerRef} className="relative w-full flex justify-center items-center">
            <motion.img
                src={heroImageUrl || "default-bg.jpg"}
                alt="bg"
                className="w-10/12 object-cover"
                // 1. Apparition lente et cinématographique
                initial={{
                    opacity: 0,
                    scale: 0.92,
                    filter: "blur(10px)",
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                }}
                transition={{
                    duration: 1.6, // Durée allongée pour un effet doux et posé
                    ease: [0.16, 1, 0.3, 1], // Courbe d'accélération progressive (cubic-bezier)
                }}
                // 2. Déformations reliées en direct au scroll
                style={{
                    scale: scaleOnScroll,
                    opacity: opacityOnScroll,
                    borderRadius: borderRadiusOnScroll,
                }}
            />
        </div>
    );
}