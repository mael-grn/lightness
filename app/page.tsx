import Services from "@/app/services";
import Link from "next/link";
import Anm from "@/app/components/Animator3000";
import ReseauBtn from "@/app/components/ReseauBtn";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const [heroImageUrl, pages] = await Promise.all([
        Services.getHeroImageUrl().catch(() => null),
        Services.getPages().catch(() => null),
    ]);

    return (
        <main className={"flex flex-col gap-10 min-h-screen"}>
            <div id="Accueil" className=" flex w-full flex-col gap-6 items-center">
                <Anm>
                    <h1 className="sm:text-7xl w-full text-5xl font-bold text-center">
                        Lightness Duo
                    </h1>
                </Anm>
                <Anm y={0} scale={0} delay={0.2}>
                    <img className={" object-cover rounded-4xl"}
                         src={(heroImageUrl && heroImageUrl.length > 0) ? heroImageUrl : "/default-bg.jpg"}/>
                </Anm>
            </div>

            <section className={"w-full flex flex-col gap-4 items-center justify-center"}>
                <Anm delay={0.3}>
                    <h1 className=" w-full text-2xl font-bold text-center">
                        Nos pages
                    </h1>
                </Anm>
                {
                    pages ?
                        pages.map((p, i) => <Anm
                            key={p.id}
                            delay={0.3 + i / 2}>
                            <Link
                                href={"/view/" + p.id}
                                className={"w-full px-6 py-3 rounded-full bg-primary text-background flex items-center justify-center hover:opacity-75 active:scale-90 transition-all"}
                            >
                                {p.titre}
                            </Link>
                        </Anm>)
                        :
                        <div className={"w-full flex flex-col gap-4 items-center justify-center"}>
                            <img src={"/empty.svg"} className={" w-8 h-8"}/>
                            <h2 className={"text-center text-xl"}>Il semble qu&apos;aucune page n&apos;a été ajoutée
                                pour le moment.</h2>
                        </div>
                }
            </section>
        </main>
    );
}