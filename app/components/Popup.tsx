"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {BtnProps} from "@/app/components/btn";

export default function Popup({
                                  children,
                                  show,
                                  exitAction,
                                  actions,
                                  layoutId,
                              }: {
    children?: React.ReactNode;
    show: boolean;
    exitAction?: () => void;
    actions?: BtnProps[];
    layoutId?: string;
}) {
    const isMorphing = Boolean(layoutId);

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={exitAction}
                        className="w-full h-screen backdrop-blur-sm fixed top-0 left-0 z-[998] bg-foreground/40"
                    />

                    {/* Conteneur Popup */}
                    <motion.div
                        layout={isMorphing}
                        layoutId={layoutId}
                        // Animation d'origine restaurée si pas de layoutId
                        initial={isMorphing ? undefined : { scale: 0, opacity: 0 }}
                        animate={isMorphing ? undefined : { scale: 1, opacity: 1 }}
                        exit={isMorphing ? undefined : { scale: 0, opacity: 0 }}
                        transition={{
                            duration: isMorphing ? 0.5 : 0.4,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="fixed z-[999] bottom-3 left-3 right-3 md:max-w-2xl md:mx-auto origin-bottom rounded-4xl bg-background overflow-hidden shadow-2xl border border-foreground/10"
                    >
                        {/* Contenu interne */}
                        <motion.div
                            initial={isMorphing ? { opacity: 0 } : false}
                            animate={isMorphing ? { opacity: 1 } : false}
                            exit={isMorphing ? { opacity: 0 } : undefined}
                            transition={{ duration: 0.2, delay: isMorphing ? 0.1 : 0 }}
                            className="p-6 max-h-[85vh] overflow-y-auto flex flex-col justify-between"
                        >
                            <div>{children}</div>

                            <div className="flex mt-8 w-full gap-2 justify-center items-center flex-wrap">
                                <motion.button
                                    type="button"
                                    whileHover={{ opacity: 0.9 }}
                                    whileTap={{ opacity: 0.9, scale: 0.95 }}
                                    className="flex items-center w-fit flex-1 pl-4 text-background justify-center gap-3 rounded-full cursor-pointer border-0 bg-red-700 py-3.5 px-4 font-medium"
                                    onClick={exitAction}
                                >
                                    Fermer
                                    <img alt="cross" className="w-5 h-5 invert" src="/cross.svg" />
                                </motion.button>

                                {actions?.map((a) => (
                                    <motion.button
                                        key={a.text}
                                        disabled={a.disabled}
                                        whileHover={{ opacity: 0.9 }}
                                        whileTap={{ opacity: 0.9, scale: 0.95 }}
                                        type={a.type ? a.type : "button"}
                                        className="flex disabled:bg-foreground/80 items-center w-fit flex-1 pl-4 text-background justify-center gap-3 rounded-full cursor-pointer border-0 bg-foreground py-3.5 px-4 font-medium"
                                        onClick={a.action}
                                    >
                                        {a.text}
                                        <img
                                            alt="icon"
                                            className="w-5 h-5 invert"
                                            src={a.loading ? "/spinner.gif" : `/${a.icon}.svg`}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}