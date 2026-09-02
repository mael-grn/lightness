import { useState, useEffect } from "react";

export function useScrollTop(threshold = 0): boolean {
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY <= threshold);
        };

        // Vérification initiale au montage
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return isAtTop;
}