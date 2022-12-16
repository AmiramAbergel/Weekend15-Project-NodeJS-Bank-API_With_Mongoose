import { Router } from 'express';

import {
    addNewUser,
    deleteUser,
    getAllUsers,
    getUserByID,
    transferMoney,
    updateUserCash,
    updateUserCredit,
    withdrawFromUser,
} from '../controllers/usersController.js';
import { checkCashInBody } from '../middlewares/cashValidation.middleware.js';
import { checkWithdrawAmountInBody } from '../middlewares/withdrawAmountVaslidation.middleware.js';
export const usersRouter = Router();
usersRouter.route(`/transfer`).patch(transferMoney);
//usersRouter.param('id', checkID);
// all routes in here are starting with localhost:8000/api/v1/users
usersRouter.route(`/`).get(getAllUsers).post(addNewUser); //get all users and add new user
usersRouter
    .route(`/:id`)
    .get(getUserByID)
    .patch(updateUserCash)
    .delete(deleteUser); // read specific user | update user | delete user
usersRouter.route(`/credit/:id`).patch(updateUserCredit);
usersRouter.route(`/cash/:id`).patch(checkCashInBody, updateUserCash);
usersRouter
    .route(`/withdraw/:id`)
    .patch(checkWithdrawAmountInBody, withdrawFromUser);
