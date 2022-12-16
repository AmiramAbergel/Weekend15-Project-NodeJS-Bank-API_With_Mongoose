import { usersDataJSON, writeData } from '../utils/readWriteData.js';
import { v4 as uuidv4 } from 'uuid';
import userObj from '../model/user.js';
import {
    cashOrCreditExpense,
    findUser,
    fundsAvailability,
    sumCashCredit,
} from '../utils/bankManagerUtils.js';

export const checkID = (req, res, next, val) => {
    console.log(`User id is: ${val}`);

    if (+req.params.id > usersDataJSON.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }
    next();
};

export const checkBody = (req, res, next) => {
    if (!req.body.fist || !req.body.last || !req.body.isActive) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing fist name or last name or active status',
        });
    }
    next();
};

export const checkIfExists = (id, bankACC) => {
    const checkUser = usersDataJSON.find((userDB) => {
        return userDB.id === id || userDB.bank_acc_num === bankACC;
    });
    return checkUser ? true : false;
};

export const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: usersDataJSON.length,
        data: {
            usersDataJSON,
        },
    });
};

export const getUserByID = (req, res) => {
    const userID = req.params.id;
    const userByID = findUser(userID);
    res.status(200).json({
        status: 'success',
        data: {
            userByID,
        },
    });
};

export const addNewUser = (req, res) => {
    const newUserData = req.body;
    const newUserID = (
        +usersDataJSON[usersDataJSON.length - 1].id + 1
    ).toString(); //In the local database, get the ID of the last user, increase it by 1, and make it into a string
    const newUserBankAcc = uuidv4();
    console.log(+usersDataJSON[usersDataJSON.length - 1].id + 1);
    if (checkIfExists(newUserID, newUserBankAcc)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Cannot add duplicate users',
        });
    } else {
        const updatedNewUser = Object.assign(
            { id: newUserID, bank_acc_num: newUserBankAcc, credit: 0, cash: 0 },
            newUserData
        );
        console.log(updatedNewUser);
        usersDataJSON.push(updatedNewUser);
        writeData(usersDataJSON);
    }

    res.status(200).json({
        status: 'success',
        message: 'New user added',
    });
};

export const updateUserCash = (req, res) => {
    const userID = req.params.id;
    const depositAmount = req.body.cash;
    if (!userID || !depositAmount) {
        return res.status(400).json({
            status: 'fail',
            message: 'id or cash data missing...',
        });
    }
    const userByID = findUser(userID);
    userByID.cash += depositAmount;
    writeData(usersDataJSON);
    res.status(200).json({
        status: 'success',
        message: 'user cash updated',
    });
};

export const updateUserCredit = (req, res) => {
    const userID = req.params.id;
    const creditAmount = req.body.credit;
    if (!userID || !creditAmount) {
        return res.status(400).json({
            status: 'fail',
            message: 'id or cash data missing...',
        });
    }
    if (creditAmount < 1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Only positive numbers can be used for credit',
        });
    }
    const userByID = findUser(userID);
    userByID.credit = creditAmount;
    writeData(usersDataJSON);
    res.status(200).json({
        status: 'success',
        message: 'user credit updated',
    });
};

export const withdrawFromUser = (req, res) => {
    const userID = req.params.id;
    const withdrawAmount = req.body.withdraw;
    if (!userID || !withdrawAmount) {
        return res.status(400).json({
            status: 'fail',
            message: 'id or cash data missing...',
        });
    }
    const userByID = findUser(userID);
    const userCashCredit = sumCashCredit(userByID.credit, userByID.cash);
    if (!fundsAvailability(userCashCredit, withdrawAmount)) {
        return res.status(400).json({
            status: 'fail',
            message:
                'Only positive numbers can be used for withdraw and not more than user total funding ',
        });
    }
    cashOrCreditExpense(userByID, withdrawAmount);
    writeData(usersDataJSON);
    res.status(200).json({
        status: 'success',
        message: 'user credit and cash updated after withdraw',
    });
};

export const transferMoney = (req, res) => {
    const senderUserID = req.query.sender_id;
    const receiverUserID = req.query.receiver_id;
    const transferAmount = req.body.amount;
    const findSenderUserByID = findUser(senderUserID);
    const findReceiverUserByID = findUser(receiverUserID);
    const senderUserCashCredit = sumCashCredit(
        findSenderUserByID.credit,
        findSenderUserByID.cash
    );
    if (!fundsAvailability(senderUserCashCredit, transferAmount)) {
        return res.status(400).json({
            status: 'fail',
            message:
                'Only positive numbers can be used for withdraw and not more than user total funding',
        });
    }
    cashOrCreditExpense(findSenderUserByID, transferAmount);
    findReceiverUserByID.cash += transferAmount;
    writeData(usersDataJSON);
    res.status(200).json({
        status: 'success',
        message: 'Transfer completed',
    });
};

/////
///
///
///
export const getUserCredit = (req, res) => {
    res.status(200).json({
        status: 'success',
    });
};
export const getUserCash = (req, res) => {
    res.status(200).json({
        status: 'success',
    });
};

export const deleteUser = (req, res) => {
    res.status(200).json({
        status: 'success',
    });
};
