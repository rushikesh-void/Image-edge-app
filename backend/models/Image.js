const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema(
    {
        x: { type: Number, require: true },
        y: { type: Number, require: true },
    },
    { _id: false }
)

const imageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        filename: {
            type: String,
            require: true,
        },
         orignamName: {
            type: String,
            require: true,
        },
         filePath: {
            type: String,
            require: true,
        },
         width: {
            type: Number,
        },
         height: {
            type: Number,
        },
        borders: [pointSchema],
        area: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('image', imageSchema)