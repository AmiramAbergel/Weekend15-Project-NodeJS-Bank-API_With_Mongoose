import { Router } from 'express';
import { homePageRouter } from './homePage.routes.js';
import { usersRouter } from './users.routes.js';

const indexRoute = Router();

indexRoute.use('/', homePageRouter); // localhost:8000/api/v1/
indexRoute.use('/users', usersRouter); // localhost:8000/api/v1/users

export default indexRoute;
