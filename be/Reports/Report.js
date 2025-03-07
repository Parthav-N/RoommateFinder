import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        enum: ['Spam', 'Fake Profile', 'Inappropriate Content', 'Other'],
        required: true,
    },
    comments: {
        type: String,
        default: '',
    },
    reportedAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model('Report', reportSchema);

export default Report;