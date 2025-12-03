'use client'

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./components/CheckoutPage";
import { useEffect, useState } from "react";

// Mover la inicialización fuera del componente
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const amount = 260;

export default function Home() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Crear el Payment Intent cuando el componente se monte
    fetch('/api/payment_intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-br from-sky-700 to-sky-900 flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl text-sky-200">Esto es la página de pago</h2>

      {clientSecret && (
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      )}
    </div>
  );
}
