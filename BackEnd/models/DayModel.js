import mongoose from 'mongoose';

const DaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    //date format YYYY-MM-DD
    date: {
        type: String,
        required: true,
        unique: true
    },
    breakfast: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal'
    }],
    lunch: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal'
    }],
    dinner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal'
    }]
    
}, { timestamps: true });

const Day = mongoose.model('Day', DaySchema);

export default Day;
