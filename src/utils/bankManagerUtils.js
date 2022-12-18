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
