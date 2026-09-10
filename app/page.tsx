
import Services from "@/app/services";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const [heroImageUrl, pages] = await Promise.all([
        Services.getHeroImageUrl().catch(() => null),
        Services.getPages().catch(() => null),
    ]);

    return (
        <>
            <div id="Accueil" className=" flex w-full flex-col h-screen gap-6 items-center">
                <h1 className="sm:text-7xl w-full text-5xl font-bold text-center">
                    Lightness Duo
                </h1>
                <img className={" h-2/3 object-cover rounded-4xl"}
                     src={(heroImageUrl && heroImageUrl.length > 0) ? "/default-bg.jpg" : "/default-bg.jpg"}/>
            </div>

            <section className={"w-full flex flex-col gap-4 items-center justify-center"}>
                {
                    pages ?
                    pages.map((p) => <Link
                        key={p.id}
                        href={"/view/" + p.id}
                        className={"w-full px-6 py-3 rounded-full bg-primary text-background flex items-center justify-center hover:opacity-75 active:scale-90 transition-all"}
                    >
                        {p.titre}
                    </Link>)
                        :
                        <div className={"w-full flex flex-col gap-4 items-center justify-center"}>
                            <img src={"/empty.svg"} className={" w-8 h-8"}/>
                            <h2 className={"text-center text-xl"}>Il semble qu&apos;aucune page n&apos;a été ajoutée pour le moment.</h2>
                        </div>
                }
            </section>

        </>
    );
}