import ReseauBtn from "@/app/components/ReseauBtn";

export default function Footer() {
    return <footer className={"w-full flex gap-3 pb-24 flex-col items-center justify-center p-6 bg-background"}>
        <div className={"w-full flex gap-4 items-center justify-center"}>
            <ReseauBtn nom={"Instagram"} icone={"/insta.png"} lien={"https://www.instagram.com/duo.lightness/#"}/>
            <ReseauBtn nom={"Facebook"} icone={"/facebook.png"} lien={"https://www.facebook.com/profile.php?id=61572124588105"}/>
            <ReseauBtn nom={"Youtube"} icone={"/youtube.png"} lien={"https://youtube.com/@lightnessduo?si=1RNZsU3QMKeqMrCm"}/>

        </div>
        <p className={"text-center"}>
            Basé en Drôme et Nouvelle Aquitaine
        </p>
        <p className={"text-center"}>
            duo.lightness@gmail.com
        </p>
        <p className={"text-center"}>
            © 2026 Lightness. Tous droits réservés
        </p>
    </footer>
}