import { Router } from 'express';

export const homePageRouter = Router();

export const instruction = (req, res) => {
    return res.status(200).json({
        status: 'success',
        message: `{get all users: https://weekend14-project-nodejs-bank-api.onrender.com/users 
        get user: https://weekend14-project-nodejs-bank-api.onrender.com/users/10 }`,
    });
};

homePageRouter.route(`/`).get(instruction);
