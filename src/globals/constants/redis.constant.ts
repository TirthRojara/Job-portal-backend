export const RedisKey = {
    USER: 'user',
    // PACKAGE: 'package'

    PACKAGE: {
    ALL: 'packages:all',
    // ACTIVE: 'packages:active',
    BY_ID: (id: number | string) => `packages:${id}`,
  } as const,
} as const;