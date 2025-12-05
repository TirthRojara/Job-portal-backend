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
    INDUSTRY: 'industry',
    PACKAGE: {
        ALL: 'packages:all',
        BY_ID: (id: number | string) => `packages:${id}`
    } as const,

    CHAT: {
        //  #### redis is remaining in chat ####
        LIST: (id: number | string, page: number) => `user:${id}:chatList:${page}`,
        CHAT: (chatRoomId: number | string) => `chatRoom:${chatRoomId}`
    } as const,

    COMPANY: {
        ID: (companyId: number | string) => `company:${companyId}`,
        ME: (userId: number | string) => `user:${userId}:company`,
        INDUSTRY: (companyId: number | string) => `company:${companyId}:industry`
    },

    JOB: {
        SKILL: (jobId: number | string) => `job:${jobId}:skill`
    }
} as const;
