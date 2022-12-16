export const checkWithdrawAmountInBody = (req, res, next) => {
    const { withdraw } = req.body;
    if (!withdraw) {
        return res.status(400).json({
            status: 'fail',
            message: 'Withdraw amount data missing...',
        });
    } else if (typeof withdraw !== 'number' || withdraw < 1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Withdraw amount type must be positive number...',
        });
    }
    next();
};
