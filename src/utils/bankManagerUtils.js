export const fundsAvailability = (userCashCredit, amount) => {
    if (amount < 1 || userCashCredit < amount) {
        return false;
    } else {
        return true;
    }
};

export const sumCashCredit = (cash, credit) => {
    return cash + credit;
};

export const cashOrCreditExpense = (user, amount) => {
    if (user.cash <= amount) {
        user.credit = user.credit - (amount - user.cash);
        user.cash = 0;
    } else {
        user.cash = user.cash - amount;
    }
};
