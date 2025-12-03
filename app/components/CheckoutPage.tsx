import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, {useState, useEffect} from 'react'

const CheckoutPage = ({amount}:{amount:number}) => {
    const stripe = useStripe()
    const elements = useElements()

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        
        
        // Check if there are stripe or elements (means that we have the access to Stripe)
        if(!stripe || !elements){
            return;
        }

        // If there is any error by submiting the info, it will be cought 
        const {error: submitError} = await elements.submit() // Send the payment information before cofirming payment

        if(submitError){
            setErrorMessage(submitError.message)
            setLoading(false)
            return
        }

        // Now we can confirm the payment passing the elements, the CS and the params (url to be redirected to)
        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `http://www.localhost:3000/success`
            }
        })

        if(error){
            setErrorMessage(error.message)
            setLoading(false)
        }
        // Payment will be processed on the server
    }   
    
  return (
    <form onSubmit={handleSubmit}
    className='flex flex-col items-center justify-center gap-4 bg-sky-100 p-20 rounded-md shadow-md'>
        <PaymentElement/>
        <button 
            type='submit'
            className='w-fit p-4 bg-sky-700 shadow-md shadow-black text-sky-100 font-bold rounded-md'>
                {loading ? 'Processing...' : `Pay ${amount}€ now`}
        </button>
    </form> 
  )
}

export default CheckoutPage