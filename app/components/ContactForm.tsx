"use client";

import { useState, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendEmailAction } from "@/app/actions/sendEmail";

export default function ContactForm() {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const identite = String(formData.get("identite") ?? "").trim();
        const message = String(formData.get("message") ?? "").trim();

        startTransition(async () => {
            try {
                const res = await sendEmailAction(email, identite, message);

                if (!res.success) {
                    setStatus({
                        type: "error",
                        message: "Une erreur s'est produite lors de l'envoi. Merci de réessayer.",
                    });
                    return;
                }

                setStatus({ type: "success", message: "Message envoyé avec succès !" });
                formRef.current?.reset();
            } catch {
                setStatus({
                    type: "error",
                    message: "Une erreur s'est produite. Merci de réessayer plus tard.",
                });
            }
        });
    };

    const inputStyles =
        "w-full px-4 py-3 text-sm rounded-2xl bg-secondary/20 border border-secondary/40 text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:bg-background/90 focus:ring-1 focus:ring-primary/30 disabled:opacity-50";

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-background/80 backdrop-blur-md border border-secondary/40"
        >
            <div className="flex flex-col gap-1.5">
                <label htmlFor="identite" className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Identité
                </label>
                <input
                    id="identite"
                    name="identite"
                    type="text"
                    required
                    disabled={isPending}
                    placeholder="Nom & prénom ou raison sociale"
                    className={inputStyles}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Adresse email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isPending}
                    placeholder="nom@exemple.fr"
                    className={inputStyles}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    disabled={isPending}
                    placeholder="Votre message..."
                    className={`${inputStyles} resize-none`}
                />
            </div>

            <AnimatePresence mode="wait">
                {status && (
                    <motion.div
                        key={status.type}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className={`text-xs font-medium px-4 py-3 rounded-xl ${
                            status.type === "error"
                                ? "text-red-500 bg-red-500/10 border border-red-500/20"
                                : "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20"
                        }`}
                    >
                        {status.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-end pt-1">
                <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={!isPending ? { scale: 1.02 } : undefined}
                    whileTap={!isPending ? { scale: 0.98 } : undefined}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="flex items-center justify-center gap-2 px-6 h-12 rounded-full border border-primary bg-background text-foreground font-semibold text-sm cursor-pointer select-none hover:bg-primary/5 active:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span>Envoi en cours...</span>
                        </>
                    ) : (
                        <>
                            <span>Envoyer le message</span>
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-none stroke-primary stroke-[2] stroke-linecap-round stroke-linejoin-round"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </>
                    )}
                </motion.button>
            </div>
        </form>
    );
}