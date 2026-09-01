import type {Metadata} from "next";
import {Archivo_Black, JetBrains_Mono, Geologica} from "next/font/google";
import "./globals.css";
import PageWrapper from "@/app/components/PageWrapper";
import NavBar from "@/app/components/NavBar";
import {NavProvider} from "@/app/context/NavContext";

const Archivo = Archivo_Black({
    variable: "--font-archivo",
    weight: "400"
});

const Jetbrains = JetBrains_Mono({
    variable: "--font-jetbrains",
    subsets: ["latin"],
});

const Geologicaa = Geologica({
    variable: "--font-geologica",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Maël garnier",
    description: "Mon portfolio",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="fr"
            className={`${Jetbrains.variable} ${Archivo.variable} ${Geologicaa.variable} h-full antialiased`}
        >

        <body className="min-h-screen bg-background w-full">
        <NavProvider>
            <header>
                <NavBar/>
            </header>
            <PageWrapper>
                <div className={"fixed top-0 left-0 w-full h-20 bg-linear-to-b from-background to-transparent"}></div>
                {children}
            </PageWrapper>
        </NavProvider>

        </body>
        </html>
    );
}
