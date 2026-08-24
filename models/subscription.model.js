import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name must be at most 50 characters long'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'],
        max: [10000, 'Price must be less than or equal to 10000'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['sports', 'news', 'finance', 'entertainment', 'productivity', 'education', 'health', 'other'],
        default: 'other',
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'Bank Transfer'],
        required: [true, 'Payment method is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date cannot be in the future'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true, // Create an index for faster queries
    } 

}, {timestamps: true});

// Call specific actions before a document is saved into mongodb database

subscriptionSchema.pre("save", async function () {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);

        this.renewalDate.setDate(
            this.renewalDate.getDate() + renewalPeriods[this.frequency]
        );
    }

    // Automatically expire subscription if renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

