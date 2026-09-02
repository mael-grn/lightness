"use client";

import {useNav} from "@/app/context/NavContext";
import {AnimatePresence, motion} from "framer-motion";

export default function NavBar() {
    const {toggle, isOpen} = useNav();

    return (
        <nav>
            <motion.button
                onClick={toggle}
                // Animation d'apparition moderne
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                whileHover={{ boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0.25)", scale: 1.2 }}
                whileTap={{ boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.4)", scale: 1.1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                }}
                aria-label="Toggle Menu"
                className="z-999 bg-background fixed shadow-foreground cursor-pointer top-4 left-4 w-12 h-12 rounded-full border border-primary flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            >
                {/* Barre supérieure */}
                <motion.span
                    className="w-5 h-0.5 bg-primary rounded-full block"
                    animate={
                        isOpen
                            ? { rotate: 45, y: 8 }
                            : { rotate: 0, y: 0 }
                    }
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />

                {/* Barre centrale */}
                <motion.span
                    className="w-5 h-0.5 bg-primary rounded-full block"
                    animate={
                        isOpen
                            ? { opacity: 0, scaleX: 0 }
                            : { opacity: 1, scaleX: 1 }
                    }
                    transition={{ duration: 0.2 }}
                />

                {/* Barre inférieure */}
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
                initial={{ scale: 0, opacity: 0, rotate: 45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                whileHover={{ boxShadow: "0px 0px 30px 0px rgba(0, 0, 0, 0.25)", scale: 1.2 }}
                whileTap={{ boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.4)", scale: 1.1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                }}
                aria-label="Contact Btn"
                className="z-999 bg-background fixed shadow-foreground cursor-pointer top-4 left-20 w-fit px-3 h-12 rounded-full border border-primary flex flex-col justify-center items-center gap-1.5 focus:outline-none"

            >
                Contact
            </motion.a>
            <div className={"fixed -z-1 top-0 left-0 w-full h-screen bg-primary"}>

            </div>
        </nav>
    )
}