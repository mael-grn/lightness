
import Services from "@/app/services";
import {MusiqueCard} from "@/app/components/MusiqueCard";
import {Musique} from "@/app/modeles";
import ContactForm from "@/app/components/ContactForm";
import Contactbtn from "@/app/components/ContactBtn";

export default async function Home() {
    const [heroImageUrl, musiciens, musiques] = await Promise.all([
        Services.getHeroImageUrl().catch(() => undefined),
        Services.getMusiciens().catch(() => null),
        Services.getMusiques().catch(() => null),
    ]);

    return (
        <>
            <div id="Accueil" className=" flex w-full flex-col h-screen gap-6 items-center">
                <h1 className="sm:text-7xl w-full text-5xl font-bold text-center">
                    Lightness Duo
                </h1>
                <img className={" h-2/3 object-cover rounded-4xl"}
                     src={heroImageUrl && heroImageUrl.length > 0 ? heroImageUrl : "/default-bg.jpg"}/>
            </div>

            <section id={"Musiciens"} className="flex -mt-10 flex-col items-center gap-12 w-full">
                <h2 className="sm:text-7xl text-5xl">Musiciens</h2>
                <div className="flex flex-col gap-8 w-full">
                    {
                        !musiciens || musiciens.length === 0 ?
                            <p>Hum, il semble qu&apos;il manque quelques musiciens...</p>
                            :
                            musiciens.map((m, index) => (

                                <div key={index}
                                     className={`flex items-center flex-col justify-center items-center`}>
                                    <img src={m.chemin_photo} alt={m.nom}
                                         className="w-full w-full max-w-60 object-cover flex-1 sm:max-h-fit max-h-72 h-fit rounded-xl"/>
                                    <p className="sm:text-4xl mt-4 font-bold w-full text-center text-2xl">{m.prenom} {m.nom}</p>
                                    <p className={"text-sm w-full mb-4 text-center opacity-60"}>{m.attribut}</p>
                                    <p className={"text-center w-full max-w-[700px]"}>{m.description}</p>
                                </div>
                            ))}
                </div>
            </section>

            <section id={"Musiques"} className="flex flex-col gap-12 mb-20 items-center w-full">
                <h2 className="sm:text-7xl text-5xl">Musiques</h2>
                <div className="flex justify-center flex-wrap gap-4 w-full">
                    {
                        !musiques || musiques.length === 0 ?
                            <p>Hum, il semble qu&apos;il manque quelques musiques...</p>
                            :
                            musiques.map((m, index) => (
                                <MusiqueCard musique={m} key={index}/>
                            ))}
                </div>

            </section>

            <Contactbtn/>

        </>
    );
}