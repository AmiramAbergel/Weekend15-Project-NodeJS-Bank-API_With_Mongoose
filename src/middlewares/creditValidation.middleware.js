export const checkCreditInBody = (req, res, next) => {
    const { credit } = req.body;
    if (!credit) {
        return res.status(400).json({
            status: 'fail',
            message: 'credit data missing...',
        });
    } else if (typeof credit !== 'number' || credit < 1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Credit type must be positive number...',
        });
    }
    next();
};
