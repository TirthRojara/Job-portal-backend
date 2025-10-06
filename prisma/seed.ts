import { Education, Language, PrismaClient, Skill } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  async function createLanguageData() {
    const data: Language[] = [{ name: 'english' }, { name: 'hindi' }, { name: 'gujarati' }];

    await prisma.language.createMany({
      data,
      skipDuplicates: true
    });
  }

  async function createEducationData() {
    const data = [
      {
        name: 'Harvard University',
        map: 'https://maps.app.goo.gl/S9XNcoozcmWp5znL7'
      },
      {
        name: 'Stanford University',
        map: 'https://maps.app.goo.gl/49sahvX93NuwFaXY8'
      },
      {
        name: 'California Institute of Technology',
        map: 'https://maps.app.goo.gl/qxn9bG5mQVr7894P9'
      }
    ];

    await prisma.education.createMany({
      data,
      skipDuplicates: true
    });
  }

  async function createSkillData() {
    const data = [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'Java' },
      { name: 'C++' },
      { name: 'C#' },
      { name: 'C' },
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'Python' },
      { name: 'ReactJs' },
      { name: 'NodeJs' },
      { name: 'ExpressJs' },
      { name: 'NextJs' }
    ];

    await prisma.skill.createMany({
      data,
      skipDuplicates: true
    });
  }

  async function createIndustryData() {
    const data = [
      { name: 'IT' },
      { name: 'Finance' },
      { name: 'Healthcare' },
      { name: 'Education' },
      { name: 'Retail' }
    ];

    await prisma.industry.createMany({
      data,
      skipDuplicates: true
    });
  }

  async function createJobRoleData() {
    const data = [{ name: 'internship' }, { name: 'fresher' }, { name: 'junior' }, { name: 'senior' }];

    await prisma.jobRole.createMany({
      data,
      skipDuplicates: true
    });
  }

  // createLanguageData();
  // createEducationData();
  // createSkillData();
  // createIndustryData();
  // createJobRoleData();
}

main()
  .then()
  .catch((err) => console.log(err));
