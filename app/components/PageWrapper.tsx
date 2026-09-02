"use client";

import {motion, Variants} from "framer-motion";
import {ReactNode} from "react";
import {useNav} from "@/app/context/NavContext";

const menuVariants: Variants = {
    navbarOpen: {
        borderRadius: "50px 0 0 50px",
        x: 200,
        scale: 0.9
    },
    navbarClosed: {
        borderRadius: "0px",
        x: 0,
        scale: 1
    },
};

export default function PageWrapper({children}: { children: ReactNode }) {
    const {isOpen} = useNav();
    return (
        <motion.div
            initial={false}
            animate={isOpen ? 'navbarOpen' : 'navbarClosed'}
            variants={menuVariants}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
                mass: 0.8,
            }}
            className={"bg-background overflow-hidden min-h-screen w-full flex flex-col"}>
            {children}
        </motion.div>
    )
}