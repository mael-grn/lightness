import Image from "next/image";
import {getDictionary, Locale} from "@/app/recup-dictionnaire";

interface Props {
    params: Promise<{ lang: Locale }>;
}

export default async function Home({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
  return (
    <div className={"flex flex-col gap-4"}>
        <h1 className={"text-6xl font-bold "}>Maël<br/>Garnier</h1>
        <p className={"text-sm"}>{dict.ui.intro.description}</p>

        <section className={"flex flex-col gap-2 mt-16"}>
            <h2 className={"text-2xl font-bold"}>{dict.ui.competences.titre}</h2>
            <p className={"text-sm"}>{dict.ui.competences.description}</p>
        </section>
    </div>
  );
}
