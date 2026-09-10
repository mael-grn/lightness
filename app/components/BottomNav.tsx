"use client"
import useSWR, {mutate} from "swr";
import {usePathname} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import ContactForm from "@/app/components/ContactForm";
import {useEffect, useRef, useState} from "react";
import Services from "@/app/services";

export default function BottomNav() {
    const pathname = usePathname()
    const [showForm, setShowForm] = useState(false);
    const [showNav, setShowNav] = useState(false);

    return <motion.div layout className={"w-full flex gap-2 items-center p-4 justify-end fixed bottom-0 left-0 bg-linear-to-b from-transparent to-background"}>
        <AnimatePresence>
            {
                pathname !== "/" && <motion.a
                    layout
                    whileHover={{
                        opacity:0.9
                    }}
                    whileTap={{
                        opacity:0.9,
                        scale:0.9
                    }}
                    initial={{scale: 0}}
                    animate={{scale: 1}}
                    exit={{scale:0}}
                    href={"/"} className={"rounded-full border-0 bg-primary p-4 w-fit"}>
                    <img src={"/back.svg"} alt={"back"} className={"w-6 h-6 invert"}/>
                </motion.a>
            }
        </AnimatePresence>
        <motion.button
            layout
            layoutId={"formpopup"}
            transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{opacity:0.9}}
            whileTap={{scale: 0.9}}
            onClick={()=> {
                setShowForm(true)
                setShowNav(false)
            }}
            className={"flex-1 cursor-pointer flex items-center max-w-[500px] justify-center gap-3 px-6 py-4 border-0 rounded-full bg-primary text-background"}>
            <img src={"/mail.svg"} alt={"mail"} className={"h-6 w-6 invert"}/>
            Contact
        </motion.button>

        <motion.button
            layout
            layoutId={"navpopup"}
            whileHover={{
                opacity:0.9
            }}
            whileTap={{
                opacity:0.9,
                scale:0.9
            }}
            initial={{scale: 0}}
            animate={{scale: 1}}
            exit={{scale:0}}
            onClick={()=> {
                setShowForm(false)
                setShowNav(true)
            }}
            className={"rounded-full border-0 bg-primary p-4 w-fit"}>
            <img src={"/burger.svg"} alt={"burger"} className={"w-6 h-6 invert"}/>
        </motion.button>

        <ContactPopup show={showForm} close={() => setShowForm(false)} />
        <NavPopup show={showNav} close={() => setShowNav(false)} />
    </motion.div>
}

export function ContactPopup({show, close}:{show: boolean, close: () => void}) {
    return <AnimatePresence>
        {
            show &&  <>
            <motion.div
                transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                }}
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className={"w-full h-screen fixed bottom-0 left-0 bg-foreground/50 z-90"}>

            </motion.div>
                <motion.div
                    layout
                    layoutId={"formpopup"}
                    transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                    }}

                    className={"fixed bottom-0 z-91 left-0 flex flex-col w-full max-w-[800px] gap-2 items-end h-fit pb-32 rounded-t-4xl bg-background origin-bottom p-6"}>
                    <motion.button
                        transition={{
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        whileTap={{scale:0.9, opacity: 0.9}}
                        whileHover={{opacity:0.9}}
                        onClick={close}
                        className={"flex justify-center cursor-pointer items-center rounded-full gap-2 fixed bottom-4 left-4 right-4 p-4 bg-red-700 text-background"}
                    >
                        Fermer
                    </motion.button>
                    <ContactForm/>
                </motion.div>
            </>
        }
    </AnimatePresence>
}

export function NavPopup({ show, close }: { show: boolean; close: () => void }) {
    const { data: pages, isLoading } = useSWR('pages', Services.getPagesApi);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!show) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            // Si le clic a lieu en dehors du conteneur du popup, on ferme
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                close();
            }
        };

        // 'pointerdown' gère simultanément la souris et l'écran tactile (mobile)
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
                    className={"absolute bottom-20 z-90 text-background right-4 overflow-hidden flex flex-col w-fit h-fit rounded-2xl bg-primary shadow-lg"}
                >
                    {isLoading && (
                        <div className="px-4 py-2 text-sm opacity-70">Chargement...</div>
                    )}

                    {pages?.map((p) => (
                        <motion.a
                            key={p.id}
                            whileTap={{ scale: 0.9 }}
                            className={"px-4 py-2 text-xl hover:bg-black/10 transition-colors"}
                            href={"/view/" + p.id}
                            onClick={close}
                        >
                            {p.titre}
                        </motion.a>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}