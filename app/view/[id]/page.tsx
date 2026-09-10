import Services from "@/app/services";

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
        <h1 className={"text-4xl font-bold text-center mb-10"}>{pageDetails.page.titre}</h1>
        {
            pageDetails.elements.sort((a, b)=>a.position!>b.position!?1:-1).map((e) => {
                console.log(e)
                console.log(pageDetails.titres);
                if (pageDetails.titres.find((t) => t.element_id === e.id)) {
                    return <h1 className={"text-2xl mt-6 mb-2 text-center font-bold"}
                               key={e.id}>{pageDetails.titres.find((t) => t.element_id === e.id)!.value}</h1>
                }
                if (pageDetails.textes.find((t) => t.element_id === e.id)) {
                    return <p className={"text-center"}
                              key={e.id}>{pageDetails.textes.find((t) => t.element_id === e.id)!.value.split('\n').map((txtprt, i) => <span key={`${e.id}txt${i}`}>{txtprt}<br/></span>)}</p>
                }

                if (pageDetails.photos.find((p) => p.element_id === e.id)) {
                    return <img className={"max-w-[500px] w-full object-contain rounded-xl"} key={e.id} src={pageDetails.photos.find((p) => p.element_id === e.id)!.chemin} alt={"illustration"+e.id}/>
                }
            })
        }
    </main>
}