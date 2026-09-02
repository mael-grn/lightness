import { Musicien, Musique } from "@/app/modeles";
import { neon } from "@neondatabase/serverless";

export default class Services {
    private static getSql() {
        return neon(process.env.DATABASE_URL!);
    }

    static async getHeroImageUrl(): Promise<string | undefined> {
        const sql = this.getSql();
        // Syntaxe SQL corrigée avec SELECT <champ> et ORDER BY
        const rows = await sql`SELECT nom FROM heroImage ORDER BY id DESC LIMIT 1`;
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
}