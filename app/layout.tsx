import type {Metadata} from "next";
import {Bricolage_Grotesque, Limelight, Geologica} from "next/font/google";
import "./globals.css";
import PageWrapper from "@/app/components/PageWrapper";
import NavBar from "@/app/components/NavBar";
import {NavProvider} from "@/app/context/NavContext";

const brico = Bricolage_Grotesque({
    variable: "--font-brico",
    weight: "400"
});

const limelight = Limelight({
    variable: "--font-lime",
    weight: "400",
    subsets: ["latin"],
});

const Geologicaa = Geologica({
    variable: "--font-geologica",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Lightness Duo",
    description: "",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="fr"
            className={`${limelight.variable} ${brico.variable} ${Geologicaa.variable} h-full antialiased`}
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
