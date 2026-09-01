import Image from "next/image";
import {getDictionary, Locale} from "@/app/recup-dictionnaire";
import Services from "@/app/services";

interface Props {
    params: Promise<{ lang: Locale }>;
}

export default async function Home({params}: Props) {
    const {lang} = await params;
    const dict = await getDictionary(lang);
    const competences = Services.enrichirCompetences(dict.competences)

    return (
        <div className={"flex flex-col"}>
            <div id={"intro"} className={"flex flex-col gap-4 p-6"}>
                <h1 className={"text-6xl font-bold "}>Maël<br/>Garnier</h1>
                <p className={"text-sm"}>{dict.ui.intro.description}</p>
            </div>

            <section id={"moi"} className={"flex flex-col mt-16"}>
                <div className={"flex flex-col gap-2 p-6"}>
                    <h2 className={"text-2xl font-bold"}>{dict.ui.moi.titre}</h2>
                    <p className={"text-sm"}>{dict.ui.moi.description}</p>
                </div>
            </section>

            <section id={"competences"} className={"flex flex-col mt-16"}>
                <div className={"flex flex-col gap-2 p-6"}>
                <h2 className={"text-2xl font-bold"}>{dict.ui.competences.titre}</h2>
                <p className={"text-sm"}>{dict.ui.competences.description}</p>
                </div>
                <div className={"flex w-full gap-10 overflow-x-auto p-5 max-w-full p"}>
                    {
                        competences.map((competence, index: number) => {
                            return (
                                <div key={index} className={"flex flex-col p-4 gap-1 min-w-fit rounded-2xl border border-primary shadow-[0_0_30px_0px] shadow-primary"}>
                                    <Image className={"rounded-lg"} src={'/illustrations/' + competence.chemin_logo} alt={competence.nom} width={40} height={40}/>
                                    <h3 className={"mt-4 text-lg"}>{competence.nom}</h3>
                                    <p className={"text-xs"}>{dict.ui.competences.maitrise} : <span className={"opacity-70"}>{competence.maitrise}/5</span></p>
                                    <p className={"text-xs"}>{dict.ui.competences.apprentissage} : <span className={"opacity-70"}>{competence.apprentissage}</span></p>
                                    <p className={"text-xs"}>{dict.ui.competences.nombre_projets} : <span className={"opacity-70"}>{competence.nombre_projets}</span></p>

                                </div>

                            )
                        })
                    }
                </div>
            </section>
        </div>
    );
}
