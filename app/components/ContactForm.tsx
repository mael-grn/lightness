"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Remplace l'import de Services par la Server Action 👇
import { sendEmailAction } from "@/app/actions/sendEmail";

export default function ContactForm() {
    const [email, setEmail] = useState("");
    const [identite, setIdentite] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!isValidEmail(email)) {
            setError("Merci de saisir une adresse email valide.");
            return;
        }
        if (identite.trim().length === 0) {
            setError("Merci de renseigner votre identité (nom et prénom ou raison sociale).");
            return;
        }
        if (message.trim().length === 0) {
            setError("Merci de saisir un message.");
            return;
        }

        setLoading(true);
        try {
            // Appel de la Server Action au lieu de Services directement 👇
            const res = await sendEmailAction(email, identite, message);

            if (!res.success) {
                console.error("Erreur retournée par Resend :", res.error);
                setError("Une erreur s'est produite lors de l'envoi. Merci de réessayer.");
                return;
            }

            setSuccess("Message envoyé avec succès !");
            setEmail("");
            setIdentite("");
            setMessage("");
        } catch (err) {
            console.error("Erreur lors de l'appel :", err);
            setError("Une erreur s'est produite. Merci de réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                layout: { type: "spring", stiffness: 220, damping: 26 },
                duration: 0.4,
            }}
            className="relative flex flex-col gap-5 w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-background/85 backdrop-blur-md border border-secondary/40 shadow-sm transition-all duration-300 hover:border-secondary/70"
        >
            {/* Champ Identité */}
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="identite"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground/70"
                >
                    Identité
                </label>
                <input
                    id="identite"
                    type="text"
                    value={identite}
                    onChange={(e) => setIdentite(e.target.value)}
                    placeholder="Nom & prénom ou raison sociale"
                    disabled={loading}
                    className="w-full px-4 py-3 text-sm rounded-2xl bg-secondary/20 border border-secondary/40 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-200 focus:border-primary focus:bg-background/90 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
            </div>

            {/* Champ Email */}
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground/70"
                >
                    Adresse email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.fr"
                    disabled={loading}
                    className="w-full px-4 py-3 text-sm rounded-2xl bg-secondary/20 border border-secondary/40 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-200 focus:border-primary focus:bg-background/90 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
            </div>

            {/* Champ Message */}
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="message"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground/70"
                >
                    Message
                </label>
                <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message..."
                    disabled={loading}
                    className="w-full px-4 py-3 text-sm rounded-2xl bg-secondary/20 border border-secondary/40 text-foreground placeholder:text-foreground/35 outline-none transition-all duration-200 focus:border-primary focus:bg-background/90 focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50"
                />
            </div>

            {/* Messages d'état */}
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        key="error-box"
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-medium text-red-500 bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 rounded-xl overflow-hidden"
                    >
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        key="success-box"
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl overflow-hidden"
                    >
                        {success}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bouton de soumission */}
            <div className="flex justify-end pt-1">
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? {
                        boxShadow: "0px 0px 24px 0px rgba(0, 0, 0, 0.2)",
                        scale: 1.03,
                    } : {}}
                    whileTap={!loading ? {
                        boxShadow: "0px 0px 14px 0px rgba(0, 0, 0, 0.3)",
                        scale: 0.97,
                    } : {}}
                    transition={{
                        scale: { type: "spring", stiffness: 260, damping: 25, mass: 0.8 },
                        boxShadow: { duration: 0.25, ease: "easeOut" },
                    }}
                    className="relative flex items-center justify-center gap-2 px-6 h-12 rounded-full border border-primary bg-background text-foreground font-semibold text-sm cursor-pointer select-none focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                    {loading ? (
                        <>
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                            />
                            <span>Envoi en cours...</span>
                        </>
                    ) : (
                        <>
                            <span>Envoyer le message</span>
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-none stroke-primary stroke-[2.2] stroke-linecap-round stroke-linejoin-round"
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </>
                    )}
                </motion.button>
            </div>
        </motion.form>
    );
}