import express from 'express';
import { Application } from 'express';
import applyRoute from '~/features/apply/apply.route';
import candidateEducationRoute from '~/features/candidate-education/candidate-education.route';
import candidateExperienceRoute from '~/features/candidate-experience/candidate-experience.route';
import candidateLanguageRoute from '~/features/candidate-language/candidate-language.route';
import candidateProfileRoute from '~/features/candidate-profile/candidate-profile.route';
import candidateSkillRoute from '~/features/candidate-skill/candidate-skill.route';
import companyImageRoute from '~/features/company-image/company-image.route';
import companyIndustryRoute from '~/features/company-industry/company-industry.route';
import companyRoute from '~/features/company/company.route';
import jobBenefitRoute from '~/features/job-benefit/job-benefit.route';
import jobRoleRoute from '~/features/job-role/job-role.route';
import jobSkillRoute from '~/features/job-skill/job-skill.route';
import jobRoute from '~/features/job/job.route';
import packageRoute from '~/features/package/package.route';
// import razorpayRoute from '~/features/payment/razorpay.route';
import paymentroute from '~/features/payment/razorpay.route';
import authRoute from '~/features/auth/auth.route';
import userRouter from '~/features/user/user.route';
import testRoute from '~/features/testing module/test.route';
import chatRoute from '~/features/chat/chat.route';

function appRoutes(app: Application) {
  app.use('/api/v1/testing', testRoute);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/candidate-profiles', candidateProfileRoute);
  app.use('/api/v1/candidate-language', candidateLanguageRoute);
  app.use('/api/v1/candidate-education', candidateEducationRoute);
  app.use('/api/v1/candidate-skill', candidateSkillRoute);
  app.use('/api/v1/candidate-experience', candidateExperienceRoute);
  app.use('/api/v1/company', companyRoute);
  app.use('/api/v1/company-image', companyImageRoute);
  app.use('/api/v1/company-industry', companyIndustryRoute);
  app.use('/api/v1/job-role', jobRoleRoute);
  app.use('/api/v1/job', jobRoute);
  app.use('/api/v1/job-skill', jobSkillRoute);
  app.use('/api/v1/job-benefit', jobBenefitRoute);
  app.use('/api/v1/apply', applyRoute);
  app.use('/api/v1/package', packageRoute);
  // app.use('/api/v1/recruiter-package', RecruiterPackageRoute);
  app.use('/api/v1/razorpay', paymentroute.razorpayRoute);
  app.use('/api/v1/chat', chatRoute);
  


  // app.use('/api/v1/razorpay/webhook', express.raw({ type: 'application/json' }), paymentroute.razorpayWebhookRoute);
}

function razorpayWebhookRoute(app: Application) {
  app.use('/api/v1/razorpay/webhook', paymentroute.razorpayWebhookRoute)
}

export default {appRoutes, razorpayWebhookRoute};
