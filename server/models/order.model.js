import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : "product"
    },
    productDetails : {
        name : String,
        image : Array,
    },
    quantity : {
        type : Number,
        default : 1
    },
    price : {
        type : Number,
        default : 0
    },
    subtotal : {
        type : Number,
        default : 0
    }
}, {
    _id : false
})

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    orderId : {
        type : String,
        required : [true, "Provide orderId"],
        unique : true
    },
    products : [orderItemSchema],
    paymentId : {
        type : String,
        default : ""
    },
    paymentStatus : {
        type : String,
        default : ""
    },
    deliveryAddress : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    totalAmount : {
        type : Number,
        default : 0
    },
    orderStatus : {
        type : String,
        enum : ['pending', 'processing', 'shipped', 'delivered'],
        default : 'pending'
    },
    invoice_receipt : {
        type : String,
        default : ""
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
},{
    timestamps : true
})

const OrderModel = mongoose.model('order',orderSchema)

export default OrderModel