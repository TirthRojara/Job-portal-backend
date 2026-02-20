import express from 'express';
import { testController } from './test.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';



const testRoute = express.Router();

testRoute.get('/test', asyncWrapper(testController.test));


export default testRoute;
