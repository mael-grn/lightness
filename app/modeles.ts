export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}

export interface Page {
    id?: number;
    titre: string;
}

export interface Element {
    id?: number;
    page_id: number;
    position?: string;
    element_id?: number;

}

export interface Musique extends Element  {
    id?: number;
    nom: string;
    chemin_son: string;
}

export interface Titre extends Element  {
    id?: number;
    value: string;
}

export interface Texte extends Element  {
    id?: number;
    value: string;
}

export interface Photo extends Element  {
    id?: number;
    chemin: string;
}

export interface PageDetails {
    page: Page;
    elements: Element[];
    titres: Titre[];
    textes: Texte[];
    musiques: Musique[];
    photos: Photo[];
}