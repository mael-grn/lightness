"use client"
import useSWR, {mutate} from "swr";
import {usePathname} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import ContactForm from "@/app/components/ContactForm";
import {useEffect, useRef, useState} from "react";
import Services from "@/app/services";
import Anm from "@/app/components/Animator3000";
import Popup from "@/app/components/Popup";
import Link from "next/link";

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

export default function BottomNav() {
    const pathname = usePathname();
    const [showForm, setShowForm] = useState(false);
    const [showNav, setShowNav] = useState(false);

    return (
        <motion.div
            transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
            }}
            initial={{y:300}}
            animate={{y:0}}
            exit={{y:300}}
            layout
            className={"w-full flex gap-2 items-center p-4 justify-end fixed bottom-0 left-0"}
        >
            <AnimatePresence mode="popLayout">
                {pathname !== "/" && (
                    <MotionLink
                        key="back-button"
                        href={"/"}
                        layout
                        whileHover={{ opacity: 0.9 }}
                        whileTap={{ opacity: 0.9, scale: 0.9 }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={"rounded-full border-0 bg-primary p-4 w-fit"}
                    >
                        <img src={"/back.svg"} alt={"back"} className={"w-6 h-6 invert"} />
                    </MotionLink>
                )}
            </AnimatePresence>

            <motion.button
                layout
                layoutId={"formpopup"}
                transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setShowForm(true);
                    setShowNav(false);
                }}
                className={"flex-1 cursor-pointer flex items-center max-w-[500px] sm:max-w-[200px] justify-center gap-3 px-6 py-4 border-0 rounded-full bg-primary text-background"}
            >
                <img src={"/mail.svg"} alt={"mail"} className={"h-6 w-6 invert"} />
                Contact
            </motion.button>

            <motion.button
                layout
                layoutId={"navpopup"}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ opacity: 0.9, scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => {
                    setShowForm(false);
                    setShowNav(true);
                }}
                className={"rounded-full border-0 bg-primary p-4 w-fit"}
            >
                <img src={"/burger.svg"} alt={"burger"} className={"w-6 h-6 invert"} />
            </motion.button>

            <ContactForm show={showForm} onClose={() => setShowForm(false)} layoutId={"formpopup"} />
            <NavPopup show={showNav} close={() => setShowNav(false)} />
        </motion.div>
    );
}

export function NavPopup({show, close}: { show: boolean; close: () => void }) {
    const {data: pages, isLoading} = useSWR('pages', Services.getPagesApi);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!show) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                close();
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [show, close]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    ref={popupRef}
                    layout
                    layoutId={"navpopup"}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className={"absolute p-4 bottom-20 gap-1 z-90 text-background right-4 overflow-hidden flex flex-col w-fit h-fit rounded-4xl bg-primary shadow-lg"}
                >
                    {isLoading && (
                        <div className="px-4 py-2 text-sm opacity-70">Chargement...</div>
                    )}

                    <motion.h1
                        whileTap={{ scale: 0.9 }}
                        className={"text-center text-xl font-bold mb-3"}
                    >
                        Pages disponibles
                    </motion.h1>

                    {pages?.map((p, i) => (
                        <MotionLink
                            key={p.id}
                            whileTap={{ scale: 0.9 }}
                            whileHover={{opacity:0.9}}
                            className={"px-4 py-2 text-lg text-center font-normal rounded-full bg-background text-foreground"}
                            href={"/view/" + p.id}
                            onClick={close}
                        >
                            {p.titre}
                        </MotionLink>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}