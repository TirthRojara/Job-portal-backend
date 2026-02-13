import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { applyController } from './apply.controller';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { applyStatusSchema } from './apply.schema';

const applyRoute = express.Router();

applyRoute.post('/:jobId', verifyUser, allowAccess('CANDIDATE'), asyncWrapper(applyController.create));

applyRoute.get(
    '/me/candidate',
    verifyUser,
    allowAccess('CANDIDATE'),
    asyncWrapper(applyController.readMyApplicationsForCandidate)
);

applyRoute.get(
    '/me/recruiter/:jobId/:companyId',
    verifyUser,
    allowAccess('RECRUITER'),
    asyncWrapper(applyController.readMyApplicationsForRECRUITER)
);

applyRoute.get(
    '/me/recruiter/application/:jobId/:candidateProfileId',
    verifyUser,
    allowAccess('RECRUITER'),
    asyncWrapper(applyController.readApplicationByIdForRecruiter)
);

applyRoute.patch(
    '/recruiter/status/:jobId/:companyId',
    verifyUser,
    allowAccess('RECRUITER'),
    validateSchema(applyStatusSchema),
    asyncWrapper(applyController.updateStatus)
);

export default applyRoute;
