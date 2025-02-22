'use client'

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./components/CheckoutPage";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const amount = 260

export default function Home() {

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-br from-sky-700 to-sky-900 flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl text-sky-200">Esto es la página de pago</h2>

      <Elements stripe={stripePromise} options={{
        mode: 'payment',
        amount: amount,
        currency: 'eur'
      }}>
        <CheckoutPage amount={amount} />
      </Elements>
    </div>
  );
}
