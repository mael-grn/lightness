import Services from "@/app/services";
import { HeroImage } from "@/app/components/HeroImage";
import {MusiqueCard} from "@/app/components/MusiqueCard";
import {Musique} from "@/app/modeles";


const exempleMusique: Musique = {
    nom: "Funk & Breakfast",
    attribut: "Simplement une musique libre de droit pour tester",
    chemin_photo: "https://cdn.pixabay.com/audio/2026/05/25/18-18-04-782_200x200.png",
    chemin_son: "https://ehmt1lofl0da5fcz.public.blob.vercel-storage.com/funk-demo.mp3",
};

export default async function Home() {
    // Exécuté directement sur le serveur : accès direct et sécurisé à DATABASE_URL
    const [heroImageUrl, musiciens, musiques] = await Promise.all([
        Services.getHeroImageUrl().catch(() => undefined),
        Services.getMusiciens().catch(() => null),
        Services.getMusiques().catch(() => null),
    ]);

    return (
        <div className="flex flex-col w-full h-full">
            <div id="intro" className="relative flex w-full sm:mt-0 sm:mb-0 mt-32 mb-10 flex-col gap-4 sm:h-screen h-1/2 justify-center items-center">
                <HeroImage heroImageUrl={heroImageUrl} />

                <h1 className="sm:text-8xl absolute w-full z-10 text-5xl font-bold text-center">
                    Lightness<br />Duo
                </h1>

            </div>

            <section className="flex flex-col gap-6 w-full p-6 sm:p-14">
                <h2 className="sm:text-5xl text-3xl">Musiciens</h2>
                {!musiciens ? (
                    <p className="border-2 border-red-600 bg-red-400 px-4 py-2 rounded-2xl">
                        Une erreur s&apos;est produite lors de la récupération des données. Merci de réessayer plus tard.
                    </p>
                ) : (
                    <div className="flex flex-col gap-16 w-full">
                        {musiciens.map((m, index) => (
                            <div key={index} className={`flex gap-6 items-center ${!(index%2) ? "justify-start sm:flex-row flex-col" : "sm:flex-row-reverse flex-col sm:text-end sm:justify-end"}`}>
                                <img src={m.chemin_photo} alt={m.nom} className="w-full object-cover flex-1 sm:max-h-fit max-h-72 h-fit rounded-xl" />
                                <div className={"flex flex-col sm:gap-4 gap-1 w-full flex-3"}>
                                    <p className="sm:text-4xl font-bold w-full text-2xl">{m.prenom} {m.nom}</p>
                                    <p className={"text-sm w-full opacity-60"}>{m.attribut}</p>
                                    <p>{m.description}</p>

                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="flex flex-col gap-8 w-full p-6 sm:p-14">
                <h2 className="sm:text-5xl text-2xl">Musiques</h2>
                {!musiques ? (
                    <p className="border-2 border-red-600 bg-red-400 px-4 py-2 rounded-2xl">
                        Une erreur s&apos;est produite lors de la récupération des données. Merci de réessayer plus tard.
                    </p>
                ) : (
                    <div className="flex flex-col gap-8 w-full">
                        {musiques.map((m, index) => (
                            <MusiqueCard musique={m} key={index}/>
                        ))}
                        <MusiqueCard musique={exempleMusique}/>
                    </div>
                )}

            </section>

            <section className="flex flex-col gap-8 w-full p-6 sm:p-14">
                <h2 className="sm:text-5xl text-2xl">Contact</h2>

            </section>
        </div>
    );
}