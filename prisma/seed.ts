import { CandidateProfile, Education, Language, PrismaClient, Skill } from '@prisma/client';

const prisma = new PrismaClient();

// async function main() {
//     async function createLanguageData() {
//         const data: Language[] = [{ name: 'english' }, { name: 'hindi' }, { name: 'gujarati' }];

//         await prisma.language.createMany({
//             data,
//             skipDuplicates: true
//         });
//     }

//     async function createEducationData() {
//         const data = [
//             {
//                 name: 'Harvard University',
//                 map: 'https://maps.app.goo.gl/S9XNcoozcmWp5znL7'
//             },
//             {
//                 name: 'Stanford University',
//                 map: 'https://maps.app.goo.gl/49sahvX93NuwFaXY8'
//             },
//             {
//                 name: 'California Institute of Technology',
//                 map: 'https://maps.app.goo.gl/qxn9bG5mQVr7894P9'
//             }
//         ];

//         await prisma.education.createMany({
//             data,
//             skipDuplicates: true
//         });
//     }

//     async function createSkillData() {
//         const data = [
//             { name: 'JavaScript' },
//             { name: 'TypeScript' },
//             { name: 'Java' },
//             { name: 'C++' },
//             { name: 'C#' },
//             { name: 'C' },
//             { name: 'HTML' },
//             { name: 'CSS' },
//             { name: 'Python' },
//             { name: 'ReactJs' },
//             { name: 'NodeJs' },
//             { name: 'ExpressJs' },
//             { name: 'NextJs' }
//         ];

//         await prisma.skill.createMany({
//             data,
//             skipDuplicates: true
//         });
//     }

//     async function createIndustryData() {
//         const data = [
//             { name: 'IT' },
//             { name: 'Finance' },
//             { name: 'Healthcare' },
//             { name: 'Education' },
//             { name: 'Retail' }
//         ];

//         await prisma.industry.createMany({
//             data,
//             skipDuplicates: true
//         });
//     }

//     async function createJobRoleData() {
//         const data = [{ name: 'internship' }, { name: 'fresher' }, { name: 'junior' }, { name: 'senior' }];

//         await prisma.jobRole.createMany({
//             data,
//             skipDuplicates: true
//         });
//     }

//     async function createBenefitData() {
//         const data = [
//             { name: 'medical converage' },
//             { name: 'dental insurance' },
//             { name: 'vision insurance' },
//             { name: 'life insurance' },
//             { name: 'mental health coverage' }
//         ];

//         await prisma.benefit.createMany({
//             data,
//             skipDuplicates: true
//         });
//     }

//     async function chatTest() {
//         console.log('🌱 Seeding started...');

//         // ---- Create Chats ----
//         const chat1 = await prisma.chat.create({
//             data: {
//                 companyId: 26,
//                 candidateProfileId: 22,
//                 chatRoomId: 'chat_26_22',
//                 lastMessage: 'Hello Rahul',
//                 lastMessageAt: new Date('2026-02-20T10:00:00Z'),
//                 companyUnreadCount: 1
//             }
//         });

//         const chat2 = await prisma.chat.create({
//             data: {
//                 companyId: 26,
//                 candidateProfileId: 23,
//                 chatRoomId: 'chat_26_23',
//                 lastMessage: 'Interview scheduled',
//                 lastMessageAt: new Date('2026-02-20T11:00:00Z'),
//                 candidateUnreadCount: 2
//             }
//         });

//         const chat3 = await prisma.chat.create({
//             data: {
//                 companyId: 26,
//                 candidateProfileId: 24,
//                 chatRoomId: 'chat_26_24',
//                 lastMessage: 'Please send resume',
//                 lastMessageAt: new Date('2026-02-20T12:00:00Z')
//             }
//         });

//         const chat4 = await prisma.chat.create({
//             data: {
//                 companyId: 29,
//                 candidateProfileId: 20,
//                 chatRoomId: 'chat_29_20',
//                 lastMessage: 'Offer letter sent',
//                 lastMessageAt: new Date('2026-02-21T09:00:00Z')
//             }
//         });

//         const chat5 = await prisma.chat.create({
//             data: {
//                 companyId: 29,
//                 candidateProfileId: 26,
//                 chatRoomId: 'chat_29_26',
//                 lastMessage: 'Waiting for response',
//                 lastMessageAt: new Date('2026-02-21T10:30:00Z')
//             }
//         });

//         // ---- Create Messages ----
//         await prisma.message.createMany({
//             data: [
//                 {
//                     chatId: chat1.id,
//                     senderId: 26,
//                     receiverId: 22,
//                     content: 'Hello Rahul',
//                     createdAt: new Date('2026-02-20T10:00:00Z')
//                 },
//                 {
//                     chatId: chat1.id,
//                     senderId: 22,
//                     receiverId: 26,
//                     content: 'Hello Sir',
//                     isRead: true,
//                     createdAt: new Date('2026-02-20T10:05:00Z')
//                 },
//                 {
//                     chatId: chat2.id,
//                     senderId: 26,
//                     receiverId: 23,
//                     content: 'Interview scheduled for Monday',
//                     createdAt: new Date('2026-02-20T11:00:00Z')
//                 },
//                 {
//                     chatId: chat3.id,
//                     senderId: 26,
//                     receiverId: 24,
//                     content: 'Please send resume',
//                     createdAt: new Date('2026-02-20T12:00:00Z')
//                 },
//                 {
//                     chatId: chat4.id,
//                     senderId: 29,
//                     receiverId: 20,
//                     content: 'Offer letter sent',
//                     createdAt: new Date('2026-02-21T09:00:00Z')
//                 },
//                 {
//                     chatId: chat5.id,
//                     senderId: 26,
//                     receiverId: 29,
//                     content: 'I will respond soon',
//                     isRead: false,
//                     createdAt: new Date('2026-02-21T10:30:00Z')
//                 }
//             ]
//         });

//         console.log('✅ Seeding finished.');
//     }

//     // chatTest();
//     // createLanguageData();
//     // createEducationData();
//     // createSkillData();
//     // createIndustryData();
//     // createJobRoleData();
//     // createBenefitData();
// }

// main()
//     .then()
//     .catch((err) => console.log(err));

async function main() {
  console.log("🌱 Starting seed...");

  // ─────────────────────────────────────────────
  // Users
  // ─────────────────────────────────────────────
  await prisma.user.createMany({
    data: [
      { id: 1,  name: "test1",        email: "test1@gmail.com",                  password: "$2b$10$tivi7LKTWj5bdxPKeVEVCuVmTacKrUSLL.XAVbucpKdbXqvkSQ6MC", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 5,  name: "test2",        email: "test2@gmail.com",                  password: "$2b$10$0TwHV4O3ZgzI/BndobA4t.J3IRq8IlL15k5Cjls1Q5dAQiYgBuwAS", role: "RECRUITER",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 6,  name: "admin",        email: "test3@gmail.com",                  password: "$2a$10$IR/HgmUuFCzzze58rD3LAO5cFyGd8fnGx.wXrQgnir0DUaSzml8A6", role: "ADMIN",      isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 10, name: "test4",        email: "test4@gmail.com",                  password: "$2b$10$kbp6bVlXWKB1WD.ySxl6JeQ.U6epjBK3IAOxNLoOw5aqRAfilsScW", role: "RECRUITER",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 11, name: "test5",        email: "test5@gmail.com",                  password: "$2b$10$DBMD2CGozV0TlzuH9N9ZXeWmtuxFDqrLfag6h6bP/X/xPr0w9xdoW", role: "RECRUITER",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 12, name: "test6",        email: "test6@gmail.com",                  password: "$2b$10$QAMlPNBA93SfFsZ8XcD37.6gXLj8GdIafa3E0Csji4SFizAAHUoNO", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 13, name: "test7",        email: "test7@gmail.com",                  password: "$2b$10$3vp9x/LPumZeayjT86ozyeNeBLfiex2/P6QY3ByMrQqZEJfv4dnIe", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 14, name: "test8",        email: "test8@gmail.com",                  password: "$2b$10$XbRNtTfqdbmjloRPm9SF9.OnjnNbe3lqdEOnwkgQNpc8Y4A2YqUCi", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 15, name: "test9",        email: "test9@gmail.com",                  password: "$2b$10$nZDkbMxj3H0tbHkdc8Pa9ugPVH5Lh850WyJiH3rFX8ptj7KoWkD.e", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 16, name: "test10",       email: "test10@gmail.com",                 password: "$2b$10$CZLdtRFjOxMrLJuFwisjwe/uzPqHZUAYhOM/8.ausQ9rV/PPq9Zuu", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 17, name: "test11",       email: "test11@gmail.com",                 password: "$2b$10$MDn7l7enceP4tBzp7m8SPeuMUsteWvC8vx4CvAouGiquoch4z/C..", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 24, name: "dev mode",     email: "dev1@gmail.com",                   password: "$2b$10$LzeMJY1D8VA08RLgS9kb2OEeaTJ/1hfLyP50JMSngcQzHM13FED8e", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 28, name: "dev 2",        email: "dev2@gmail.com",                   password: "$2b$10$KXLerrBBx2A6P2zZ6muS5.leWsoh1/Cj7p272ExZ.W3YuxBSFXe/G", role: "RECRUITER",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 29, name: "dev 3",        email: "dev3@gmail.com",                   password: "$2b$10$WDrD8pyOop48lQqkIG.JXOtaVnMkeS649oLUsbkJgDW6Pp5GqA8jS", role: "CANDIDATE",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 30, name: "dev 4",        email: "dev4@gmail.com",                   password: "$2b$10$avVqubuQ6u2iIO/vqRtFuOenolJM2wqByvgg3Hjan.Hxo6j.NpuMe", role: "RECRUITER",  isVerified: true,  authType: "EMAIL", ProviderAuthId: null },
      { id: 31, name: "dev 5",        email: "dev5@gmail.com",                   password: "$2b$10$sbHSeO4uVDHLAIAojvz5uuOjWxImDGMfC8mdqfJhhEtG9FyZ0W5sK", role: "RECRUITER",  isVerified: false, authType: "EMAIL", ProviderAuthId: null },
      { id: 32, name: "Tirth Rojara", email: "tirth744clg@gmail.com",            password: "$2b$10$2T0XezSn9FwJsCpwl/gxyuE2ouJWKe9qs2JQtQCG4vX.THmWmseJe", role: "CANDIDATE",  isVerified: true,  authType: "OAUTH", ProviderAuthId: "111775024968718260082" },
      { id: 35, name: "TIRTH ROJARA", email: "work.tirthrojara@gmail.com",       password: null,                                                                role: "CANDIDATE",  isVerified: true,  authType: "OAUTH", ProviderAuthId: "104786090748769641224" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Users seeded");

  // ─────────────────────────────────────────────
  // AuthOTP
  // ─────────────────────────────────────────────
  await prisma.authOTP.createMany({
    data: [
      { id: 7,  otpCode: 744330, expiresAt: new Date("2026-01-28T19:12:25.748Z"), lastOtpSentAt: new Date("2026-01-28T19:09:25.748Z"), resendCount: 2,  failedLoginAttempts: 0, lockUntil: null, otpFor: "FORGOT_PASSWORD", resetToken: null, userId: 1  },
      { id: 8,  otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 5  },
      { id: 9,  otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 6  },
      { id: 10, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 10 },
      { id: 11, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 11 },
      { id: 12, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 12 },
      { id: 13, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 13 },
      { id: 14, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 14 },
      { id: 15, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 15 },
      { id: 16, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 16 },
      { id: 17, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 17 },
      { id: 18, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "FORGOT_PASSWORD", resetToken: null, userId: 24 },
      { id: 19, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "FORGOT_PASSWORD", resetToken: null, userId: 28 },
      { id: 20, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 29 },
      { id: 21, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 30 },
      { id: 22, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 3,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 31 },
      { id: 23, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 0,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 32 },
      { id: 26, otpCode: null,   expiresAt: null,                                  lastOtpSentAt: null,                                  resendCount: 0,  failedLoginAttempts: 0, lockUntil: null, otpFor: "VERIFICATION",    resetToken: null, userId: 35 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ AuthOTP seeded");

  // ─────────────────────────────────────────────
  // Languages
  // ─────────────────────────────────────────────
  await prisma.language.createMany({
    data: [
      { name: "Spanish"  },
      { name: "Japanese" },
      { name: "Korean"   },
      { name: "French"   },
      { name: "Italian"  },
      { name: "English"  },
      { name: "Gujarati" },
      { name: "Hindi"    },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Languages seeded");

  // ─────────────────────────────────────────────
  // Education
  // ─────────────────────────────────────────────
  await prisma.education.createMany({
    data: [
      { id: 1,  name: "Harvard University",                                  map: "https://maps.app.goo.gl/S9XNcoozcmWp5znL7" },
      { id: 2,  name: "Stanford University",                                 map: "https://maps.app.goo.gl/49sahvX93NuwFaXY8"  },
      { id: 3,  name: "California Institute of Technology",                  map: "https://maps.app.goo.gl/qxn9bG5mQVr7894P9"  },
      { id: 17, name: "IIT Kharagpur",                                       map: "https://maps.app.goo.gl/S9XNcoozcmWp5znL7" },
      { id: 18, name: "IIT Bombay",                                          map: "https://maps.app.goo.gl/S9XNcoozcmWp5znL7" },
      { id: 19, name: "IIT Madras",                                          map: "https://maps.app.goo.gl/S9XNcoozcmWp5znL7" },
      { id: 20, name: "IIT Gandhinagar",                                     map: "https://maps.app.goo.gl/S9XNcoozcmWp5znL7" },
      { id: 21, name: "Gujarat Technological University (GTU)",               map: "https://maps.app.goo.gl/S9XNcoozcmWp5znL7" },
      { id: 22, name: "Indian Institute of Information Technology Surat (IIIT Surat)", map: "https://maps.app.goo.gl/S9XNcoozcmWp5znL7" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Education seeded");

  // ─────────────────────────────────────────────
  // Industry
  // ─────────────────────────────────────────────
  await prisma.industry.createMany({
    data: [
      { id: 1, name: "IT"         },
      { id: 2, name: "Finance"    },
      { id: 3, name: "Healthcare" },
      { id: 4, name: "Education"  },
      { id: 5, name: "Retail"     },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Industries seeded");

  // ─────────────────────────────────────────────
  // Skill
  // ─────────────────────────────────────────────
  await prisma.skill.createMany({
    data: [
      { id: 1,  name: "JavaScript"  },
      { id: 2,  name: "TypeScript"  },
      { id: 3,  name: "Java"        },
      { id: 4,  name: "C++"         },
      { id: 5,  name: "C#"          },
      { id: 6,  name: "C"           },
      { id: 7,  name: "HTML"        },
      { id: 8,  name: "CSS"         },
      { id: 9,  name: "Python"      },
      { id: 10, name: "ReactJs"     },
      { id: 11, name: "NodeJs"      },
      { id: 12, name: "ExpressJs"   },
      { id: 13, name: "NextJs"      },
      { id: 53, name: "SpringBoot"  },
      { id: 54, name: "Prisma"      },
      { id: 55, name: "SQL"         },
      { id: 56, name: "Postgresql"  },
      { id: 57, name: "Mongodb"     },
      { id: 58, name: "Go"          },
      { id: 59, name: "Rust"        },
      { id: 60, name: "Docker"      },
      { id: 61, name: "CI/CD"       },
      { id: 62, name: "Jest"        },
      { id: 63, name: "Gen Ai"      },
      { id: 64, name: "Postman"     },
      { id: 65, name: "Git"         },
      { id: 66, name: "Redis"       },
      { id: 67, name: "Socket.io"   },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Skills seeded");

  // ─────────────────────────────────────────────
  // Benefit
  // ─────────────────────────────────────────────
  await prisma.benefit.createMany({
    data: [
      { name: "medical converage"    },
      { name: "dental insurance"     },
      { name: "vision insurance"     },
      { name: "life insurance"       },
      { name: "mental health coverage" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Benefits seeded");

  // ─────────────────────────────────────────────
  // JobRole
  // ─────────────────────────────────────────────
  await prisma.jobRole.createMany({
    data: [
      { id: 1, name: "internship" },
      { id: 2, name: "fresher"    },
      { id: 3, name: "junior"     },
      { id: 4, name: "senior"     },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Job Roles seeded");

  // ─────────────────────────────────────────────
  // Package
  // ─────────────────────────────────────────────
  await prisma.package.createMany({
    data: [
      { id: 1, planId: "Basic",  label: "plan_SFzFpMUsPBCG1c", price: 399, jobPostLimit: 10,  isActive: true },
      { id: 2, planId: "Pro",    label: "plan_SFzGPoz26mfv0h", price: 699, jobPostLimit: 25,  isActive: true },
      { id: 4, planId: "Free",   label: "342352",               price: 0,   jobPostLimit: 100, isActive: true },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Packages seeded");

  // ─────────────────────────────────────────────
  // Company
  // ─────────────────────────────────────────────
  await prisma.company.createMany({
    data: [
      {
        id: 26, name: "TechNova Solutions",
        description: "TechNova Solutions is a fast-growing SaaS company focused on building scalable cloud platforms for global enterprises. The company specializes in distributed systems, microservices architecture, and modern DevOps practices. Its engineering team works with cutting-edge technologies to deliver reliable and high-performance software solutions. TechNova partners with companies worldwide to help them modernize their digital infrastructure.",
        location: "Bangalore, India",
        address: "Koramangala 5th Block, Bangalore, Karnataka",
        mapLink: "https://maps.google.com/?q=Koramangala+Bangalore",
        websiteUrl: "https://technovasolutions.com",
        teamSizeLabel: "FIFTY_ONE_TO_TWO_HUNDRED",
        totalEmployees: 85,
        establishedDate: new Date("2018-04-14T00:00:00.000Z"),
        isApproved: false, views: 10, userId: 5,
      },
      {
        id: 29, name: "BlueWave Technologies",
        description: "BlueWave Technologies develops AI-powered analytics platforms designed for the finance and healthcare industries. The company focuses on transforming large volumes of data into meaningful insights that help businesses make strategic decisions. Its engineers work on machine learning pipelines, real-time data processing, and scalable cloud systems. BlueWave serves both startups and large enterprises across multiple global markets.",
        location: "Hyderabad, India",
        address: "HITEC City, Hyderabad, Telangana",
        mapLink: "https://maps.google.com/?q=HITEC+City+Hyderabad",
        websiteUrl: "bluewavetech.ai",
        teamSizeLabel: "FIFTY_ONE_TO_TWO_HUNDRED",
        totalEmployees: 145,
        establishedDate: new Date("2016-09-09T00:00:00.000Z"),
        isApproved: false, views: 0, userId: 10,
      },
      {
        id: 34, name: "CloudSphere Systems",
        description: "CloudSphere Systems provides enterprise-grade cloud infrastructure solutions and DevOps consulting services. The company specializes in Kubernetes, container orchestration, and scalable deployment pipelines for modern applications. Its platform helps organizations migrate legacy systems to cloud-native architectures efficiently. CloudSphere works with global clients across fintech, e-commerce, and enterprise software sectors.",
        location: "Gurgaon, India",
        address: "Cyber City, Gurgaon, Haryana\n",
        mapLink: "https://maps.google.com/?q=Cyber+City+Gurgaon",
        websiteUrl: "cloudsphere.io",
        teamSizeLabel: "TWO_HUNDRED_ONE_TO_FIVE_HUNDRED",
        totalEmployees: 278,
        establishedDate: new Date("2015-06-17T00:00:00.000Z"),
        isApproved: false, views: 0, userId: 28,
      },
      {
        id: 36, name: "GreenByte Labs",
        description: "GreenByte Labs is a technology startup focused on building sustainable and energy-efficient software solutions. The company develops platforms that help businesses reduce energy consumption and monitor environmental impact. Its products combine IoT, analytics, and cloud technology to improve sustainability initiatives. GreenByte works with industries such as manufacturing, logistics, and renewable energy.",
        location: "Pune, India",
        address: "Baner Road, Pune, Maharashtra",
        mapLink: "https://maps.google.com/?q=Baner+Road+Pune",
        websiteUrl: "greenbytelabs.com",
        teamSizeLabel: "ELEVEN_TO_FIFTY",
        totalEmployees: 34,
        establishedDate: new Date("2020-03-10T00:00:00.000Z"),
        isApproved: false, views: 0, userId: 11,
      },
      {
        id: 37, name: "DataForge Analytics",
        description: "DataForge Analytics is a modern data engineering consultancy helping startups and enterprises build scalable data platforms. The company designs robust data pipelines, analytics dashboards, and machine learning workflows. Its team works with technologies such as Spark, Kafka, and cloud data warehouses. DataForge empowers organizations to transform raw data into actionable insights.",
        location: "Mumbai, India",
        address: "Andheri East, Mumbai, Maharashtra",
        mapLink: "https://maps.google.com/?q=Andheri+East+Mumbai",
        websiteUrl: "dataforgeanalytics.com",
        teamSizeLabel: "ELEVEN_TO_FIFTY",
        totalEmployees: 41,
        establishedDate: new Date("2020-03-17T00:00:00.000Z"),
        isApproved: false, views: 0, userId: 30,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Companies seeded");

  // ─────────────────────────────────────────────
  // CompanyIndustry
  // ─────────────────────────────────────────────
  await prisma.companyIndustry.createMany({
    data: [
      { id: 57, companyId: 26, industryId: 1 },
      { id: 58, companyId: 29, industryId: 1 },
      { id: 59, companyId: 36, industryId: 1 },
      { id: 61, companyId: 34, industryId: 1 },
      { id: 62, companyId: 37, industryId: 1 },
      { id: 63, companyId: 37, industryId: 2 },
      { id: 64, companyId: 26, industryId: 2 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Company Industries seeded");

  // ─────────────────────────────────────────────
  // CandidateProfile
  // ─────────────────────────────────────────────
  const candidateProfiles: CandidateProfile[] = [
    { id: 20, fullName: "Tirth Rojara",  gender: "MALE",   phone: "1234567890", cv: "1772713818077-726324026-Tirth_Rojara_Resume.docx.pdf",  birthDate: new Date("2004-04-06"), address: "Rajkot, Gujarat, India", openToWork: true,  status: true,  userId: 1,  summary: "Full Stack Developer with a strong background in JavaScript ecosystems\nincluding React, Next.js, and Node.js. Experienced in building APIs,\nworking with relational and NoSQL databases, and deploying scalable\napplications in cloud environments." },
    { id: 21, fullName: "Rohan Vaghela", gender: "MALE",   phone: "1234567891", cv: "1765106066427-715343647-Testing_pdf.pdf",                birthDate: new Date("2000-12-30"), address: "Rajkot, Gujarat",       openToWork: true,  status: true,  userId: 12, summary: "Results-driven Full Stack Developer experienced in building modern web\napplications using JavaScript, TypeScript, React, and Express.js. Skilled\nin designing REST APIs and working with databases like MongoDB and\nPostgreSQL to build efficient backend systems." },
    { id: 22, fullName: "Raj Patel",     gender: "MALE",   phone: "1234567892", cv: "1765106176030-800985700-Testing_pdf.pdf",                birthDate: new Date("2000-12-30"), address: "Rajkot, Gujarat",       openToWork: true,  status: true,  userId: 13, summary: "Detail-oriented Full Stack Developer with strong experience in frontend\ndevelopment using React and backend development using Node.js. I enjoy\nbuilding scalable systems and optimizing application performance while\nmaintaining clean and reusable code." },
    { id: 23, fullName: "Jay koli",      gender: "MALE",   phone: "1234567893", cv: "1765106225833-838535530-Testing_pdf.pdf",                birthDate: new Date("2000-12-30"), address: "Rajkot, Gujarat",       openToWork: true,  status: true,  userId: 14, summary: "Full Stack Developer passionate about building responsive and reliable\nweb applications. Experienced in React, Next.js, Node.js, and modern\ndatabase technologies. I enjoy working in collaborative environments\nand contributing to impactful products." },
    { id: 24, fullName: "Harsh Parmar", gender: "MALE",   phone: "1234567894", cv: "1765106267491-441732623-Testing_pdf.pdf",                birthDate: new Date("2000-12-30"), address: "Rajkot, Gujarat",       openToWork: true,  status: true,  userId: 15, summary: "Software developer specializing in full stack web development with\nexperience in building production-grade applications. Skilled in\nJavaScript, React, Node.js, and cloud-based deployments. Always eager\nto learn new tools and improve system architecture." },
    { id: 25, fullName: "Meet Doshi",   gender: "MALE",   phone: "1234567895", cv: "1765106376320-487931170-Testing_pdf.pdf",                birthDate: new Date("2000-12-30"), address: "Rajkot, Gujarat",       openToWork: true,  status: true,  userId: 16, summary: "Creative Full Stack Developer focused on building user-friendly\napplications and scalable backend systems. Experienced in working\nwith modern JavaScript frameworks and API-driven architectures.\nStrong interest in performance optimization and clean code practices." },
    { id: 26, fullName: "Kartik Pandya", gender: "MALE",  phone: "1234567896", cv: "1765116170390-292543088-Testing_pdf.pdf",                birthDate: new Date("2000-12-30"), address: "Rajkot, Gujarat",       openToWork: true,  status: true,  userId: 17, summary: "Full Stack Engineer with hands-on experience developing web platforms\nusing React, Node.js, Express, and MongoDB. Passionate about building\nproducts that solve real-world problems while ensuring great user\nexperience and system reliability." },
    { id: 39, fullName: "Mihir Thakar", gender: "FEMALE", phone: "1111111111", cv: "1770740868861-554126785-dev1.pdf",                       birthDate: new Date("2026-02-11"), address: "sdaa",                  openToWork: true,  status: true,  userId: 24, summary: "Motivated Full Stack Developer experienced in designing and developing\nweb applications from concept to deployment. Skilled in modern\nfrontend frameworks and backend services with a focus on performance,\nsecurity, and maintainability." },
  ];
  await prisma.candidateProfile.createMany({ data: candidateProfiles, skipDuplicates: true });
  console.log("✅ Candidate Profiles seeded");

  // ─────────────────────────────────────────────
  // CandidateSkill
  // ─────────────────────────────────────────────
  await prisma.candidateSkill.createMany({
    data: [
      { id: 14, candidateProfileId: 39, skillId: 1  },
      { id: 15, candidateProfileId: 39, skillId: 2  },
      { id: 16, candidateProfileId: 39, skillId: 3  },
      { id: 18, candidateProfileId: 20, skillId: 1  },
      { id: 19, candidateProfileId: 20, skillId: 2  },
      { id: 20, candidateProfileId: 20, skillId: 10 },
      { id: 21, candidateProfileId: 20, skillId: 11 },
      { id: 22, candidateProfileId: 20, skillId: 12 },
      { id: 23, candidateProfileId: 20, skillId: 13 },
      { id: 25, candidateProfileId: 20, skillId: 54 },
      { id: 26, candidateProfileId: 20, skillId: 56 },
      { id: 27, candidateProfileId: 20, skillId: 57 },
      { id: 28, candidateProfileId: 20, skillId: 60 },
      { id: 29, candidateProfileId: 20, skillId: 61 },
      { id: 30, candidateProfileId: 20, skillId: 64 },
      { id: 31, candidateProfileId: 20, skillId: 62 },
      { id: 32, candidateProfileId: 20, skillId: 65 },
      { id: 33, candidateProfileId: 20, skillId: 66 },
      { id: 39, candidateProfileId: 20, skillId: 67 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Candidate Skills seeded");

  // ─────────────────────────────────────────────
  // CandidateLanguage
  // ─────────────────────────────────────────────
  await prisma.candidateLanguage.createMany({
    data: [
      { candidateProfileId: 20, languageName: "English",  level: "FLUENT" },
      { candidateProfileId: 20, languageName: "Gujarati", level: "NATIVE" },
      { candidateProfileId: 39, languageName: "English",  level: "FLUENT" },
      { candidateProfileId: 39, languageName: "Gujarati", level: "NATIVE" },
      { candidateProfileId: 39, languageName: "Hindi",    level: "NATIVE" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Candidate Languages seeded");

  // ─────────────────────────────────────────────
  // CandidateEducation
  // ─────────────────────────────────────────────
  await prisma.candidateEducation.createMany({
    data: [
      { id: 6,  major: "Bachelor of Science in Computer Science", degree: "BACHELOR", yearStart: 2021, yearEnd: 2225, candidateProfileId: 20, educationId: 2  },
      { id: 8,  major: "B.Tech IT",                               degree: "BACHELOR", yearStart: 2021, yearEnd: 2025, candidateProfileId: 20, educationId: 2  },
      { id: 26, major: "B.Tech Civil",                            degree: "BACHELOR", yearStart: 2026, yearEnd: 2026, candidateProfileId: 39, educationId: 1  },
      { id: 27, major: "MBA",                                     degree: "MASTER",   yearStart: 2026, yearEnd: 2030, candidateProfileId: 39, educationId: 21 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Candidate Education seeded");

  // ─────────────────────────────────────────────
  // CandidateExperience
  // ─────────────────────────────────────────────
  await prisma.candidateExperience.createMany({
    data: [
      {
        id: 6, companyName: "Zoom", department: "Backend", startDate: new Date("2026-02-04"), endDate: null,
        position: "SDE1",
        description: "Built and maintained backend APIs using Node.js, Express, and TypeScript for internal web applications.\nImplemented authentication systems using JWT and secure session management.\nIntegrated third-party services and handled API request validation using Zod and middleware.\nParticipated in code reviews and improved code quality through best backend practices. ",
        currentlyWorking: false, workPlace: "REMOTE", location: "Banglore", candidateProfileId: 20,
      },
      {
        id: 8, companyName: "Star Link", department: "Backend", startDate: new Date("2025-04-10"), endDate: new Date("2026-03-03"),
        position: "SDE1",
        description: "Developed microservices for handling user data, job applications, and notifications.\nUsed Redis caching to improve performance and reduce database load on frequently accessed endpoints.\nWorked with Docker containers for development and deployment environments.\nMaintained database schemas using Prisma ORM and PostgreSQL. ",
        currentlyWorking: false, workPlace: "REMOTE", location: "Banglore", candidateProfileId: 20,
      },
      {
        id: 19, companyName: "Google", department: "Backend Developers", startDate: new Date("2026-02-19"), endDate: null,
        position: "SDE2",
        description: "i am working at google as full stack developer",
        currentlyWorking: true, workPlace: "REMOTE", location: "India", candidateProfileId: 39,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Candidate Experience seeded");

  // ─────────────────────────────────────────────
  // Job
  // ─────────────────────────────────────────────
  const jobDescription = "We are looking for a passionate software engineer to join our growing engineering team.\nYou will work on scalable web applications that serve thousands of users every day.\nThe role involves collaborating with product managers, designers, and backend engineers\nto deliver high-quality software solutions. Our team follows modern development practices\nincluding code reviews, automated testing, and continuous deployment.\nYou will have the opportunity to work with modern technologies and cloud infrastructure\nwhile solving real-world problems for customers around the globe.";
  const jobResponsibilities = "Design, develop, and maintain scalable web applications and backend services.\nCollaborate with cross-functional teams including designers and product managers.\nWrite clean, maintainable, and well-documented code following best practices.\nParticipate in code reviews and contribute to improving engineering standards.\nDebug and resolve technical issues in production environments.\nOptimize applications for maximum performance and scalability.\nStay updated with emerging technologies and propose improvements to the platform.";
  const jobRequirements = "Bachelor's degree in Computer Science or a related technical field.\nStrong understanding of modern JavaScript or backend programming languages.\nExperience with web frameworks and RESTful API development.\nFamiliarity with relational or NoSQL databases.\nUnderstanding of version control systems such as Git.\nAbility to work in a collaborative and agile development environment.\nStrong problem-solving skills and attention to detail.";
  const cloudDescription = "We are looking for a skilled Cloud & DevOps Engineer to design, implement,\nand maintain scalable cloud infrastructure and deployment pipelines.\nYou will work closely with software engineers, security teams,\nand infrastructure teams to build reliable and automated systems.\nThe role involves managing CI/CD pipelines, monitoring infrastructure,\nand improving deployment reliability across multiple environments.\nYou will help optimize system performance, automate operational tasks,\nand ensure high availability for mission-critical applications.\nThis position offers the opportunity to work with modern cloud technologies,\ncontainer orchestration platforms, and infrastructure automation tools.";
  const cloudResponsibilities = "Design, implement, and maintain cloud infrastructure using AWS, Azure, or GCP.\nDevelop and maintain CI/CD pipelines to automate software delivery.\nManage containerized applications using Docker and Kubernetes.\nMonitor infrastructure health and troubleshoot production incidents.\nImplement infrastructure as code using tools like Terraform or Pulumi.\nCollaborate with development teams to improve deployment workflows.\nEnsure system reliability, scalability, and security best practices.\nOptimize infrastructure costs and resource utilization across environments.";
  const cloudRequirements = "Bachelor's degree in Computer Science, Engineering, or a related field.\nExperience with cloud platforms such as AWS, Azure, or Google Cloud.\nStrong knowledge of containerization tools like Docker and Kubernetes.\nExperience building CI/CD pipelines using tools like GitHub Actions or Jenkins.\nKnowledge of infrastructure as code tools such as Terraform or CloudFormation.\nUnderstanding of networking, security practices, and monitoring systems.\nExperience with Linux systems and scripting languages such as Bash or Python.\nStrong troubleshooting skills and ability to work in distributed environments.";
  const financeDescription = "We are looking for a detail-oriented finance professional to join our growing finance team.\nThe candidate will support financial planning, reporting, and analysis activities\nthat help drive strategic business decisions across the organization.\nYou will work closely with senior finance leaders, operations teams,\nand external stakeholders to ensure financial transparency and compliance.\nThe role involves analyzing financial performance, monitoring budgets,\nand identifying opportunities for cost optimization and growth.\nThis position offers an opportunity to work in a fast-paced environment\nwhile contributing to the financial stability and expansion of the company.";
  const financeResponsibilities = "Prepare and analyze financial statements, reports, and forecasts.\nMonitor company budgets and track expenses against financial targets.\nAssist in financial planning, budgeting, and variance analysis.\nEnsure compliance with financial regulations and company policies.\nCollaborate with internal departments to support financial decision making.\nEvaluate investment opportunities and financial risks.\nSupport audits and maintain accurate financial documentation.\nIdentify cost-saving opportunities and recommend financial improvements.";
  const financeRequirements = "Bachelor's degree in Finance, Accounting, Economics, or a related field.\nStrong understanding of financial reporting and accounting principles.\nExperience working with financial models and budgeting tools.\nProficiency in Microsoft Excel or financial analysis software.\nKnowledge of financial regulations, taxation, and compliance standards.\nStrong analytical thinking and problem-solving abilities.\nExcellent attention to detail and organizational skills.\nAbility to communicate financial insights to non-financial stakeholders.";

  await prisma.job.createMany({
    data: [
      { id: 44, title: "Full Stack Developer",          description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Bangalore, India",  workplace: "HYBRID",  status: "ACTIVE", salaryMin: 40000,  salaryMax: 50000,  postedAt: new Date("2026-03-03T19:27:53.017Z"), applicationDeadline: new Date("2026-05-13"), updateAt: new Date("2026-03-03T19:39:10.447Z"), totalview: 0, isDeleted: false, companyId: 26, postById: 5, jobRoleId: 2 },
      { id: 45, title: "Backend Developer",             description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements + " ", location: "Bangalore, India",  workplace: "REMOTE",  status: "ACTIVE", salaryMin: 35000,  salaryMax: 45000,  postedAt: new Date("2026-03-03T19:32:16.068Z"), applicationDeadline: new Date("2026-05-14"), updateAt: new Date("2026-03-03T19:34:30.459Z"), totalview: 0, isDeleted: false, companyId: 26, postById: 5, jobRoleId: 2 },
      { id: 46, title: "MERN Stack Developer",         description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Bangalore, India",  workplace: "REMOTE",  status: "ACTIVE", salaryMin: 45000,  salaryMax: 50000,  postedAt: new Date("2026-03-03T19:36:50.607Z"), applicationDeadline: new Date("2026-05-13"), updateAt: new Date("2026-03-03T19:39:36.514Z"), totalview: 0, isDeleted: false, companyId: 26, postById: 5, jobRoleId: 2 },
      { id: 47, title: "Frontend Developer",           description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Bangalore, India",  workplace: "HYBRID",  status: "ACTIVE", salaryMin: 40000,  salaryMax: 45000,  postedAt: new Date("2026-03-03T19:41:38.688Z"), applicationDeadline: new Date("2026-05-13"), updateAt: new Date("2026-03-03T19:42:06.931Z"), totalview: 0, isDeleted: false, companyId: 26, postById: 5, jobRoleId: 2 },
      { id: 48, title: "Full Stack Developer",         description: jobDescription + " ",responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Bangalore, India",  workplace: "REMOTE",  status: "ACTIVE", salaryMin: 100000, salaryMax: 120000, postedAt: new Date("2026-03-03T19:45:32.783Z"), applicationDeadline: new Date("2026-05-13"), updateAt: new Date("2026-03-04T14:19:25.949Z"), totalview: 0, isDeleted: false, companyId: 26, postById: 5, jobRoleId: 4 },
      { id: 49, title: "Frontend Developer",           description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Hyderabad, India",  workplace: "HYBRID",  status: "ACTIVE", salaryMin: 60000,  salaryMax: 80000,  postedAt: new Date("2026-03-03T19:57:19.256Z"), applicationDeadline: new Date("2026-05-29"), updateAt: new Date("2026-03-03T19:57:48.656Z"), totalview: 0, isDeleted: false, companyId: 29, postById: 10, jobRoleId: 4 },
      { id: 50, title: "React Developer",              description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Hyderabad, India",  workplace: "REMOTE",  status: "ACTIVE", salaryMin: 30000,  salaryMax: 40000,  postedAt: new Date("2026-03-04T08:22:09.524Z"), applicationDeadline: new Date("2026-05-29"), updateAt: new Date("2026-03-04T08:22:59.762Z"), totalview: 0, isDeleted: false, companyId: 29, postById: 10, jobRoleId: 2 },
      { id: 51, title: "MERN Stack Developer",         description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Hyderabad, India",  workplace: "ONSITE",  status: "ACTIVE", salaryMin: 80000,  salaryMax: 100000, postedAt: new Date("2026-03-04T08:25:27.925Z"), applicationDeadline: new Date("2026-05-30"), updateAt: new Date("2026-03-04T08:26:39.532Z"), totalview: 0, isDeleted: false, companyId: 29, postById: 10, jobRoleId: 4 },
      { id: 52, title: "Node.js Developer",            description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Hyderabad, India",  workplace: "ONSITE",  status: "ACTIVE", salaryMin: 45000,  salaryMax: 55000,  postedAt: new Date("2026-03-04T08:29:51.831Z"), applicationDeadline: new Date("2026-05-27"), updateAt: new Date("2026-03-04T08:30:55.197Z"), totalview: 0, isDeleted: false, companyId: 29, postById: 10, jobRoleId: 2 },
      { id: 53, title: "Full Stack Gen Ai Developer",  description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Hyderabad, India",  workplace: "ONSITE",  status: "ACTIVE", salaryMin: 50000,  salaryMax: 70000,  postedAt: new Date("2026-03-04T08:33:09.361Z"), applicationDeadline: new Date("2026-05-30"), updateAt: new Date("2026-03-04T08:34:08.980Z"), totalview: 0, isDeleted: false, companyId: 29, postById: 10, jobRoleId: 3 },
      { id: 54, title: "Frontend Developer",           description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Pune, India",       workplace: "REMOTE",  status: "ACTIVE", salaryMin: 10000,  salaryMax: 15000,  postedAt: new Date("2026-03-04T08:44:38.957Z"), applicationDeadline: new Date("2026-06-29"), updateAt: new Date("2026-03-04T08:45:13.094Z"), totalview: 0, isDeleted: false, companyId: 36, postById: 11, jobRoleId: 1 },
      { id: 55, title: "Backend Developer",            description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Pune, India",       workplace: "REMOTE",  status: "ACTIVE", salaryMin: 45000,  salaryMax: 50000,  postedAt: new Date("2026-03-04T13:36:13.676Z"), applicationDeadline: new Date("2026-06-29"), updateAt: new Date("2026-03-04T13:37:16.839Z"), totalview: 0, isDeleted: false, companyId: 36, postById: 11, jobRoleId: 2 },
      { id: 56, title: "Full Stack Developer",         description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Pune, India",       workplace: "HYBRID",  status: "ACTIVE", salaryMin: 50000,  salaryMax: 55000,  postedAt: new Date("2026-03-04T13:38:30.813Z"), applicationDeadline: new Date("2026-05-29"), updateAt: new Date("2026-03-04T13:39:38.753Z"), totalview: 0, isDeleted: false, companyId: 36, postById: 11, jobRoleId: 2 },
      { id: 57, title: "MERN Stack Developer",         description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Pune, India",       workplace: "HYBRID",  status: "ACTIVE", salaryMin: 70000,  salaryMax: 85000,  postedAt: new Date("2026-03-04T13:41:20.551Z"), applicationDeadline: new Date("2026-05-30"), updateAt: new Date("2026-03-04T13:42:10.593Z"), totalview: 0, isDeleted: false, companyId: 36, postById: 11, jobRoleId: 4 },
      { id: 58, title: "Full Stack Developer",         description: jobDescription,     responsibilities: jobResponsibilities,     requirements: jobRequirements,     location: "Pune, India",       workplace: "REMOTE",  status: "ACTIVE", salaryMin: 80000,  salaryMax: 95000,  postedAt: new Date("2026-03-04T13:43:51.794Z"), applicationDeadline: new Date("2026-03-27"), updateAt: new Date("2026-03-04T13:44:45.765Z"), totalview: 0, isDeleted: false, companyId: 36, postById: 11, jobRoleId: 4 },
      { id: 59, title: "Cloud Engineer",               description: cloudDescription,   responsibilities: cloudResponsibilities,   requirements: cloudRequirements,   location: "Gurgaon, India",    workplace: "REMOTE",  status: "ACTIVE", salaryMin: 50000,  salaryMax: 60000,  postedAt: new Date("2026-03-04T13:53:56.952Z"), applicationDeadline: new Date("2026-05-28"), updateAt: new Date("2026-03-04T13:54:19.238Z"), totalview: 0, isDeleted: false, companyId: 34, postById: 28, jobRoleId: 3 },
      { id: 60, title: "DevOps Engineer",              description: cloudDescription,   responsibilities: cloudResponsibilities,   requirements: cloudRequirements,   location: "Gurgaon, India",    workplace: "HYBRID",  status: "ACTIVE", salaryMin: 90000,  salaryMax: 105000, postedAt: new Date("2026-03-04T13:56:29.281Z"), applicationDeadline: new Date("2026-05-30"), updateAt: new Date("2026-03-04T13:56:33.931Z"), totalview: 0, isDeleted: false, companyId: 34, postById: 28, jobRoleId: 4 },
      { id: 61, title: "Cloud Infrastructure Engineer",description: cloudDescription,   responsibilities: cloudResponsibilities,   requirements: cloudRequirements,   location: "Gurgaon, India",    workplace: "ONSITE",  status: "ACTIVE", salaryMin: 110000, salaryMax: 120000, postedAt: new Date("2026-03-04T13:58:12.255Z"), applicationDeadline: new Date("2026-05-29"), updateAt: new Date("2026-03-04T13:58:18.097Z"), totalview: 0, isDeleted: false, companyId: 34, postById: 28, jobRoleId: 4 },
      { id: 62, title: "DevOps Engineer",              description: cloudDescription,   responsibilities: cloudResponsibilities,   requirements: cloudRequirements,   location: "Gurgaon, India",    workplace: "ONSITE",  status: "ACTIVE", salaryMin: 50000,  salaryMax: 65000,  postedAt: new Date("2026-03-04T13:59:54.174Z"), applicationDeadline: new Date("2026-06-29"), updateAt: new Date("2026-03-04T13:59:59.549Z"), totalview: 0, isDeleted: false, companyId: 34, postById: 28, jobRoleId: 2 },
      { id: 63, title: "Cloud Engineer",               description: cloudDescription,   responsibilities: cloudResponsibilities,   requirements: cloudRequirements,   location: "Gurgaon, India",    workplace: "ONSITE",  status: "ACTIVE", salaryMin: 150000, salaryMax: 170000, postedAt: new Date("2026-03-04T14:05:47.991Z"), applicationDeadline: new Date("2026-06-24"), updateAt: new Date("2026-03-04T14:05:54.220Z"), totalview: 0, isDeleted: false, companyId: 34, postById: 28, jobRoleId: 4 },
      { id: 64, title: "Financial Analyst",            description: financeDescription, responsibilities: financeResponsibilities, requirements: financeRequirements, location: "Mumbai, India",     workplace: "ONSITE",  status: "ACTIVE", salaryMin: 40000,  salaryMax: 55000,  postedAt: new Date("2026-03-04T14:09:34.063Z"), applicationDeadline: new Date("2026-05-27"), updateAt: new Date("2026-03-04T14:09:47.424Z"), totalview: 0, isDeleted: false, companyId: 37, postById: 30, jobRoleId: 2 },
      { id: 65, title: "Investment Analyst",           description: financeDescription, responsibilities: financeResponsibilities, requirements: financeRequirements, location: "Mumbai, India",     workplace: "ONSITE",  status: "ACTIVE", salaryMin: 80000,  salaryMax: 100000, postedAt: new Date("2026-03-04T14:11:24.957Z"), applicationDeadline: new Date("2026-06-27"), updateAt: new Date("2026-03-04T14:11:32.634Z"), totalview: 0, isDeleted: false, companyId: 37, postById: 30, jobRoleId: 4 },
      { id: 66, title: "Risk Analyst",                 description: financeDescription, responsibilities: financeResponsibilities, requirements: financeRequirements, location: "Mumbai, India",     workplace: "ONSITE",  status: "ACTIVE", salaryMin: 50000,  salaryMax: 65000,  postedAt: new Date("2026-03-04T14:13:21.328Z"), applicationDeadline: new Date("2026-06-29"), updateAt: new Date("2026-03-04T14:13:29.713Z"), totalview: 0, isDeleted: false, companyId: 37, postById: 30, jobRoleId: 2 },
      { id: 67, title: "Financial Analyst",            description: financeDescription, responsibilities: financeResponsibilities, requirements: financeRequirements, location: "Mumbai, India",     workplace: "ONSITE",  status: "ACTIVE", salaryMin: 130000, salaryMax: 145000, postedAt: new Date("2026-03-04T14:14:52.646Z"), applicationDeadline: new Date("2026-06-29"), updateAt: new Date("2026-03-04T14:15:00.976Z"), totalview: 0, isDeleted: false, companyId: 37, postById: 30, jobRoleId: 4 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Jobs seeded");

  // ─────────────────────────────────────────────
  // JobSkill
  // ─────────────────────────────────────────────
  await prisma.jobSkill.createMany({
    data: [
      { jobId: 44, skillId: 1  }, { jobId: 44, skillId: 2  }, { jobId: 44, skillId: 10 }, { jobId: 44, skillId: 11 }, { jobId: 44, skillId: 12 }, { jobId: 44, skillId: 13 }, { jobId: 44, skillId: 57 }, { jobId: 44, skillId: 65 },
      { jobId: 45, skillId: 2  }, { jobId: 45, skillId: 11 }, { jobId: 45, skillId: 12 }, { jobId: 45, skillId: 65 }, { jobId: 45, skillId: 66 }, { jobId: 45, skillId: 57 }, { jobId: 45, skillId: 54 }, { jobId: 45, skillId: 56 }, { jobId: 45, skillId: 63 }, { jobId: 45, skillId: 64 }, { jobId: 45, skillId: 60 }, { jobId: 45, skillId: 62 },
      { jobId: 46, skillId: 1  }, { jobId: 46, skillId: 2  }, { jobId: 46, skillId: 10 }, { jobId: 46, skillId: 11 }, { jobId: 46, skillId: 12 }, { jobId: 46, skillId: 13 }, { jobId: 46, skillId: 57 }, { jobId: 46, skillId: 65 },
      { jobId: 47, skillId: 1  }, { jobId: 47, skillId: 2  }, { jobId: 47, skillId: 7  }, { jobId: 47, skillId: 8  }, { jobId: 47, skillId: 10 }, { jobId: 47, skillId: 13 }, { jobId: 47, skillId: 65 },
      { jobId: 48, skillId: 1  }, { jobId: 48, skillId: 2  }, { jobId: 48, skillId: 10 }, { jobId: 48, skillId: 11 }, { jobId: 48, skillId: 12 }, { jobId: 48, skillId: 13 }, { jobId: 48, skillId: 54 }, { jobId: 48, skillId: 56 }, { jobId: 48, skillId: 57 }, { jobId: 48, skillId: 65 }, { jobId: 48, skillId: 60 },
      { jobId: 49, skillId: 1  }, { jobId: 49, skillId: 2  }, { jobId: 49, skillId: 7  }, { jobId: 49, skillId: 8  }, { jobId: 49, skillId: 10 }, { jobId: 49, skillId: 13 },
      { jobId: 50, skillId: 10 }, { jobId: 50, skillId: 2  }, { jobId: 50, skillId: 1  }, { jobId: 50, skillId: 13 },
      { jobId: 51, skillId: 1  }, { jobId: 51, skillId: 2  }, { jobId: 51, skillId: 10 }, { jobId: 51, skillId: 11 }, { jobId: 51, skillId: 12 }, { jobId: 51, skillId: 13 }, { jobId: 51, skillId: 55 }, { jobId: 51, skillId: 57 }, { jobId: 51, skillId: 64 }, { jobId: 51, skillId: 65 }, { jobId: 51, skillId: 63 }, { jobId: 51, skillId: 56 },
      { jobId: 52, skillId: 1  }, { jobId: 52, skillId: 2  }, { jobId: 52, skillId: 11 }, { jobId: 52, skillId: 12 }, { jobId: 52, skillId: 54 }, { jobId: 52, skillId: 56 }, { jobId: 52, skillId: 57 }, { jobId: 52, skillId: 64 }, { jobId: 52, skillId: 65 },
      { jobId: 53, skillId: 1  }, { jobId: 53, skillId: 2  }, { jobId: 53, skillId: 10 }, { jobId: 53, skillId: 11 }, { jobId: 53, skillId: 12 }, { jobId: 53, skillId: 13 }, { jobId: 53, skillId: 54 }, { jobId: 53, skillId: 55 }, { jobId: 53, skillId: 56 }, { jobId: 53, skillId: 57 }, { jobId: 53, skillId: 63 }, { jobId: 53, skillId: 64 }, { jobId: 53, skillId: 65 },
      { jobId: 54, skillId: 1  }, { jobId: 54, skillId: 7  }, { jobId: 54, skillId: 8  }, { jobId: 54, skillId: 10 },
      { jobId: 55, skillId: 1  }, { jobId: 55, skillId: 2  }, { jobId: 55, skillId: 11 }, { jobId: 55, skillId: 12 }, { jobId: 55, skillId: 54 }, { jobId: 55, skillId: 56 }, { jobId: 55, skillId: 57 }, { jobId: 55, skillId: 64 }, { jobId: 55, skillId: 65 }, { jobId: 55, skillId: 66 },
      { jobId: 56, skillId: 1  }, { jobId: 56, skillId: 2  }, { jobId: 56, skillId: 10 }, { jobId: 56, skillId: 11 }, { jobId: 56, skillId: 12 }, { jobId: 56, skillId: 13 }, { jobId: 56, skillId: 56 }, { jobId: 56, skillId: 54 }, { jobId: 56, skillId: 57 }, { jobId: 56, skillId: 65 }, { jobId: 56, skillId: 64 }, { jobId: 56, skillId: 66 },
      { jobId: 57, skillId: 1  }, { jobId: 57, skillId: 2  }, { jobId: 57, skillId: 10 }, { jobId: 57, skillId: 11 }, { jobId: 57, skillId: 12 }, { jobId: 57, skillId: 57 }, { jobId: 57, skillId: 64 }, { jobId: 57, skillId: 65 },
      { jobId: 58, skillId: 1  }, { jobId: 58, skillId: 2  }, { jobId: 58, skillId: 10 }, { jobId: 58, skillId: 11 }, { jobId: 58, skillId: 12 }, { jobId: 58, skillId: 13 }, { jobId: 58, skillId: 54 }, { jobId: 58, skillId: 56 }, { jobId: 58, skillId: 57 }, { jobId: 58, skillId: 62 }, { jobId: 58, skillId: 60 }, { jobId: 58, skillId: 64 }, { jobId: 58, skillId: 65 }, { jobId: 58, skillId: 66 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Job Skills seeded");

  // ─────────────────────────────────────────────
  // JobBenefit
  // ─────────────────────────────────────────────
  await prisma.jobBenefit.createMany({
    data: [
      { jobId: 44, benefitName: "medical converage" },
      { jobId: 45, benefitName: "medical converage" },
      { jobId: 46, benefitName: "medical converage" },
      { jobId: 47, benefitName: "medical converage" },
      { jobId: 48, benefitName: "medical converage" },
      { jobId: 48, benefitName: "life insurance"    },
      { jobId: 49, benefitName: "life insurance"    },
      { jobId: 49, benefitName: "medical converage" },
      { jobId: 50, benefitName: "medical converage" },
      { jobId: 50, benefitName: "life insurance"    },
      { jobId: 51, benefitName: "medical converage" },
      { jobId: 51, benefitName: "life insurance"    },
      { jobId: 52, benefitName: "medical converage" },
      { jobId: 52, benefitName: "life insurance"    },
      { jobId: 53, benefitName: "medical converage" },
      { jobId: 53, benefitName: "life insurance"    },
      { jobId: 55, benefitName: "life insurance"    },
      { jobId: 55, benefitName: "medical converage" },
      { jobId: 56, benefitName: "life insurance"    },
      { jobId: 56, benefitName: "medical converage" },
      { jobId: 57, benefitName: "medical converage" },
      { jobId: 57, benefitName: "life insurance"    },
      { jobId: 58, benefitName: "medical converage" },
      { jobId: 58, benefitName: "life insurance"    },
      { jobId: 59, benefitName: "life insurance"    },
      { jobId: 60, benefitName: "life insurance"    },
      { jobId: 61, benefitName: "life insurance"    },
      { jobId: 62, benefitName: "life insurance"    },
      { jobId: 63, benefitName: "life insurance"    },
      { jobId: 64, benefitName: "life insurance"    },
      { jobId: 64, benefitName: "medical converage" },
      { jobId: 65, benefitName: "medical converage" },
      { jobId: 65, benefitName: "life insurance"    },
      { jobId: 66, benefitName: "medical converage" },
      { jobId: 66, benefitName: "life insurance"    },
      { jobId: 67, benefitName: "medical converage" },
      { jobId: 67, benefitName: "life insurance"    },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Job Benefits seeded");

  // ─────────────────────────────────────────────
  // Apply
  // ─────────────────────────────────────────────
  await prisma.apply.createMany({
    data: [
      { id: 42, applyDate: new Date("2026-03-04T14:33:03.229Z"), status: "PENDING",  companyId: 26, candidateProfileId: 20, jobId: 44 },
      { id: 43, applyDate: new Date("2026-03-04T14:33:05.034Z"), status: "PENDING",  companyId: 26, candidateProfileId: 20, jobId: 45 },
      { id: 44, applyDate: new Date("2026-03-04T14:33:11.525Z"), status: "PENDING",  companyId: 26, candidateProfileId: 20, jobId: 46 },
      { id: 45, applyDate: new Date("2026-03-04T14:33:20.953Z"), status: "SELECTED", companyId: 26, candidateProfileId: 20, jobId: 48 },
      { id: 46, applyDate: new Date("2026-03-04T14:33:28.840Z"), status: "SELECTED", companyId: 29, candidateProfileId: 20, jobId: 51 },
      { id: 47, applyDate: new Date("2026-03-04T14:33:53.785Z"), status: "PENDING",  companyId: 36, candidateProfileId: 20, jobId: 58 },
      { id: 48, applyDate: new Date("2026-03-04T14:33:56.814Z"), status: "SELECTED", companyId: 36, candidateProfileId: 20, jobId: 57 },
      { id: 49, applyDate: new Date("2026-03-04T14:34:26.499Z"), status: "PENDING",  companyId: 36, candidateProfileId: 20, jobId: 56 },
      { id: 50, applyDate: new Date("2026-03-04T14:34:30.709Z"), status: "PENDING",  companyId: 36, candidateProfileId: 20, jobId: 55 },
      { id: 51, applyDate: new Date("2026-03-04T14:35:35.650Z"), status: "INTOUCH",  companyId: 29, candidateProfileId: 20, jobId: 53 },
      { id: 52, applyDate: new Date("2026-03-04T14:35:37.832Z"), status: "SELECTED", companyId: 29, candidateProfileId: 20, jobId: 52 },
      { id: 53, applyDate: new Date("2026-03-04T14:35:42.007Z"), status: "PENDING",  companyId: 29, candidateProfileId: 20, jobId: 50 },
      { id: 54, applyDate: new Date("2026-03-04T14:40:18.532Z"), status: "INTOUCH",  companyId: 26, candidateProfileId: 21, jobId: 44 },
      { id: 55, applyDate: new Date("2026-03-04T14:40:20.112Z"), status: "PENDING",  companyId: 26, candidateProfileId: 21, jobId: 45 },
      { id: 56, applyDate: new Date("2026-03-04T14:40:21.988Z"), status: "PENDING",  companyId: 26, candidateProfileId: 21, jobId: 46 },
      { id: 57, applyDate: new Date("2026-03-04T14:40:23.461Z"), status: "PENDING",  companyId: 26, candidateProfileId: 21, jobId: 47 },
      { id: 58, applyDate: new Date("2026-03-04T14:40:27.981Z"), status: "PENDING",  companyId: 26, candidateProfileId: 21, jobId: 48 },
      { id: 59, applyDate: new Date("2026-03-04T16:47:38.508Z"), status: "PENDING",  companyId: 26, candidateProfileId: 22, jobId: 44 },
      { id: 60, applyDate: new Date("2026-03-04T16:47:39.736Z"), status: "PENDING",  companyId: 26, candidateProfileId: 22, jobId: 45 },
      { id: 61, applyDate: new Date("2026-03-04T16:47:40.999Z"), status: "PENDING",  companyId: 26, candidateProfileId: 22, jobId: 46 },
      { id: 62, applyDate: new Date("2026-03-04T16:47:42.225Z"), status: "PENDING",  companyId: 26, candidateProfileId: 22, jobId: 47 },
      { id: 63, applyDate: new Date("2026-03-04T16:47:44.225Z"), status: "PENDING",  companyId: 26, candidateProfileId: 22, jobId: 48 },
      { id: 64, applyDate: new Date("2026-03-04T16:50:17.979Z"), status: "PENDING",  companyId: 26, candidateProfileId: 23, jobId: 44 },
      { id: 65, applyDate: new Date("2026-03-04T16:50:19.343Z"), status: "PENDING",  companyId: 26, candidateProfileId: 23, jobId: 45 },
      { id: 66, applyDate: new Date("2026-03-04T16:50:20.644Z"), status: "PENDING",  companyId: 26, candidateProfileId: 23, jobId: 46 },
      { id: 67, applyDate: new Date("2026-03-04T16:50:22.842Z"), status: "PENDING",  companyId: 26, candidateProfileId: 23, jobId: 47 },
      { id: 68, applyDate: new Date("2026-03-04T16:50:24.094Z"), status: "PENDING",  companyId: 26, candidateProfileId: 23, jobId: 48 },
      { id: 69, applyDate: new Date("2026-03-04T16:53:26.995Z"), status: "PENDING",  companyId: 26, candidateProfileId: 24, jobId: 44 },
      { id: 70, applyDate: new Date("2026-03-04T16:53:28.213Z"), status: "PENDING",  companyId: 26, candidateProfileId: 24, jobId: 45 },
      { id: 71, applyDate: new Date("2026-03-04T16:53:29.469Z"), status: "PENDING",  companyId: 26, candidateProfileId: 24, jobId: 46 },
      { id: 72, applyDate: new Date("2026-03-04T16:53:30.587Z"), status: "PENDING",  companyId: 26, candidateProfileId: 24, jobId: 47 },
      { id: 73, applyDate: new Date("2026-03-04T16:53:32.128Z"), status: "PENDING",  companyId: 26, candidateProfileId: 24, jobId: 48 },
      { id: 74, applyDate: new Date("2026-03-04T16:54:01.608Z"), status: "PENDING",  companyId: 26, candidateProfileId: 25, jobId: 44 },
      { id: 75, applyDate: new Date("2026-03-04T16:54:02.716Z"), status: "PENDING",  companyId: 26, candidateProfileId: 25, jobId: 45 },
      { id: 76, applyDate: new Date("2026-03-04T16:54:03.878Z"), status: "PENDING",  companyId: 26, candidateProfileId: 25, jobId: 46 },
      { id: 77, applyDate: new Date("2026-03-04T16:54:05.381Z"), status: "PENDING",  companyId: 26, candidateProfileId: 25, jobId: 47 },
      { id: 78, applyDate: new Date("2026-03-04T16:54:06.816Z"), status: "PENDING",  companyId: 26, candidateProfileId: 25, jobId: 48 },
      { id: 79, applyDate: new Date("2026-03-04T16:55:53.637Z"), status: "PENDING",  companyId: 26, candidateProfileId: 26, jobId: 44 },
      { id: 80, applyDate: new Date("2026-03-04T16:55:55.001Z"), status: "PENDING",  companyId: 26, candidateProfileId: 26, jobId: 45 },
      { id: 81, applyDate: new Date("2026-03-04T16:55:56.600Z"), status: "PENDING",  companyId: 26, candidateProfileId: 26, jobId: 46 },
      { id: 82, applyDate: new Date("2026-03-04T16:55:57.915Z"), status: "PENDING",  companyId: 26, candidateProfileId: 26, jobId: 47 },
      { id: 83, applyDate: new Date("2026-03-04T16:55:59.307Z"), status: "PENDING",  companyId: 26, candidateProfileId: 26, jobId: 48 },
      { id: 84, applyDate: new Date("2026-03-04T16:57:34.706Z"), status: "PENDING",  companyId: 26, candidateProfileId: 39, jobId: 44 },
      { id: 85, applyDate: new Date("2026-03-04T16:57:35.940Z"), status: "PENDING",  companyId: 26, candidateProfileId: 39, jobId: 45 },
      { id: 86, applyDate: new Date("2026-03-04T16:57:37.416Z"), status: "PENDING",  companyId: 26, candidateProfileId: 39, jobId: 46 },
      { id: 87, applyDate: new Date("2026-03-04T16:57:38.965Z"), status: "PENDING",  companyId: 26, candidateProfileId: 39, jobId: 47 },
      { id: 88, applyDate: new Date("2026-03-04T16:57:40.623Z"), status: "INTOUCH",  companyId: 26, candidateProfileId: 39, jobId: 48 },
      { id: 89, applyDate: new Date("2026-03-05T10:22:14.739Z"), status: "INTOUCH",  companyId: 34, candidateProfileId: 20, jobId: 62 },
      { id: 90, applyDate: new Date("2026-03-05T12:30:42.982Z"), status: "PENDING",  companyId: 37, candidateProfileId: 20, jobId: 67 },
      { id: 91, applyDate: new Date("2026-03-05T12:30:47.646Z"), status: "PENDING",  companyId: 37, candidateProfileId: 20, jobId: 64 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Applications (Apply) seeded");

  // ─────────────────────────────────────────────
  // SaveJob
  // ─────────────────────────────────────────────
  await prisma.saveJob.createMany({
    data: [
      { id: 52, candidateProfileId: 20, jobId: 45, createdAt: new Date("2026-03-04T14:33:07.527Z") },
      { id: 53, candidateProfileId: 20, jobId: 44, createdAt: new Date("2026-03-04T14:33:08.882Z") },
      { id: 54, candidateProfileId: 20, jobId: 46, createdAt: new Date("2026-03-04T14:33:14.647Z") },
      { id: 55, candidateProfileId: 20, jobId: 47, createdAt: new Date("2026-03-04T14:33:18.004Z") },
      { id: 56, candidateProfileId: 20, jobId: 48, createdAt: new Date("2026-03-04T14:33:21.974Z") },
      { id: 57, candidateProfileId: 20, jobId: 50, createdAt: new Date("2026-03-04T14:33:25.880Z") },
      { id: 58, candidateProfileId: 20, jobId: 57, createdAt: new Date("2026-03-04T14:34:24.172Z") },
      { id: 59, candidateProfileId: 20, jobId: 56, createdAt: new Date("2026-03-04T14:34:27.839Z") },
      { id: 60, candidateProfileId: 20, jobId: 55, createdAt: new Date("2026-03-04T14:34:29.818Z") },
      { id: 62, candidateProfileId: 20, jobId: 67, createdAt: new Date("2026-03-05T12:30:50.131Z") },
      { id: 63, candidateProfileId: 20, jobId: 66, createdAt: new Date("2026-03-05T12:30:51.711Z") },
      { id: 65, candidateProfileId: 20, jobId: 65, createdAt: new Date("2026-03-05T12:30:59.247Z") },
      { id: 66, candidateProfileId: 20, jobId: 63, createdAt: new Date("2026-03-05T12:31:01.427Z") },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Saved Jobs seeded");

  // ─────────────────────────────────────────────
  // CheckLimitForRecruiter
  // ─────────────────────────────────────────────
  await prisma.checkLimitForRecruiter.createMany({
    data: [
      { id: 1, jobCount: 17, recruiterId: 5  },
      { id: 2, jobCount: 36, recruiterId: 10 },
      { id: 3, jobCount: 5,  recruiterId: 11 },
      { id: 4, jobCount: 5,  recruiterId: 28 },
      { id: 5, jobCount: 4,  recruiterId: 30 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ CheckLimitForRecruiter seeded");

  // ─────────────────────────────────────────────
  // RecruiterPackage
  // ─────────────────────────────────────────────
  await prisma.recruiterPackage.createMany({
    data: [
      { id: 1, startDate: new Date("2025-12-05T19:25:34.483Z"), endDate: null,                      razorpaySubscriptionId: null,           status: "ACTIVE", billingCycleCount: 0, userId: 10, packageId: 4 },
      { id: 2, startDate: new Date("2026-03-23T12:56:09.000Z"), endDate: new Date("2026-03-24"),    razorpaySubscriptionId: "sub_SNYHGx1QRVgfwG", status: "ACTIVE", billingCycleCount: 0, userId: 5,  packageId: 2 },
      { id: 3, startDate: new Date("2025-12-07T10:54:44.080Z"), endDate: null,                      razorpaySubscriptionId: null,           status: "ACTIVE", billingCycleCount: 0, userId: 11, packageId: 4 },
      { id: 5, startDate: new Date("2026-01-21T05:22:48.449Z"), endDate: null,                      razorpaySubscriptionId: null,           status: "ACTIVE", billingCycleCount: 0, userId: 24, packageId: 4 },
      { id: 6, startDate: new Date("2026-01-21T05:33:43.290Z"), endDate: null,                      razorpaySubscriptionId: null,           status: "ACTIVE", billingCycleCount: 0, userId: 28, packageId: 4 },
      { id: 7, startDate: new Date("2026-01-21T05:41:55.463Z"), endDate: null,                      razorpaySubscriptionId: null,           status: "ACTIVE", billingCycleCount: 0, userId: 30, packageId: 4 },
      { id: 8, startDate: new Date("2026-01-21T11:46:45.584Z"), endDate: null,                      razorpaySubscriptionId: null,           status: "ACTIVE", billingCycleCount: 0, userId: 31, packageId: 4 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ RecruiterPackages seeded");

  // ─────────────────────────────────────────────
  // Subscription
  // ─────────────────────────────────────────────
  await prisma.subscription.createMany({
    data: [
      { id: 25, razorpaySubscriptionId: "sub_SG631YgcpahIKi", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-14T16:46:18.944Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-14T16:46:18.946Z"), updatedAt: new Date("2026-02-14T16:46:18.946Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 26, razorpaySubscriptionId: "sub_SG63LZ8tLqrHQf", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T16:46:37.344Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-14T16:46:37.345Z"), updatedAt: new Date("2026-02-14T17:33:05.218Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-04-13T18:30:00.000Z") },
      { id: 27, razorpaySubscriptionId: "sub_SG6ArjqkHSh0cr", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T16:53:44.341Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-14T16:53:44.343Z"), updatedAt: new Date("2026-02-14T16:55:03.941Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 28, razorpaySubscriptionId: "sub_SG6Do9bUtAtz7H", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T16:56:31.928Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-14T16:56:31.929Z"), updatedAt: new Date("2026-02-14T16:56:54.088Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 29, razorpaySubscriptionId: "sub_SG6UN4R8QIqTk6", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T17:12:12.390Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-14T17:12:12.391Z"), updatedAt: new Date("2026-02-14T17:13:20.271Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 30, razorpaySubscriptionId: "sub_SG6YGeWawxjS9A", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T17:15:53.648Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-14T17:15:53.649Z"), updatedAt: new Date("2026-02-14T17:16:21.277Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 31, razorpaySubscriptionId: "sub_SG6fmF11vbQAYq", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T17:23:00.390Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-14T17:23:00.392Z"), updatedAt: new Date("2026-02-14T17:23:31.191Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 32, razorpaySubscriptionId: "sub_SG6iABhtMdq6oh", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T17:25:15.724Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-14T17:25:15.725Z"), updatedAt: new Date("2026-02-14T17:27:57.781Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 33, razorpaySubscriptionId: "sub_SG6taS5YjUjsxn", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-14T17:36:04.570Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-14T17:36:04.572Z"), updatedAt: new Date("2026-02-14T17:36:04.572Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 34, razorpaySubscriptionId: "sub_SG6u5p4NQXQnYY", razorpayPlanId: "plan_SFzGPoz26mfv0h", status: "CREATED",   startAt: new Date("2026-02-14T17:36:33.465Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-14T17:36:33.467Z"), updatedAt: new Date("2026-02-14T17:36:33.467Z"), recruiterId: 5, packageId: 2, nextPayment: null },
      { id: 35, razorpaySubscriptionId: "sub_SG6uLuWa3cXJxT", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T17:36:47.904Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-14T17:36:47.906Z"), updatedAt: new Date("2026-02-14T17:37:46.797Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 36, razorpaySubscriptionId: "sub_SG6vyNiLyuhCUc", razorpayPlanId: "plan_SFzGPoz26mfv0h", status: "CREATED",   startAt: new Date("2026-02-14T17:38:19.409Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-14T17:38:19.410Z"), updatedAt: new Date("2026-02-14T17:38:19.410Z"), recruiterId: 5, packageId: 2, nextPayment: null },
      { id: 37, razorpaySubscriptionId: "sub_SG7Itr1t3oDEyi", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-14T18:00:02.361Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-14T18:00:02.364Z"), updatedAt: new Date("2026-02-14T18:00:23.592Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-13T18:30:00.000Z") },
      { id: 38, razorpaySubscriptionId: "sub_SG7JT6KRAiCC2I", razorpayPlanId: "plan_SFzGPoz26mfv0h", status: "ACTIVE",    startAt: new Date("2026-02-14T18:00:34.045Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-14T18:00:34.047Z"), updatedAt: new Date("2026-02-14T18:06:18.895Z"), recruiterId: 5, packageId: 2, nextPayment: new Date("2026-04-01T18:30:00.000Z") },
      { id: 39, razorpaySubscriptionId: "sub_SGVmFvirtbOrit", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-15T17:56:16.975Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-15T17:56:16.976Z"), updatedAt: new Date("2026-02-15T17:56:16.976Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 40, razorpaySubscriptionId: "sub_SGVmTh3yUQTzf8", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-15T17:56:29.330Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-15T17:56:29.331Z"), updatedAt: new Date("2026-02-15T17:56:29.331Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 41, razorpaySubscriptionId: "sub_SGVnRU9djZKD91", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CANCELLED", startAt: new Date("2026-02-15T17:57:24.256Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-15T17:57:24.257Z"), updatedAt: new Date("2026-02-16T10:34:22.774Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 42, razorpaySubscriptionId: "sub_SGmsFLo5e3s0rN", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-16T10:39:44.764Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-16T10:39:44.765Z"), updatedAt: new Date("2026-02-16T10:39:44.765Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 43, razorpaySubscriptionId: "sub_SGmseLn2cujrLh", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "PAUSED",    startAt: new Date("2026-02-16T10:40:07.454Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-16T10:40:07.456Z"), updatedAt: new Date("2026-02-16T18:09:07.867Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 44, razorpaySubscriptionId: "sub_SGuOiJ4NbbWfkl", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-16T18:01:19.721Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-16T18:01:19.723Z"), updatedAt: new Date("2026-02-16T18:06:07.356Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-15T18:30:00.000Z") },
      { id: 45, razorpaySubscriptionId: "sub_SGuQ3wTciNS8s0", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CANCELLED", startAt: new Date("2026-02-16T18:02:36.270Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-16T18:02:36.271Z"), updatedAt: new Date("2026-02-17T09:50:11.629Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 46, razorpaySubscriptionId: "sub_SHAhFmtHC3cKuj", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-17T09:57:59.802Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-17T09:57:59.804Z"), updatedAt: new Date("2026-02-17T09:58:45.025Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-16T18:30:00.000Z") },
      { id: 47, razorpaySubscriptionId: "sub_SHAoNo077lsrdv", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-17T10:04:44.505Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-17T10:04:44.507Z"), updatedAt: new Date("2026-02-17T10:04:44.507Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 48, razorpaySubscriptionId: "sub_SHAqGhe1Omr0A6", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-17T10:06:31.834Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-17T10:06:31.835Z"), updatedAt: new Date("2026-02-17T10:06:31.835Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 49, razorpaySubscriptionId: "sub_SHAvugXi4Y38m4", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-17T10:11:52.176Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-17T10:11:52.178Z"), updatedAt: new Date("2026-02-17T10:12:13.947Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-16T18:30:00.000Z") },
      { id: 50, razorpaySubscriptionId: "sub_SHAz4P9R8fBuDm", razorpayPlanId: "plan_SFzGPoz26mfv0h", status: "CANCELLED", startAt: new Date("2026-02-17T10:14:51.022Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-17T10:14:51.023Z"), updatedAt: new Date("2026-02-17T10:22:29.234Z"), recruiterId: 5, packageId: 2, nextPayment: null },
      { id: 51, razorpaySubscriptionId: "sub_SHBDCljdPaXh5d", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-17T10:28:14.532Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-17T10:28:14.534Z"), updatedAt: new Date("2026-02-17T10:28:45.558Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-16T18:30:00.000Z") },
      { id: 52, razorpaySubscriptionId: "sub_SHBE35UlhwbvEr", razorpayPlanId: "plan_SFzGPoz26mfv0h", status: "CANCELLED", startAt: new Date("2026-02-17T10:29:01.703Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-17T10:29:01.704Z"), updatedAt: new Date("2026-02-17T10:29:41.404Z"), recruiterId: 5, packageId: 2, nextPayment: null },
      { id: 53, razorpaySubscriptionId: "sub_SHBIdKSFhqS2jg", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-17T10:33:22.944Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-17T10:33:22.945Z"), updatedAt: new Date("2026-02-17T10:33:22.945Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 54, razorpaySubscriptionId: "sub_SHBIl15xzlqdMX", razorpayPlanId: "plan_SFzGPoz26mfv0h", status: "CANCELLED", startAt: new Date("2026-02-17T10:33:29.752Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-17T10:33:29.753Z"), updatedAt: new Date("2026-02-17T10:34:36.693Z"), recruiterId: 5, packageId: 2, nextPayment: null },
      { id: 55, razorpaySubscriptionId: "sub_SHBecJzXrG6BiW", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-17T10:54:11.281Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-02-17T10:54:11.283Z"), updatedAt: new Date("2026-02-17T10:54:32.591Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-16T18:30:00.000Z") },
      { id: 56, razorpaySubscriptionId: "sub_SHGmU2uP9ZXMDd", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-17T15:55:06.405Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-17T15:55:06.406Z"), updatedAt: new Date("2026-02-17T15:55:06.406Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 57, razorpaySubscriptionId: "sub_SHGuTYUnLUZsjG", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-17T16:02:40.055Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-17T16:02:40.057Z"), updatedAt: new Date("2026-02-17T16:02:40.057Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 58, razorpaySubscriptionId: "sub_SHGvuJyyDZeOzd", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CREATED",   startAt: new Date("2026-02-17T16:04:01.423Z"), endAt: null, totalCount: 12, paidCount: 0, currency: "INR", createdAt: new Date("2026-02-17T16:04:01.424Z"), updatedAt: new Date("2026-02-17T16:04:01.424Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 59, razorpaySubscriptionId: "sub_SHH2xsDVFeiM5A", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "ACTIVE",    startAt: new Date("2026-02-17T16:10:42.095Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-02-17T16:10:42.096Z"), updatedAt: new Date("2026-02-17T16:21:31.703Z"), recruiterId: 5, packageId: 1, nextPayment: new Date("2026-03-16T18:30:00.000Z") },
      { id: 60, razorpaySubscriptionId: "sub_SNY0PmYbID93qn", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "CANCELLED", startAt: new Date("2026-03-05T12:40:13.630Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-03-05T12:40:13.632Z"), updatedAt: new Date("2026-03-05T12:56:01.227Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 61, razorpaySubscriptionId: "sub_SNYBUlHdi6210o", razorpayPlanId: "plan_SFzFpMUsPBCG1c", status: "PAUSED",    startAt: new Date("2026-03-05T12:50:42.641Z"), endAt: null, totalCount: 12, paidCount: 2, currency: "INR", createdAt: new Date("2026-03-05T12:50:42.642Z"), updatedAt: new Date("2026-03-05T12:51:40.338Z"), recruiterId: 5, packageId: 1, nextPayment: null },
      { id: 62, razorpaySubscriptionId: "sub_SNYHGx1QRVgfwG", razorpayPlanId: "plan_SFzGPoz26mfv0h", status: "CANCELLED", startAt: new Date("2026-03-05T12:56:10.063Z"), endAt: null, totalCount: 12, paidCount: 1, currency: "INR", createdAt: new Date("2026-03-05T12:56:10.064Z"), updatedAt: new Date("2026-03-05T12:56:58.258Z"), recruiterId: 5, packageId: 2, nextPayment: null },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Subscriptions seeded");

  // ─────────────────────────────────────────────
  // PaymentHistory
  // ─────────────────────────────────────────────
  await prisma.paymentHistory.createMany({
    data: [
      { id: 1,  razorpayPaymentId: "pay_SG5iIKEAIAwXxB", razorpaySubscriptionId: "sub_SG5hspcH5O5CkJ", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T16:26:30.000Z"), updatedAt: new Date("2026-02-14T16:26:48.905Z"), userId: 5 },
      { id: 2,  razorpayPaymentId: "pay_SG63f6ISFRZfZ0", razorpaySubscriptionId: "sub_SG63LZ8tLqrHQf", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T16:46:43.000Z"), updatedAt: new Date("2026-02-14T16:47:02.826Z"), userId: 5 },
      { id: 9,  razorpayPaymentId: "pay_SG6C4eEO0Vll64", razorpaySubscriptionId: "sub_SG6ArjqkHSh0cr", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T16:54:41.000Z"), updatedAt: new Date("2026-02-14T16:55:03.822Z"), userId: 5 },
      { id: 14, razorpayPaymentId: "pay_SG6E2RzGzRwsig", razorpaySubscriptionId: "sub_SG6Do9bUtAtz7H", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T16:56:32.000Z"), updatedAt: new Date("2026-02-14T16:56:54.097Z"), userId: 5 },
      { id: 23, razorpayPaymentId: "pay_SG6VQKh637nb2H", razorpaySubscriptionId: "sub_SG6UN4R8QIqTk6", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T17:13:00.000Z"), updatedAt: new Date("2026-02-14T17:13:20.277Z"), userId: 5 },
      { id: 27, razorpayPaymentId: "pay_SG6YeQhcVIBl8C", razorpaySubscriptionId: "sub_SG6YGeWawxjS9A", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T17:16:03.000Z"), updatedAt: new Date("2026-02-14T17:16:21.284Z"), userId: 5 },
      { id: 32, razorpayPaymentId: "pay_SG6g1bCr1z0pmm", razorpaySubscriptionId: "sub_SG6fmF11vbQAYq", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T17:23:02.000Z"), updatedAt: new Date("2026-02-14T17:23:31.199Z"), userId: 5 },
      { id: 34, razorpayPaymentId: "pay_SG6kfsBm2G8PKo", razorpaySubscriptionId: "sub_SG6iABhtMdq6oh", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "card", failureReason: null, createdAt: new Date("2026-02-14T17:27:26.000Z"), updatedAt: new Date("2026-02-14T17:27:57.632Z"), userId: 5 },
      { id: 35, razorpayPaymentId: "pay_SG6nWmbOqnskIC", razorpaySubscriptionId: "sub_SG63LZ8tLqrHQf", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T17:30:08.000Z"), updatedAt: new Date("2026-02-14T17:33:05.223Z"), userId: 5 },
      { id: 37, razorpayPaymentId: "pay_SG6vEzU3m3TUG6", razorpaySubscriptionId: "sub_SG6uLuWa3cXJxT", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T17:37:26.000Z"), updatedAt: new Date("2026-02-14T17:37:46.733Z"), userId: 5 },
      { id: 41, razorpayPaymentId: "pay_SG7JAC9FJuGcfv", razorpaySubscriptionId: "sub_SG7Itr1t3oDEyi", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T18:00:05.000Z"), updatedAt: new Date("2026-02-14T18:00:23.015Z"), userId: 5 },
      { id: 42, razorpayPaymentId: "pay_SG7MkS0Hf7JJa7", razorpaySubscriptionId: "sub_SG7JT6KRAiCC2I", amount: 699, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-14T18:03:29.000Z"), updatedAt: new Date("2026-02-14T18:06:18.899Z"), userId: 5 },
      { id: 51, razorpayPaymentId: "pay_SGVno1JIWssnOQ", razorpaySubscriptionId: "sub_SGVnRU9djZKD91", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-15T17:57:44.000Z"), updatedAt: new Date("2026-02-15T17:57:54.182Z"), userId: 5 },
      { id: 52, razorpayPaymentId: "pay_SGmswzZXye37kb", razorpaySubscriptionId: "sub_SGmseLn2cujrLh", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-16T10:40:24.000Z"), updatedAt: new Date("2026-02-16T10:40:34.517Z"), userId: 5 },
      { id: 53, razorpayPaymentId: "pay_SGuP0ZHRTksUxa", razorpaySubscriptionId: "sub_SGuOiJ4NbbWfkl", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-16T18:01:36.000Z"), updatedAt: new Date("2026-02-16T18:06:07.052Z"), userId: 5 },
      { id: 54, razorpayPaymentId: "pay_SGuQJALc3GE9e6", razorpaySubscriptionId: "sub_SGuQ3wTciNS8s0", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-16T18:02:50.000Z"), updatedAt: new Date("2026-02-16T18:06:15.564Z"), userId: 5 },
      { id: 55, razorpayPaymentId: "pay_SHAhgnVXSmHmxp", razorpaySubscriptionId: "sub_SHAhFmtHC3cKuj", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T09:58:23.000Z"), updatedAt: new Date("2026-02-17T09:58:45.035Z"), userId: 5 },
      { id: 56, razorpayPaymentId: "pay_SHAwANJ4oUdr4e", razorpaySubscriptionId: "sub_SHAvugXi4Y38m4", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T10:12:06.000Z"), updatedAt: new Date("2026-02-17T10:12:13.953Z"), userId: 5 },
      { id: 57, razorpayPaymentId: "pay_SHBDTAP5W99Gzt", razorpaySubscriptionId: "sub_SHBDCljdPaXh5d", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T10:28:28.000Z"), updatedAt: new Date("2026-02-17T10:28:44.928Z"), userId: 5 },
      { id: 58, razorpayPaymentId: "pay_SHBJ00SfJAk5zi", razorpaySubscriptionId: "sub_SHBIl15xzlqdMX", amount: 699, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T10:33:43.000Z"), updatedAt: new Date("2026-02-17T10:33:53.910Z"), userId: 5 },
      { id: 59, razorpayPaymentId: "pay_SHBeqyqbdqqb31", razorpaySubscriptionId: "sub_SHBecJzXrG6BiW", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T10:54:24.000Z"), updatedAt: new Date("2026-02-17T10:54:32.592Z"), userId: 5 },
      { id: 60, razorpayPaymentId: "pay_SHH85W7RCpDhTn", razorpaySubscriptionId: null,                  amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:15:32.000Z"), updatedAt: new Date("2026-02-17T16:15:33.749Z"), userId: 5 },
      { id: 61, razorpayPaymentId: "pay_SHH5rvhGt317jp", razorpaySubscriptionId: null,                  amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:13:26.000Z"), updatedAt: new Date("2026-02-17T16:15:50.551Z"), userId: 5 },
      { id: 62, razorpayPaymentId: "pay_SHGw4HbQoabo4T", razorpaySubscriptionId: null,                  amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:04:10.000Z"), updatedAt: new Date("2026-02-17T16:15:50.758Z"), userId: 5 },
      { id: 63, razorpayPaymentId: "pay_SHH3KXQuuY878c", razorpaySubscriptionId: "sub_SHH2xsDVFeiM5A", amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:11:02.000Z"), updatedAt: new Date("2026-02-17T16:18:17.706Z"), userId: 5 },
      { id: 64, razorpayPaymentId: "pay_SHHCF8tXl0ue6U", razorpaySubscriptionId: "sub_SHH2xsDVFeiM5A", amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:19:28.000Z"), updatedAt: new Date("2026-02-17T16:19:42.476Z"), userId: 5 },
      { id: 65, razorpayPaymentId: "pay_SHGmyOwc8bFMz4", razorpaySubscriptionId: "sub_SHGmU2uP9ZXMDd", amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T15:55:33.000Z"), updatedAt: new Date("2026-02-17T16:19:53.510Z"), userId: 5 },
      { id: 66, razorpayPaymentId: "pay_SHHE3PhSwevZHV", razorpaySubscriptionId: "sub_SHH2xsDVFeiM5A", amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:21:11.000Z"), updatedAt: new Date("2026-02-17T16:21:12.822Z"), userId: 5 },
      { id: 67, razorpayPaymentId: "pay_SHHEFZekwpRvHL", razorpaySubscriptionId: "sub_SHH2xsDVFeiM5A", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:21:22.000Z"), updatedAt: new Date("2026-02-17T16:21:31.707Z"), userId: 5 },
      { id: 68, razorpayPaymentId: "pay_SHGqwp34prgmlM", razorpaySubscriptionId: "sub_SHGmU2uP9ZXMDd", amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T15:59:19.000Z"), updatedAt: new Date("2026-02-17T16:22:55.759Z"), userId: 5 },
      { id: 69, razorpayPaymentId: "pay_SHGucmSbjEbiAk", razorpaySubscriptionId: "sub_SHGuTYUnLUZsjG", amount: 399, currency: "INR", status: "FAILED",     paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-02-17T16:02:48.000Z"), updatedAt: new Date("2026-02-17T16:25:57.046Z"), userId: 5 },
      { id: 70, razorpayPaymentId: "pay_SNYBqJ2aN0oWpf", razorpaySubscriptionId: "sub_SNYBUlHdi6210o", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-03-05T12:50:54.000Z"), updatedAt: new Date("2026-03-05T12:51:09.484Z"), userId: 5 },
      { id: 71, razorpayPaymentId: "pay_SNY0n07yrBSsoH", razorpaySubscriptionId: "sub_SNY0PmYbID93qn", amount: 399, currency: "INR", status: "SUCCESSFUL", paymentMethod: "upi",  failureReason: null, createdAt: new Date("2026-03-05T12:40:26.000Z"), updatedAt: new Date("2026-03-05T12:51:29.669Z"), userId: 5 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Payment History seeded");

  // ─────────────────────────────────────────────
  // Chat
  // ─────────────────────────────────────────────
  await prisma.chat.createMany({
    data: [
      { id: 14, candidateProfileId: 22, companyId: 26, chatRoomId: "chat_26_22", createdAt: new Date("2026-03-04T17:52:36.706Z"), candidateUnreadCount: 0, companyUnreadCount: 1, lastMessage: "That sounds great. Please share the job description, and let me know a suitable time for the technical discussion.", lastMessageAt: new Date("2026-03-04T18:31:56.559Z"), updatedAt: new Date("2026-03-04T18:31:56.594Z") },
      { id: 15, candidateProfileId: 39, companyId: 26, chatRoomId: "chat_26_39", createdAt: new Date("2026-03-04T18:33:25.355Z"), candidateUnreadCount: 0, companyUnreadCount: 2, lastMessage: "I've worked with MongoDB extensively and also used Redis for caching in one of my projects.", lastMessageAt: new Date("2026-03-04T18:36:58.134Z"), updatedAt: new Date("2026-03-04T18:36:58.170Z") },
      { id: 16, candidateProfileId: 24, companyId: 26, chatRoomId: "chat_26_24", createdAt: new Date("2026-03-04T18:42:04.379Z"), candidateUnreadCount: 0, companyUnreadCount: 0, lastMessage: "I enjoy collaborating with designers and translating design systems into reusable components.\n", lastMessageAt: new Date("2026-03-04T18:51:50.417Z"), updatedAt: new Date("2026-03-05T16:25:12.353Z") },
      { id: 17, candidateProfileId: 20, companyId: 29, chatRoomId: "chat_29_20", createdAt: new Date("2026-03-05T09:27:15.555Z"), candidateUnreadCount: 1, companyUnreadCount: 0, lastMessage: "Great! I'll arrange a quick technical call with our engineering team later this week.", lastMessageAt: new Date("2026-03-05T09:49:20.309Z"), updatedAt: new Date("2026-03-05T09:49:20.371Z") },
      { id: 18, candidateProfileId: 20, companyId: 36, chatRoomId: "chat_36_20", createdAt: new Date("2026-03-05T10:02:54.841Z"), candidateUnreadCount: 1, companyUnreadCount: 0, lastMessage: "Perfect. I'll share the job description and schedule a technical discussion if that works for you.", lastMessageAt: new Date("2026-03-05T10:07:12.657Z"), updatedAt: new Date("2026-03-05T10:07:12.686Z") },
      { id: 19, candidateProfileId: 20, companyId: 34, chatRoomId: "chat_34_20", createdAt: new Date("2026-03-05T10:22:46.201Z"), candidateUnreadCount: 0, companyUnreadCount: 1, lastMessage: "hii", lastMessageAt: new Date("2026-03-05T12:32:42.177Z"), updatedAt: new Date("2026-03-05T16:22:03.744Z") },
      { id: 20, candidateProfileId: 20, companyId: 26, chatRoomId: "chat_26_20", createdAt: new Date("2026-03-05T10:31:17.021Z"), candidateUnreadCount: 0, companyUnreadCount: 0, lastMessage: "r5", lastMessageAt: new Date("2026-03-05T16:27:52.470Z"), updatedAt: new Date("2026-03-05T16:28:39.966Z") },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Chats seeded");

  // ─────────────────────────────────────────────
  // Message
  // ─────────────────────────────────────────────
  await prisma.message.createMany({
    data: [
      { id: 166, chatId: 14, senderId: 5,  receiverId: 13, content: "Hi Raj, I came across your profile and noticed your experience with React and Node.js. We have an opening for a Full Stack Developer at our company. Would you be interested in discussing this opportunity?", isRead: true,  createdAt: new Date("2026-03-04T18:04:38.258Z") },
      { id: 167, chatId: 14, senderId: 13, receiverId: 5,  content: "Hello! Thank you for reaching out. Yes, I'd definitely be interested in learning more about the role.", isRead: true,  createdAt: new Date("2026-03-04T18:06:45.928Z") },
      { id: 168, chatId: 14, senderId: 5,  receiverId: 13, content: "Great! The position involves building scalable web applications using React, Node.js, and PostgreSQL. Do you have experience working with REST APIs and backend services?", isRead: true,  createdAt: new Date("2026-03-04T18:07:19.376Z") },
      { id: 169, chatId: 14, senderId: 13, receiverId: 5,  content: "Yes, I have worked on several projects where I developed REST APIs using Express.js and integrated them with React applications.", isRead: true,  createdAt: new Date("2026-03-04T18:08:45.730Z") },
      { id: 170, chatId: 14, senderId: 5,  receiverId: 13, content: "That's great to hear. Could you also share if you have any experience with cloud platforms like AWS or Docker?", isRead: true,  createdAt: new Date("2026-03-04T18:09:36.898Z") },
      { id: 171, chatId: 14, senderId: 13, receiverId: 5,  content: "I have basic experience with Docker and have deployed a few applications on AWS using EC2 and S3.", isRead: true,  createdAt: new Date("2026-03-04T18:29:41.348Z") },
      { id: 172, chatId: 14, senderId: 5,  receiverId: 13, content: "Perfect. I'll share the job description and schedule a technical discussion if that works for you.", isRead: true,  createdAt: new Date("2026-03-04T18:30:31.982Z") },
      { id: 173, chatId: 14, senderId: 13, receiverId: 5,  content: "That sounds great. Please share the job description, and let me know a suitable time for the technical discussion.", isRead: false, createdAt: new Date("2026-03-04T18:31:56.558Z") },
      { id: 174, chatId: 15, senderId: 5,  receiverId: 24, content: "Hi Mihir, I found your profile while searching for backend developers with Node.js and database experience. Are you currently open to new opportunities?", isRead: true,  createdAt: new Date("2026-03-04T18:33:51.151Z") },
      { id: 175, chatId: 15, senderId: 24, receiverId: 5,  content: "Hi! Yes, I am currently exploring new opportunities, especially backend-focused roles.\n", isRead: true,  createdAt: new Date("2026-03-04T18:35:25.557Z") },
      { id: 176, chatId: 15, senderId: 5,  receiverId: 24, content: "Excellent. This role mainly focuses on designing scalable APIs and working with MongoDB and Redis for high-performance systems.\n", isRead: true,  createdAt: new Date("2026-03-04T18:36:16.894Z") },
      { id: 177, chatId: 15, senderId: 24, receiverId: 5,  content: "That sounds interesting.", isRead: false, createdAt: new Date("2026-03-04T18:36:47.780Z") },
      { id: 178, chatId: 15, senderId: 24, receiverId: 5,  content: "I've worked with MongoDB extensively and also used Redis for caching in one of my projects.", isRead: false, createdAt: new Date("2026-03-04T18:36:58.133Z") },
      { id: 179, chatId: 16, senderId: 5,  receiverId: 15, content: "Hello Harsh, I saw your profile and noticed your strong experience with React and modern frontend technologies. We have a frontend developer opening. Would you like to know more?", isRead: true,  createdAt: new Date("2026-03-04T18:42:37.997Z") },
      { id: 180, chatId: 16, senderId: 15, receiverId: 5,  content: "Hi! Yes, I'd be happy to hear more about the role.", isRead: true,  createdAt: new Date("2026-03-04T18:48:31.385Z") },
      { id: 181, chatId: 16, senderId: 5,  receiverId: 15, content: "The position focuses on building responsive web interfaces using React, TypeScript, and Next.js. Do you have experience with these technologies?", isRead: true,  createdAt: new Date("2026-03-04T18:48:53.768Z") },
      { id: 182, chatId: 16, senderId: 15, receiverId: 5,  content: "Yes", isRead: true,  createdAt: new Date("2026-03-04T18:49:26.635Z") },
      { id: 183, chatId: 16, senderId: 15, receiverId: 5,  content: "I have been working with React for about 3 years and recently started using Next.js for server-side rendering.\n", isRead: true,  createdAt: new Date("2026-03-04T18:50:03.652Z") },
      { id: 184, chatId: 16, senderId: 5,  receiverId: 15, content: "That's great. The role also involves working closely with UI/UX designers to improve user experience.", isRead: true,  createdAt: new Date("2026-03-04T18:51:06.285Z") },
      { id: 185, chatId: 16, senderId: 15, receiverId: 5,  content: "I enjoy collaborating with designers and translating design systems into reusable components.\n", isRead: true,  createdAt: new Date("2026-03-04T18:51:50.416Z") },
      { id: 186, chatId: 17, senderId: 10, receiverId: 1,  content: "Hi Tirth, I found your profile while searching for backend developers with Node.js and database experience. Are you currently open to new opportunities?", isRead: true,  createdAt: new Date("2026-03-05T09:27:20.039Z") },
      { id: 187, chatId: 17, senderId: 1,  receiverId: 10, content: " Hi! Yes, I am currently exploring new opportunities, especially backend-focused roles.", isRead: true,  createdAt: new Date("2026-03-05T09:46:43.548Z") },
      { id: 188, chatId: 17, senderId: 10, receiverId: 1,  content: "Excellent. This role mainly focuses on designing scalable APIs and working with MongoDB and Redis for high-performance systems.", isRead: true,  createdAt: new Date("2026-03-05T09:47:22.864Z") },
      { id: 189, chatId: 17, senderId: 1,  receiverId: 10, content: "That sounds interesting. I've worked with MongoDB extensively and also used Redis for caching in one of my projects.", isRead: true,  createdAt: new Date("2026-03-05T09:48:03.291Z") },
      { id: 190, chatId: 17, senderId: 10, receiverId: 1,  content: "That's good to know. The team also follows microservices architecture. Have you worked with microservices before?", isRead: true,  createdAt: new Date("2026-03-05T09:48:25.001Z") },
      { id: 191, chatId: 17, senderId: 1,  receiverId: 10, content: "Yes, I have worked on a microservices-based project using Node.js and Docker.", isRead: true,  createdAt: new Date("2026-03-05T09:48:40.490Z") },
      { id: 192, chatId: 17, senderId: 10, receiverId: 1,  content: "Great! I'll arrange a quick technical call with our engineering team later this week.", isRead: false, createdAt: new Date("2026-03-05T09:49:20.309Z") },
      { id: 193, chatId: 18, senderId: 11, receiverId: 1,  content: " Hi Tirth, I came across your profile and noticed your experience with React and Node.js. We have an opening for a Full Stack Developer at our company. Would you be interested in discussing this opportunity?", isRead: true,  createdAt: new Date("2026-03-05T10:03:39.927Z") },
      { id: 194, chatId: 18, senderId: 1,  receiverId: 11, content: "Hello! Thank you for reaching out. Yes, I'd definitely be interested in learning more about the role.", isRead: true,  createdAt: new Date("2026-03-05T10:04:57.372Z") },
      { id: 195, chatId: 18, senderId: 11, receiverId: 1,  content: "Great! The position involves building scalable web applications using React, Node.js, and PostgreSQL. Do you have experience working with REST APIs and backend services?", isRead: true,  createdAt: new Date("2026-03-05T10:05:12.600Z") },
      { id: 196, chatId: 18, senderId: 1,  receiverId: 11, content: "Yes, I have worked on several projects where I developed REST APIs using Express.js and integrated them with React applications.", isRead: true,  createdAt: new Date("2026-03-05T10:05:25.265Z") },
      { id: 197, chatId: 18, senderId: 11, receiverId: 1,  content: "That's great to hear. Could you also share if you have any experience with cloud platforms like AWS or Docker?", isRead: true,  createdAt: new Date("2026-03-05T10:06:13.098Z") },
      { id: 198, chatId: 18, senderId: 1,  receiverId: 11, content: "I have basic experience with Docker and have deployed a few applications on AWS using EC2 and S3.", isRead: true,  createdAt: new Date("2026-03-05T10:06:49.794Z") },
      { id: 199, chatId: 18, senderId: 11, receiverId: 1,  content: "Perfect. I'll share the job description and schedule a technical discussion if that works for you.", isRead: false, createdAt: new Date("2026-03-05T10:07:12.657Z") },
      { id: 200, chatId: 19, senderId: 28, receiverId: 1,  content: "Hi Tirth, I noticed your experience with Docker and CI/CD pipelines. We're currently hiring a DevOps Engineer and your profile looks like a good match.", isRead: true,  createdAt: new Date("2026-03-05T10:23:33.926Z") },
      { id: 201, chatId: 20, senderId: 5,  receiverId: 1,  content: "Hi Tirth, I found your profile while searching for backend developers with Node.js and database experience. Are you currently open to new opportunities?", isRead: true,  createdAt: new Date("2026-03-05T10:31:59.961Z") },
      { id: 202, chatId: 20, senderId: 1,  receiverId: 5,  content: "Hi! Yes, I am currently exploring new opportunities, especially backend-focused roles.", isRead: true,  createdAt: new Date("2026-03-05T10:33:01.576Z") },
      { id: 203, chatId: 20, senderId: 5,  receiverId: 1,  content: "Excellent. This role mainly focuses on designing scalable APIs and working with MongoDB and Redis for high-performance systems.", isRead: true,  createdAt: new Date("2026-03-05T10:33:14.615Z") },
      { id: 204, chatId: 20, senderId: 1,  receiverId: 5,  content: "That sounds interesting. I've worked with MongoDB extensively and also used Redis for caching in one of my projects.", isRead: true,  createdAt: new Date("2026-03-05T10:33:33.957Z") },
      { id: 205, chatId: 20, senderId: 5,  receiverId: 1,  content: "That's good to know. The team also follows microservices architecture. Have you worked with microservices before?", isRead: true,  createdAt: new Date("2026-03-05T10:33:51.336Z") },
      { id: 206, chatId: 20, senderId: 1,  receiverId: 5,  content: "Yes, I have worked on a microservices-based project using Node.js and Docker.", isRead: true,  createdAt: new Date("2026-03-05T10:34:44.235Z") },
      { id: 207, chatId: 19, senderId: 1,  receiverId: 28, content: "hii", isRead: false, createdAt: new Date("2026-03-05T12:32:42.176Z") },
      { id: 208, chatId: 20, senderId: 5,  receiverId: 1,  content: "test", isRead: true,  createdAt: new Date("2026-03-05T12:39:32.655Z") },
      { id: 209, chatId: 20, senderId: 1,  receiverId: 5,  content: "c1",   isRead: true,  createdAt: new Date("2026-03-05T16:26:49.429Z") },
      { id: 210, chatId: 20, senderId: 5,  receiverId: 1,  content: "r1",   isRead: true,  createdAt: new Date("2026-03-05T16:26:57.957Z") },
      { id: 211, chatId: 20, senderId: 5,  receiverId: 1,  content: "r2",   isRead: true,  createdAt: new Date("2026-03-05T16:27:10.561Z") },
      { id: 212, chatId: 20, senderId: 5,  receiverId: 1,  content: "r3",   isRead: true,  createdAt: new Date("2026-03-05T16:27:15.358Z") },
      { id: 213, chatId: 20, senderId: 1,  receiverId: 5,  content: "c2",   isRead: true,  createdAt: new Date("2026-03-05T16:27:26.722Z") },
      { id: 214, chatId: 20, senderId: 5,  receiverId: 1,  content: "r4",   isRead: true,  createdAt: new Date("2026-03-05T16:27:49.974Z") },
      { id: 215, chatId: 20, senderId: 5,  receiverId: 1,  content: "r5",   isRead: true,  createdAt: new Date("2026-03-05T16:27:52.468Z") },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Messages seeded");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });