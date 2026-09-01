"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NavContextType {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen((prev) => !prev);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <NavContext.Provider value={{ isOpen, toggle, open, close }}>
    {children}
    </NavContext.Provider>
);
}

export function useNav() {
    const context = useContext(NavContext);
    if (!context) {
        throw new Error("useNav doit être utilisé à l'intérieur d'un NavProvider");
    }
    return context;
}