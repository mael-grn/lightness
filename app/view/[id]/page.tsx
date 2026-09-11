import Services from "@/app/services";
import Anm from "@/app/components/Animator3000";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page({params}: PageProps) {
    const {id} = await params;
    const [pageDetails] = await Promise.all([
        Services.getPageDetails(Number(id)).catch(() => null),
    ]);

    if (!pageDetails) {
        return <main>
            <h1 className={"text-3xl mb-6"}>Cette page semble vide...</h1>
            <p>Vérifiez l&apos;url.</p>
        </main>
    }
    return <main className={"flex flex-col gap-3 justify-center items-center"}>
        <Anm>
            <h1 className={"text-4xl font-bold text-center mb-10"}>{pageDetails.page.titre}</h1>
        </Anm>
        {
            pageDetails.elements.sort((a, b)=>a.position!>b.position!?1:-1).map((e, i) => {
                console.log(e)
                console.log(pageDetails.titres);
                if (pageDetails.titres.find((t) => t.element_id === e.id)) {
                    return <Anm delay={0.1+i/8} key={e.id}>
                        <h1 className={"text-2xl mt-6 mb-2 text-center font-bold"}
                            >{pageDetails.titres.find((t) => t.element_id === e.id)!.value}</h1>
                    </Anm>
                }
                if (pageDetails.textes.find((t) => t.element_id === e.id)) {
                    return <Anm delay={0.1+i/8} key={e.id}>
                        <p className={"text-center"}
                           >{pageDetails.textes.find((t) => t.element_id === e.id)!.value.split('\n').map((txtprt, i) => <span key={`${e.id}txt${i}`}>{txtprt}<br/></span>)}</p>
                    </Anm>
                }

                if (pageDetails.photos.find((p) => p.element_id === e.id)) {
                    return <Anm key={e.id} delay={0.1+i/8}>
                        <img className={"max-w-[500px] w-full object-contain rounded-xl"}  src={pageDetails.photos.find((p) => p.element_id === e.id)!.chemin} alt={"illustration"+e.id}/>
                    </Anm>
                }
            })
        }
    </main>
}