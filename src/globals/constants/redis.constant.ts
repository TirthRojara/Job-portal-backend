export const RedisKey = {
    USER: {
        CANDIDATE_EDUCATION: (id: number | string) => `user:${id}:candidateEducation`,
        CANDIDATE_EXPERIENCE: (id: number | string) => `user:${id}:candidateExperience`,
        CANDIDATE_LANGUAGE: (id: number | string) => `user:${id}:candidateLanguage`,
        CANDIDATE: {
            PROFILE: (id: number | string) => `user:${id}:candidateProfile`,
            RESUME: (id: number | string) => `user:${id}:candidateResume`
        },
        CANDIDATE_SKILL: (id: number | string) => `user:${id}:candidateSkills`
    } as const,

    SKILLS: 'skills',
    PACKAGE: {
        ALL: 'packages:all',
        // ACTIVE: 'packages:active',
        BY_ID: (id: number | string) => `packages:${id}`
    } as const
} as const;
