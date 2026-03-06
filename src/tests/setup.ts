jest.mock('~/features/auth/auth.service', () => ({
    authService: {
        generateOtp: jest.fn(),
        verifyOtp: jest.fn(),
        generateJwtToken: jest.fn(),
        verifyJwtToken: jest.fn(),
        storeRefreshToken: jest.fn(),
        getExpiryDate: jest.fn()
    }
}));

jest.mock('~/features/user/user.service', () => ({
    userService: {
        createUser: jest.fn(),
        findUserByEmail: jest.fn(),
        checkPassword: jest.fn()
    },
    userOAuthService: {
        OAuthSignupLogin: jest.fn(),
        setPasswordForOauth: jest.fn(),
        isPasswordSet: jest.fn()
    }
}));

jest.mock('arctic', () => {
    return {
        Google: jest.fn().mockImplementation(() => ({
            createAuthorizationURL: jest.fn(),
            validateAuthorizationCode: jest.fn()
        })),
        decodeIdToken: jest.fn()
    };
});
