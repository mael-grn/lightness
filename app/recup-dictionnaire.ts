
// src/app/recup-dictionnaire.ts
import 'server-only';
import type fr from '@/app/dictionnaires/fr.json';

// Type dérivé automatiquement de la structure du JSON
export type Dictionary = typeof fr;

const dictionaries = {
    fr: () => import('@/app/dictionnaires/fr.json').then((module) => module.default),
    en: () => import('@/app/dictionnaires/en.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    const loadDictionary = dictionaries[locale] ?? dictionaries.fr;
    return (await loadDictionary()) as Dictionary;
};