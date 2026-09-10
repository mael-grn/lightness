import {Musique, Page, PageDetails, Photo, Texte, Titre} from "@/app/modeles";
import { neon } from "@neondatabase/serverless";
import {Resend} from "resend";
import StringUtil from "@/app/utils/StringUtils";
import axios, {AxiosError} from "axios";

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

    static async getPagesApi(): Promise<Page[]> {
        try {
            const response = await axios.get(`/api/pages`);
            return response.data.data as Page[];

        } catch (e) {
            throw StringUtil.getErrorMessageFromStatus((e as AxiosError).status || -1)
        }
    }

    static async getPages(): Promise<Page[]> {
        const sql = this.getSql();
        const pages = await sql`SELECT * FROM pages`;
        return pages as Page[];
    }

    static async getElements(page: number): Promise<Element[]> {
        const sql = this.getSql();
        const elements = await sql`SELECT * FROM elements where page_id=${page}`;
        return elements as Element[];
    }

    static async getTitres(page:number): Promise<Titre[]> {
        const sql = this.getSql();
        const titres = await sql`SELECT titres.* FROM titres, elements where element_id=elements.id and page_id=${page}`;
        return titres as Titre[];
    }

    static async getTextes(page:number): Promise<Texte[]> {
        const sql = this.getSql();
        const textes = await sql`SELECT textes.* FROM textes, elements where element_id=elements.id and page_id=${page}`;
        return textes as Texte[];
    }

    static async getPhotos(page:number): Promise<Photo[]> {
        const sql = this.getSql();
        const photos = await sql`SELECT photos.* FROM photos, elements where element_id=elements.id and page_id=${page}`;
        return photos as Photo[];
    }

    static async getMusiques(page:number): Promise<Musique[]> {
        const sql = this.getSql();
        const musiques = await sql`SELECT musiques.* FROM musiques, elements where element_id=elements.id and page_id=${page}`;
        return musiques as Musique[];
    }

    static async getPageDetails(pageId: number): Promise<PageDetails | null> {
        const sql = this.getSql();

        const rows = await sql`
        SELECT 
            -- Objet Page
            json_build_object(
                'id', p.id,
                'titre', p.titre
            ) AS page,

            -- Table elements
            COALESCE((
                SELECT json_agg(e.*)
                FROM elements e
                WHERE e.page_id = p.id
            ), '[]'::json) AS elements,

            -- Table titres
            COALESCE((
                SELECT json_agg(t.*)
                FROM titres t
                INNER JOIN elements e ON t.element_id = e.id
                WHERE e.page_id = p.id
            ), '[]'::json) AS titres,

            -- Table textes
            COALESCE((
                SELECT json_agg(tx.*)
                FROM textes tx
                INNER JOIN elements e ON tx.element_id = e.id
                WHERE e.page_id = p.id
            ), '[]'::json) AS textes,

            -- Table photos
            COALESCE((
                SELECT json_agg(ph.*)
                FROM photos ph
                INNER JOIN elements e ON ph.element_id = e.id
                WHERE e.page_id = p.id
            ), '[]'::json) AS photos,

            -- Table musiques
            COALESCE((
                SELECT json_agg(m.*)
                FROM musiques m
                INNER JOIN elements e ON m.element_id = e.id
                WHERE e.page_id = p.id
            ), '[]'::json) AS musiques

        FROM pages p
        WHERE p.id = ${pageId}
    `;

        if (!rows || rows.length === 0) {
            return null;
        }

        return rows[0] as PageDetails;
    }

    static stringToSlug(str: string): string {
        return str
            // Normalise les caractères accentués en décomposant les glyphes (é -> e + ´)
            .normalize("NFD")
            // Supprime les marques diacritiques (accents)
            .replace(/[\u0300-\u036f]/g, "")
            // Remplace les esperluettes par "et" pour conserver le sens
            .replace(/&/g, " et ")
            // Passe en minuscules
            .toLowerCase()
            // Remplace les caractères non alphanumériques par un tiret
            .replace(/[^a-z0-9]+/g, "-")
            // Retire les tirets au début et à la fin
            .replace(/^-+|-+$/g, "");
    }


    static slugToString(slug: string): string {
        const text = slug
            // Remplace les tirets par des espaces
            .replace(/-/g, " ")
            // Nettoie les espaces multiples éventuels
            .replace(/\s+/g, " ")
            .trim();

        if (!text) return "";

        // Met la première lettre en majuscule pour un affichage propre
        return text.charAt(0).toUpperCase() + text.slice(1);
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