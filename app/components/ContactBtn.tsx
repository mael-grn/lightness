"use client";

import {useState} from "react";
import ContactForm from "@/app/components/ContactForm";
import {AnimatePresence, motion} from "framer-motion";

export default function Contactbtn() {

    const [show, setShow] = useState(false);
    return <>
        <div className={"fixed bottom-2 left-1/2 -translate-x-1/2 px-6 max-w-[700px] w-full"}>
            <motion.button
                transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{opacity:0.9, scale:1.1}}
                whileTap={{scale: 0.9}}
                onClick={() => setShow(!show)}
                className={" cursor-pointer flex items-center justify-center gap-3 px-6 py-4 w-full border-0 rounded-full bg-primary text-background"}>
                <img src={"/mail.svg"} alt={"mail"} className={"h-4 w-4 invert"}/>
                Contact
            </motion.button>
        </div>

        <AnimatePresence>
            {
                show && <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className={"fixed top-0 left-0 w-full h-screen bg-background/40 flex justify-center items-center"}
                >
                    <motion.div
                        transition={{
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        initial={{scale:0}}
                        animate={{scale:1}}
                        exit={{scale:0}}
                        className={"flex flex-col w-full max-w-[500px] gap-2 items-end"}>
                        <motion.button
                            transition={{
                                duration: 1,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            whileTap={{scale:0.9}}
                            whileHover={{opacity:0.9, scale: 1.1}}
                            onClick={() => setShow(!show)}
                            className={"flex items-center justify-center gap-3 border-1 border-primary cursor-pointer bg-background rounded-full px-4 py-2"}
                        >
                            Fermer
                        </motion.button>
                        <ContactForm/>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    </>
}