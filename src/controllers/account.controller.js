
const Account = require('../models/account.model');

async function createAccount(req, res, next) {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                status: 'failed',
                message: 'Authentication required',
            });
        }

        const existingAccount = await Account.findOne({
            user: userId,
        });

        if (existingAccount) {
            return res.status(409).json({
                status: 'failed',
                message: 'Account already exists',
            });
        }

        const account = await Account.create({
            user: userId,
        });

        return res.status(201).json({
            status: 'success',
            message: 'Account created successfully',
            data: {
                account,
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                status: 'failed',
                message: 'Account already exists',
            });
        }

        return next(error);
    }
}

async function getAccount(req, res, next) {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                status: 'failed',
                message: 'Authentication required',
            });
        }

        const account = await Account.findOne({
            user: userId,
        }).lean();

        if (!account) {
            return res.status(404).json({
                status: 'failed',
                message: 'Account not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Account fetched successfully',
            data: {
                account,
            },
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createAccount,
    getAccount,
};
