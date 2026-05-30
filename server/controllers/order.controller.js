import Stripe from "../config/stripe.js";
import sendEmail from "../config/sendEmail.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import orderPlacedTemplate from "../utils/orderPlacedTemplate.js";
import paymentSuccessTemplate from "../utils/paymentSuccessTemplate.js";

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, addressId } = request.body 

        if (!addressId) {
            return response.status(400).json({
                message : "Please select a delivery address before placing order",
                error : true,
                success : false
            })
        }

        const orderId = `ORD-${new mongoose.Types.ObjectId()}`

        const products = list_items.map(el => {
            const quantity = Number(el.quantity || 1)
            const itemPrice = Number(pricewithDiscount(el.productId.price, el.productId.discount))
            const lineTotal = itemPrice * quantity

            return({
                productId : el.productId._id,
                productDetails : {
                    name : el.productId.name,
                    image : Array.isArray(el.productId.image) ? el.productId.image : (el.productId.image ? [el.productId.image] : [])
                },
                quantity : quantity,
                price : itemPrice,
                subtotal : lineTotal,
            })
        })

        const totalAmount = products.reduce((sum, item) => sum + Number(item.subtotal || 0), 0)

        const orderDoc = {
            userId : userId,
            orderId : orderId,
            products : products,
            paymentId : "",
            paymentStatus : "CASH ON DELIVERY",
            deliveryAddress : addressId,
            totalAmount : totalAmount,
            orderStatus : "pending"
        }

        const generatedOrder = await OrderModel.create(orderDoc)
        const user = await UserModel.findById(userId)

        await sendOrderConfirmationEmail({
            user,
            orderItems : [generatedOrder],
            paymentType : 'COD'
        })

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Your order is placed successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

const sendOrderConfirmationEmail = async ({ user, orderItems, paymentType }) => {
    const items = Array.isArray(orderItems) ? orderItems : [orderItems]

    if (!user || !items?.length) return

    const totalAmount = items.reduce((sum, item) => sum + Number(item.totalAmount || item.totalAmt || 0), 0)
    const orderIds = items.map(item => item.orderId)
    const orderLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/myorders/${orderIds[0]}`

    await sendEmail({
        sendTo : user.email,
        subject : paymentType === 'PAID' ? 'Payment Successful - Daily Basket' : 'Order Placed - Daily Basket',
        html : paymentType === 'PAID'
            ? paymentSuccessTemplate({
                name : user.name || 'Customer',
                totalAmount,
                orderIds,
                orderLink,
            })
            : orderPlacedTemplate({
                name : user.name || 'Customer',
                paymentType : 'Cash on Delivery',
                totalAmount,
                itemCount : items[0]?.products?.length || 1,
                orderIds,
                orderLink,
            })
    })

    if (paymentType === 'PAID') {
        await sendEmail({
            sendTo : user.email,
            subject : 'Order Placed - Daily Basket',
            html : orderPlacedTemplate({
                name : user.name || 'Customer',
                paymentType : 'Paid',
                totalAmount,
                itemCount : items[0]?.products?.length || 1,
                orderIds,
                orderLink,
            })
        })
    }
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        if(!addressId){
            return response.status(400).json({
                message : 'Please select a delivery address before proceeding to payment',
                error : true,
                success : false
            })
        }

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            const images = Array.isArray(item.productId.image) ? item.productId.image : (item.productId.image ? [item.productId.image] : [])

            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : images,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : Math.round(pricewithDiscount(item.productId.price,item.productId.discount) * 100)
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${baseUrl}/success`,
            cancel_url : `${baseUrl}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const products = []
    let totalAmount = 0

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)
            const quantity = Number(item.quantity || 1)
            const amountTotal = Number(item.amount_total / 100)
            const unitPrice = Number(item.price.unit_amount / 100)

            const productPayload = {
                productId : product.metadata.productId,
                productDetails : {
                    name : product.name,
                    image : product.images
                },
                quantity : quantity,
                price : unitPrice,
                subtotal : amountTotal,
            }

            products.push(productPayload)
            totalAmount += amountTotal
        }
    }

    return {
        products,
        totalAmount,
    }
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

    if (!endPointSecret) {
        return response.status(500).json({
            message : 'STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY is not configured',
            error : true,
            success : false
        })
    }

    try {
        const sig = request.headers['stripe-signature']

        if (!sig) {
            return response.status(400).json({
                message : 'Missing Stripe signature',
                error : true,
                success : false
            })
        }

        const event = Stripe.webhooks.constructEvent(request.body, sig, endPointSecret);

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
                const userId = session.metadata.userId
                const orderSummary = await getOrderProductItems({
                    lineItems : lineItems,
                    userId : userId,
                    addressId : session.metadata.addressId,
                    paymentId  : session.payment_intent,
                    payment_status : session.payment_status,
                })

                if(!orderSummary.products.length){
                    return response.status(200).json({received: true, duplicate: true});
                }

                const existingOrder = await OrderModel.findOne({ paymentId : session.payment_intent })
                if (existingOrder) {
                    return response.status(200).json({received: true, duplicate: true});
                }

                const orderDoc = {
                    userId : userId,
                    orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                    products : orderSummary.products,
                    paymentId : session.payment_intent,
                    paymentStatus : session.payment_status || 'paid',
                    deliveryAddress : session.metadata.addressId,
                    totalAmount : orderSummary.totalAmount,
                    orderStatus : 'pending'
                }

                const order = await OrderModel.create(orderDoc)

                if(Boolean(order)){
                    const orderUser = await UserModel.findById(userId)

                    await sendOrderConfirmationEmail({
                        user : orderUser,
                        orderItems : [order],
                        paymentType : 'PAID'
                    })

                    await UserModel.findByIdAndUpdate(userId,{
                        shopping_cart : []
                    })
                    await CartProductModel.deleteMany({ userId : userId})
                }
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return response.status(200).json({received: true});
    } catch (error) {
        console.error('Stripe webhook error:', error.message)
        return response.status(400).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id
        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('deliveryAddress').lean();

        const normalizedOrders = orderlist.map(order => ({
            ...order,
            products : Array.isArray(order.products) && order.products.length
                ? order.products
                : [{
                    productId : order.productId,
                    productDetails : order.product_details,
                    quantity : Number(order.quantity || 1),
                    price : Number(order.totalAmt || order.subTotalAmt || 0),
                    subtotal : Number(order.totalAmt || order.subTotalAmt || 0),
                }],
            paymentStatus : order.paymentStatus || order.payment_status || 'CASH ON DELIVERY',
            orderStatus : order.orderStatus || order.status || 'pending',
            totalAmount : Number(order.totalAmount || order.totalAmt || 0),
            deliveryAddress : order.deliveryAddress || order.delivery_address,
        }))

        return response.json({
            message : "order list",
            data : normalizedOrders,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
