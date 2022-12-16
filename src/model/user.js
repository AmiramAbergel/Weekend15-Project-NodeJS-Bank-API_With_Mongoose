const userObj = (first, last, credit, cash, isActive) => {
    const user = {
        first: first,
        last: last,
        credit: credit,
        cash: cash,
        isActive: isActive,
    };
    return user;
};

export default userObj;
