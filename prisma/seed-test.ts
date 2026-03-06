import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

async function main() {
    const prisma = new PrismaClient();

    const hashedPassword = await bcrypt.hash('Password@123', 10);

    // Candidate user
    await prisma.user.create({
        data: {
            name: 'Rahul Sharma',
            email: 'candidate@test.com',
            password: hashedPassword,
            role: 'CANDIDATE',
            isVerified: true,
            authType: 'EMAIL'
        }
    });

    // Recruiter user
    await prisma.user.create({
        data: {
            name: 'Amit Patel',
            email: 'recruiter@test.com',
            password: hashedPassword,
            role: 'RECRUITER',
            isVerified: true,
            authType: 'EMAIL'
        }
    });

    console.log('✅ Test users created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        const prisma = new PrismaClient();
        await prisma.$disconnect();
    });
