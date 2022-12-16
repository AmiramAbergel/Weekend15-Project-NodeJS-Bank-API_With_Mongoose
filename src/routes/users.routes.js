import { Router } from 'express';

import {
    addNewUser,
    checkID,
    deleteUser,
    getAllUsers,
    getUserByID,
    transferMoney,
    updateUserCash,
    updateUserCredit,
    withdrawFromUser,
} from '../controllers/usersController.js';
export const usersRouter = Router();
usersRouter.route(`/transfer`).patch(transferMoney);
usersRouter.param('id', checkID);
// all routes in here are starting with localhost:8000/api/v1/users
usersRouter.route(`/`).get(getAllUsers).post(addNewUser); //get all users and add new user
usersRouter
    .route(`/:id`)
    .get(getUserByID)
    .patch(updateUserCash)
    .delete(deleteUser); // read specific user | update user | delete user
usersRouter.route(`/credit/:id`).patch(updateUserCredit);
usersRouter.route(`/cash/:id`).patch(updateUserCash);
usersRouter.route(`/withdraw/:id`).patch(withdrawFromUser);
