const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Account must be associated with a user'],
            index: true
        },

        status: {
            type: String,
            enum: {
                values: ['active', 'inactive', 'suspended'],
                message: 'Status must be active, inactive, or suspended'
            },
            default: 'active'
        },

        currency: {
            type: String,
            enum: ['INR', 'USD', 'EUR'],
            default: 'INR',
            required: true
        }
    },
    {
        timestamps: true
    }
);

accountSchema.index({ user: 1, currency: 1 });

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;