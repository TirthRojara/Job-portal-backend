import request from 'supertest';
import app from '../testApp';
import { userService } from '~/features/user/user.service';
import { authService } from '~/features/auth/auth.service';

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /signup', () => {
        it('should signup user and send OTP', async () => {
            (userService.createUser as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                name: 'Test'
            });

            (authService.generateOtp as jest.Mock).mockResolvedValue(123456);

            const res = await request(app).post('/api/v1/auth/signup').send({
                name: 'Test',
                email: 'test@test.com',
                password: 'Password@123',
                role: 'CANDIDATE'
            });

            expect(res.status).toBe(200);

            expect(userService.createUser).toHaveBeenCalled();
            expect(authService.generateOtp).toHaveBeenCalled();

            expect(res.body.message).toContain('OTP sent successfully');
        });
    });

    describe('POST /login', () => {
        it('should login successfully', async () => {
            (userService.findUserByEmail as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                password: 'hashed',
                role: 'CANDIDATE',
                isVerified: true,
                authType: 'EMAIL'
            });

            (userService.checkPassword as jest.Mock).mockResolvedValue(true);

            (authService.generateJwtToken as jest.Mock)
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');

            (authService.getExpiryDate as jest.Mock).mockReturnValue(new Date());

            const res = await request(app).post('/api/v1/auth/login').send({
                email: 'test@test.com',
                password: 'Password@123',
                isRememberMe: false
            });

            expect(res.status).toBe(200);
            expect(res.body.data.token).toBe('access-token');
        });
    });

    describe('POST /verify', () => {
        it('should verify OTP', async () => {
            (userService.findUserByEmail as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                role: 'CANDIDATE'
            });

            (authService.verifyOtp as jest.Mock).mockResolvedValue(true);

            (authService.generateJwtToken as jest.Mock)
                .mockReturnValueOnce('access-token')
                .mockReturnValueOnce('refresh-token');

            (authService.getExpiryDate as jest.Mock).mockReturnValue(new Date());

            const res = await request(app).post('/api/v1/auth/verify').set('Cookie', ['email=test@test.com']).send({
                otp: 123456
            });

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('User verified successfully');
        });
    });

    describe('POST /forgot-password', () => {
        it('should send forgot password OTP', async () => {
            (userService.findUserByEmail as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                isVerified: true,
                authType: 'EMAIL'
            });

            (authService.generateOtp as jest.Mock).mockResolvedValue(123456);

            const res = await request(app).post('/api/v1/auth/forgot-password').send({
                email: 'test@test.com'
            });

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('OTP sent');
        });
    });
});
