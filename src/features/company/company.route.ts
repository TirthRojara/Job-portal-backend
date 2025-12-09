import express from 'express';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { companyCreateSchema, companyIsApprovedSchema, companyUpdateSchema } from './company.schema';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { companyController } from './company.controller';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';

const companyRoute = express.Router();

companyRoute.post(
    '/me',
    verifyUser,
    allowAccess('RECRUITER'),
    validateSchema(companyCreateSchema),
    asyncWrapper(companyController.create)
);

companyRoute.get('/readAll', verifyUser, allowAccess('ADMIN'), asyncWrapper(companyController.readAll));

companyRoute.get(
    '/readAllIsApproved',
    verifyUser,
    allowAccess('ADMIN'),
    asyncWrapper(companyController.readAllIsApproved)
);

companyRoute.get('/me', verifyUser, allowAccess('RECRUITER'), asyncWrapper(companyController.readMyCompanies));

companyRoute.get('/:id', verifyUser, allowAccess('CANDIDATE', 'ADMIN'), asyncWrapper(companyController.readOne));

companyRoute.patch(
    '/me/:id',
    verifyUser,
    allowAccess('RECRUITER'),
    validateSchema(companyUpdateSchema),
    asyncWrapper(companyController.update)
);

companyRoute.patch(
    '/approved/:id',
    verifyUser,
    allowAccess('ADMIN'),
    validateSchema(companyIsApprovedSchema),
    asyncWrapper(companyController.approved)
);

companyRoute.delete('/me/:id', verifyUser, allowAccess('RECRUITER'), asyncWrapper(companyController.remove));

companyRoute.delete('/:id', verifyUser, allowAccess('ADMIN'), asyncWrapper(companyController.removeByAdmin));

companyRoute.get('/:companyId/view', verifyUser, allowAccess('RECRUITER'), asyncWrapper(companyController.getCompanyView));

export default companyRoute;
