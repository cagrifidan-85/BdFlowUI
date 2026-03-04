const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    imagePublicId: {
        type: String,
        default: ''
    },
    measurementRange: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        amount: {
            type: Number,
            min: 0
        },
        currency: {
            type: String,
            default: 'TL',
            enum: ['TL', 'USD', 'EUR', 'GBP']
        }
    },
    sensor: {
        type: String,
        default: ''
    },
    connectionType: {
        type: String,
        default: ''
    },
    properties: {
        type: String,
        default: ''
    },
    electronics: {
        type: String,
        default: ''
    },
    catalogUrl: {
        type: String,
        default: ''
    },
    material: {
        type: String,
        default: ''
    },
    environment: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const filtersSchema = new mongoose.Schema({
    sensors: [{code: String,en:String,tr:String}],
    connectionTypes: [{code: String,en:String,tr:String}],
    properties: [{code: String,en:String,tr:String}],
    electronics: [{code: String,en:String,tr:String}],
    categories: [{code: String,en:String,tr:String}],
    materials: [{code: String,en:String,tr:String}],
    environments: [{code: String,en:String,tr:String}],
}, {
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret.id.toString();
            delete ret.id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret.id.toString();
            delete ret.id;
            delete ret.__v;
            return ret;
        }
    }
});


module.exports = {
    Product: mongoose.model('Product', productSchema),
    Filters: mongoose.model('Filters', filtersSchema)
};
