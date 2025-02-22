import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY as string)

export async function POST (req: NextRequest, res: NextResponse) {

    const {amount} = await req.json()

    try {
        const pi = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'eur',
            automatic_payment_methods: {enabled: true}
        })

        if(!pi){
            return NextResponse.json({errorMessage: "Payment intent failed", status: 500})
        }

        return NextResponse.json({clientSecret: pi.client_secret, status: 200})

    } catch (error) {
        return NextResponse.json({error: error, status: 500})
    }
}