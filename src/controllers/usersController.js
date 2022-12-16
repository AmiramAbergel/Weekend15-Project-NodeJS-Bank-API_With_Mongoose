import {
    cashOrCreditExpense,
    fundsAvailability,
    sumCashCredit,
} from '../utils/bankManagerUtils.js';
import { User } from '../model/users.model.js';

// export const checkID = (req, res, next, val) => {
//     console.log(`User id is: ${val}`);

//     if (+req.params.id > usersDataJSON.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID',
//         });
//     }
//     next();
// };

// export const checkBody = (req, res, next) => {
//     if (!req.body.fist || !req.body.last || !req.body.isActive) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing fist name or last name or active status',
//         });
//     }
//     next();
// };

// export const checkIfExists = (id, bankACC) => {
//     const checkUser = usersDataJSON.find((userDB) => {
//         return userDB.id === id || userDB.bank_acc_num === bankACC;
//     });
//     return checkUser ? true : false;
// };

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: users.length,
            data: {
                users,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const getUserByID = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID);
        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const addNewUser = async (req, res) => {
    try {
        const { name, bankAccNum, isActive, credit, cash } = req.body;
        const newUser = await User.create({
            name: name,
            bankAccNum: bankAccNum,
            isActive: isActive,
            credit: credit,
            cash: cash,
        });
        res.status(201).json({
            status: 'success',
            message: `New user added: ${newUser}`,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

export const updateUserCash = async (req, res) => {
    const userID = req.params.id;
    const depositAmount = req.body.cash;
    // Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, [depositAmount]);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            {
                $inc: filteredBody,
            },
            {
                new: true,
                runValidators: true,
                context: 'query',
            }
        );
        res.status(200).json({
            status: 'success',
            message: 'user cash updated',
            data: {
                user: updatedUser,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const updateUserCredit = async (req, res) => {
    const userID = req.params.id;
    const creditAmount = req.body.credit;
    // Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, [creditAmount]);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userID,
            {
                $set: filteredBody,
            },
            {
                new: true,
                runValidators: true,
                context: 'query',
            }
        );
        res.status(200).json({
            status: 'success',
            message: 'user credit updated',
            data: {
                user: updatedUser,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const withdrawFromUser = async (req, res) => {
    const userID = req.params.id;
    const withdrawAmount = req.body.withdraw;
    try {
        const user = await User.findById(userID);
        const userCashCredit = sumCashCredit(user.credit, user.cash);
        if (!fundsAvailability(userCashCredit, withdrawAmount)) {
            return res.status(400).json({
                status: 'fail',
                message:
                    'Only positive numbers can be used for withdraw and not more than user total funding ',
            });
        }
        if (user.cash <= withdrawAmount) {
            const updatedUser = await User.findByIdAndUpdate(
                userID,
                {
                    $set: {
                        credit: user.credit - (withdrawAmount - user.cash),
                        cash: 0,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query',
                }
            );
            res.status(200).json({
                status: 'success',
                message: 'user credit and cash updated after withdraw',
                data: {
                    user: updatedUser,
                },
            });
        } else {
            const updatedUser = await User.findByIdAndUpdate(
                userID,
                {
                    $set: {
                        cash: user.cash - withdrawAmount,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                    context: 'query',
                }
            );
            res.status(200).json({
                status: 'success',
                message: 'user credit and cash updated after withdraw',
                data: {
                    user: updatedUser,
                },
            });
        }
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

export const transferMoney = async (req, res) => {
    const senderUserID = req.query.sender_id;
    const receiverUserID = req.query.receiver_id;
    const transferAmount = req.body.amount;

    const findSenderUserByID = await User.findById(senderUserID);
    const findReceiverUserByID = await User.findById(receiverUserID);
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
    if (findSenderUserByID.cash <= transferAmount) {
        const updatedUser = await User.findByIdAndUpdate(
            senderUserID,
            {
                $inc: {
                    credit:
                        findSenderUserByID.credit -
                        (transferAmount - findSenderUserByID.cash),
                    cash: 0,
                },
            },
            {
                new: true,
                runValidators: true,
                context: 'query',
            }
        );
        res.status(200).json({
            status: 'success',
            message: 'user credit updated',
            data: {
                user: updatedUser,
            },
        });
    } else {
        const updatedUser = await User.findByIdAndUpdate(
            senderUserID,
            {
                $inc: {
                    cash: findSenderUserByID.cash - transferAmount,
                },
            },
            {
                new: true,
                runValidators: true,
                context: 'query',
            }
        );
        res.status(200).json({
            status: 'success',
            message: 'user credit updated',
            data: {
                user: updatedUser,
            },
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
        receiverUserID,
        {
            $inc: {
                cash: transferAmount,
            },
        },
        {
            new: true,
            runValidators: true,
            context: 'query',
        }
    );
    res.status(200).json({
        status: 'success',
        message: 'user credit updated',
        data: {
            user: updatedUser,
        },
    });
    res.status(200).json({
        status: 'success',
        message: 'Transfer completed',
    });
};

export const deleteUser = async (req, res) => {
    const userID = req.params.id;
    try {
        await User.findByIdAndRemove(userID);
        res.status(200).json({
            status: 'success',
            message: '1 user deleted!',
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
