export const generateOTP = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const OTP_DETAILS = {
    // EXPIRATION_TIME:  5 * 1000, // 5 sec
    EXPIRATION_TIME: 3 * 60 * 1000, // 3 minutes
    MIN_INTERVAL: 0.5 * 60 * 1000 , // 30 seconds
    PASSED_TIME:  4 * 60 * 60 * 1000,
    MAX_RESEND_COUNT: 3,
} as const;

export const TOKEN_EXPIRY = {
    ACCESS: "15m",
    REFRESH: {
        NORMAL: "7d",
        REMEMBER_ME: "30d",
    },
    RESET_PASSWORD: "15m",
} as const;

export const COOKIE_MAX_AGE = {
    // ACCESS: 15 * 60 * 1000, // 15 min in ms
    REFRESH: {
        NORMAL: 7 * 24 * 60 * 60 * 1000, // 7 days
        REMEMBER_ME: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
} as const;