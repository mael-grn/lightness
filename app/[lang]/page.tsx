import Image from "next/image";
import {getDictionary, Locale} from "@/app/recup-dictionnaire";

interface Props {
    params: Promise<{ lang: Locale }>;
}

export default async function Home({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
  return (
    <div>
        <h1>{dict.ui.description}</h1>
  efezf
    </div>
  );
}
