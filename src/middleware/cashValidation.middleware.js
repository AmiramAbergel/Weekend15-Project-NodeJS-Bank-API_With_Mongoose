export const checkCashInBody = (req, res, next) => {
    const { cash } = req.body;
    if (!cash) {
        return res.status(400).json({
            status: 'fail',
            message: 'Cash data missing...',
        });
    } else if (typeof cash !== 'number' || cash < 1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Cash type must be positive number...',
        });
    }
    next();
};
