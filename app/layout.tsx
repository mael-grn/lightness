import type {Metadata} from "next";
    import {Limelight, Geologica, Bricolage_Grotesque} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageWrapper from "@/app/components/PageWrapper";
import NavBar from "@/app/components/NavBar";
import {NavProvider} from "@/app/context/NavContext";
import BottomNav from "@/app/components/BottomNav";
import Footer from "@/app/components/Footer";

const brico = Bricolage_Grotesque({
    variable: "--font-brico",
    weight: "400"
});

const valleySans = localFont({
    src: "../public/fonts/ValleySans-VariableFont_wght.ttf",
    variable: "--font-valley-sans",
    display: "swap",
});


const Geologicaa = Geologica({
    variable: "--font-geologica",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Lightness Duo",
    description: "Duo piano, synthétiseur et voix. Découvrez les compositions originales intimistes de Lightness, en concert privé ou sur scène en Drôme et Nouvelle-Aquitaine."
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="fr"
            className={`${valleySans.variable} ${brico.variable} ${Geologicaa.variable}`}
        >
        <body className={"bg-background"}>
        <main  className="min-h-screen bg-background w-full sm:p-20 p-6 flex flex-col sm:gap-24 gap-16 items-center">
            {children}
            <BottomNav/>
        </main>
        <Footer/>
        </body>
        </html>
    );
}
