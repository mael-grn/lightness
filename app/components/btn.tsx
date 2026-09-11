import { motion } from "framer-motion";
import {useState} from "react";

export interface BtnProps {icon: string; text:string; action: () => void, type?: "button" | "submit" | "reset", loading?: boolean, disabled? : boolean, validation?:boolean}
export default function Btn({icon, action, text, type="button", loading=false, disabled=false, validation=false}: BtnProps) {

    const [askAgain, setAskAgain] = useState(false);

    const onClick = () => {
        console.log("click")
        if (validation) {
            console.log("validation", validation)
            if (!askAgain) {
                console.log("no ask again")

                setAskAgain(true);
                return
            }
            console.log("already asked")

        }
        action();
    }
    return <motion.button
        disabled={disabled}
        type={type}
        transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1]
    }}
        whileHover={{
            opacity: 0.7,
        }}
        whileTap={{
            opacity: 0.7,
            scale: 0.9
        }}
        onClick={!disabled ? onClick : () => {}}
        className={`w-fit cursor-pointer disabled:cursor-default disabled:bg-foreground/40 border-0 flex items-center gap-2 ${askAgain ? "bg-red-700" : "bg-foreground"} text-background py-3 px-5 rounded-full`}>
        {
            loading ?
                <img src={"/spinner.gif"} alt={"spinner"} className={"h-6 w-6 invert h-full object-cover"} />
                :
                <img src={"/" + icon + ".svg"} alt={icon} className={"h-6 w-6 invert h-full object-cover"}/>
        }
        {askAgain ? "Valider ?" : text}
    </motion.button>
}