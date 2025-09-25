import { Application } from "express";
import candidateEducationRoute from "~/features/candidate-education/candidate-education.route";
import candidateExperienceRoute from "~/features/candidate-experience/candidate-experience.route";
import candidateLanguageRoute from "~/features/candidate-language/candidate-language.route";
import candidateProfileRoute from "~/features/candidate-profile/candidate-profile.route";
import candidateSkillRoute from "~/features/candidate-skill/candidate-skill.route";
import authRoute from "~/features/user/routes/auth.route";
import userRouter from "~/features/user/routes/user.route";


function appRoutes(app: Application) {
    app.use('/api/v1/users', userRouter )
    app.use('/api/v1/auth', authRoute)
    app.use('/api/v1/candidate-profiles', candidateProfileRoute)
    app.use('/api/v1/candidate-language', candidateLanguageRoute)
    app.use('/api/v1/candidate-education', candidateEducationRoute)
    app.use('/api/v1/candidate-skill', candidateSkillRoute)
    app.use('/api/v1/candidate-experience', candidateExperienceRoute)
}

export default appRoutes;