import { Musicien, Musique } from "@/app/modeles";
import { neon } from "@neondatabase/serverless";
import {Resend} from "resend";

export default class Services {
    private static getSql() {
        return neon(process.env.DATABASE_URL!);
    }

    static async getHeroImageUrl(): Promise<string | undefined> {
        const sql = this.getSql();
        // Syntaxe SQL corrigée avec SELECT <champ> et ORDER BY
        const rows = await sql`SELECT nom FROM heroImage`;
        return rows[0]?.nom;
    }

    static async getMusiciens(): Promise<Musicien[]> {
        const sql = this.getSql();
        const musiciens = await sql`SELECT * FROM musiciens`;
        return musiciens as Musicien[];
    }

    static async getMusiques(): Promise<Musique[]> {
        const sql = this.getSql();
        const musiques = await sql`SELECT * FROM musiques`;
        return musiques as Musique[];
    }

    static async sendEmail(email: string, identite: string, message: string) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        try {
            const { data, error } = await resend.batch.send([
                // 1. Mail principal pour l'administrateur
                {
                    from: "Lightness Duo <contact@mail.lightness-duo.fr>",
                    to: ["bo.garnier26@gmail.com", "duo.lightness@gmail.fr"],
                    replyTo: email,
                    subject: `Nouveau message de contact - ${identite}`,
                    text: `Nouveau message reçu depuis le site :\n\nDe : ${identite} (${email})\n\nMessage :\n${message}`,
                },
                // 2. Accusé de réception pour l'expéditeur
                {
                    from: "Lightness Duo <contact@mail.lightness-duo.fr>",
                    to: [email],
                    subject: "Confirmation de réception - Lightness Duo",
                    text: `Bonjour ${identite},\n\nNous avons bien reçu votre message et reviendrons vers vous au plus vite.\n\nÀ bientôt,\nLightness Duo`,
                },
            ]);

            if (error) {
                return { success: false, error };
            }

            return { success: true, data };
        } catch (err) {
            return { success: false, error: err };
        }
    }
}