import express from 'express';
import { testController } from './test.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';



const testRoute = express.Router();

testRoute.post('/test', asyncWrapper(testController.test));


export default testRoute;
