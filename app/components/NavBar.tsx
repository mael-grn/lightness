"use client";

import {useNav} from "@/app/context/NavContext";
import {AnimatePresence, motion} from "framer-motion";

export default function NavBar() {
    const {toggle, isOpen} = useNav();

    const LINKS = [
        "Accueil",
        "Musiciens",
        "Musiques",
        "Contact"
    ]

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: string) => {

        if (isOpen) {
            toggle();
        }


    };

    return (
        <nav>
            <motion.button
                onClick={toggle}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1}}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                }}
                className="z-999 bg-background fixed cursor-pointer top-4 left-4 w-12 h-12 rounded-full border border-primary flex flex-col justify-center items-center gap-1.5"
            >
                <motion.span
                    className="w-5 h-0.5 bg-primary rounded-full block"
                    animate={
                        isOpen
                            ? { rotate: 45, y: 8 }
                            : { rotate: 0, y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />

                <motion.span
                    className="w-5 h-0.5 bg-primary rounded-full block"
                    animate={
                        isOpen
                            ? { opacity: 0, scaleX: 0 }
                            : { opacity: 1, scaleX: 1 }
                    }
                    transition={{ duration: 0.2 }}
                />

                <motion.span
                    className="w-5 h-0.5 bg-primary rounded-full block"
                    animate={
                        isOpen
                            ? { rotate: -45, y: -8 }
                            : { rotate: 0, y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            </motion.button>

            <motion.a
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 1.1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                }}
                className="z-999 bg-background fixed cursor-pointer top-4 left-20 w-fit px-3 h-12 rounded-full border border-primary flex flex-col justify-center items-center gap-1.5"

            >
                Contact
            </motion.a>
            <div className={`fixed -z-1 top-0 scroll-smooth left-0 w-full flex gap-4 flex-col h-screen justify-center p-4 bg-primary`}>
                {
                    LINKS.map((item, i) => {
                        return (
                            <motion.a
                                className="z-999 cursor-pointer text-background text-2xl w-fit font-bold"
                                key={i}
                                whileHover={{opacity: 0.7}}
                                whileTap={{scale: 0.8}}
                                href={"#" + item}
                                onClick={(e) => handleLinkClick(e, item)}
                            >
                                {item}
                            </motion.a>
                        )
                    })
                }
            </div>
        </nav>
    )
}