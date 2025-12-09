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
        INDUSTRY: (companyId: number | string) => `company:${companyId}:industry`,
        VIEWS_SET: (companyId: number) => `company:${companyId}:views:set`,
        VIEWS_COUNT: (companyId: number | string) => `company:${companyId}:views:count`
    },

    JOB: {
        SKILL: (jobId: number | string) => `job:${jobId}:skill`,
        BENEFIT: (jobId: number | string) => `job:${jobId}:benefit`,
        ME: (userId: number | string) => `user:${userId}:job`,
        ID: (jobId: number | string) => `job:${jobId}`,
        VIEWS_SET: (jobId: number) => `job:${jobId}:views:set`,
        VIEWS_COUNT: (jobId: number | string) => `job:${jobId}:views:count`
    },
    JOB_ROLL: 'jobRoll',
    JOB_BENEFIT: 'jobBenefit',

    APPLY: {
        READ_MY_APPLICATION_CANDIDATE: (userId: number | string) => `user:${userId}:candidate:apply`,
        READ_MY_APPLICATION_CANDIDATE_PAGINATION: (userId: number | string) =>
            `user:${userId}:candidate:apply:pagination`,
        READ_MY_APPLICATION_RECRUITER: (jobId: number, companyId: number) =>
            `recruiter:apply:company:${companyId}:jobId:${jobId}`,
        READ_MY_APPLICATION_RECRUITER_PAGINATION: (jobId: number, companyId: number) =>
            `recruiter:apply:company:${companyId}:jobId:${jobId}:pagination`
    }
} as const;
