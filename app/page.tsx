import Services from "@/app/services";
import { HeroImage } from "@/app/components/HeroImage";

export default async function Home() {
    // Exécuté directement sur le serveur : accès direct et sécurisé à DATABASE_URL
    const [heroImageUrl, musiciens] = await Promise.all([
        Services.getHeroImageUrl().catch(() => undefined),
        Services.getMusiciens().catch(() => null),
    ]);

    return (
        <div className="flex flex-col w-full h-full">
            <div id="intro" className="relative flex w-full flex-col gap-4 h-screen justify-center items-center">
                <div className="absolute w-full flex justify-center">
                    <HeroImage heroImageUrl={heroImageUrl} />
                </div>
                <h1 className="sm:text-8xl z-10 text-5xl font-bold w-full text-center">
                    Lightness<br />Duo
                </h1>
            </div>

            <section className="flex flex-col gap-6 w-full p-6 sm:p-14">
                <h2 className="sm:text-5xl text-2xl">Musiciens</h2>
                {!musiciens ? (
                    <p className="border-2 border-red-600 bg-red-400 px-4 py-2 rounded-2xl">
                        Une erreur s&apos;est produite lors de la récupération des données. Merci de réessayer plus tard.
                    </p>
                ) : (
                    <div className="flex flex-col gap-16 w-full mt-16">
                        {musiciens.map((m, index) => (
                            <div key={index} className={`flex gap-6 items-center ${!(index%2) ? "justify-start flex-row" : "flex-row-reverse text-end justify-end"}`}>
                                <img src={m.chemin_photo} alt={m.nom} className="w-full flex-1 h-fit rounded-xl" />
                                <div className={"flex flex-col gap-4 w-full flex-3"}>
                                    <h3 className="sm:text-3xl w-full text-xl">{m.prenom} {m.nom}</h3>
                                    <p className={"text-sm w-full opacity-60"}>{m.attribut}</p>
                                    <p>{m.description}</p>

                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}