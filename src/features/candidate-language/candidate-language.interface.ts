import { Level } from "@prisma/client";

export interface ICandidateLanguageCreate{
    languageName: string;
    level: Level;
}

