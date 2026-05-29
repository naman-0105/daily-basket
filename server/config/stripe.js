import stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
}

const Stripe = stripe(stripeSecretKey)

export default Stripe