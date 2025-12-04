export const RedisKey = {
    USER: {
        CANDIDATE_EDUCATION: (id: number | string) => `user:${id}:candidateEducation`,
        
    } as const,

    PACKAGE: {
    ALL: 'packages:all',
    // ACTIVE: 'packages:active',
    BY_ID: (id: number | string) => `packages:${id}`,
  } as const,
} as const;