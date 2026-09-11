"use client"

import Anm from "@/app/components/Animator3000";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ReseauBtn({nom, icone, lien}:{nom:string, icone:string, lien:string}) {
    return <Anm y={0} scale={0}>
        <Link href={lien} target={"_blank"}>
            <motion.img
                whileTap={{scale:0.9}}
                whileHover={{opacity:0.9}}
                src={icone} alt={nom} className={"rounded-full w-8 h-8 object-contain"}/>
        </Link>
    </Anm>
}