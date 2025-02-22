import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, {useState, useEffect} from 'react'

const CheckoutPage = ({amount}:{amount:number}) => {
    const stripe = useStripe()
    const elements = useElements()

    const [clientSecret, setClientSecret] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>()

    useEffect(() => {
        const fetchCS = async () => { // Here we fetch the Client Secret
            const response = await fetch('/api/payment_intent', {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({amount})
            })
            const data = await response.json()
            const returnedCS = await data.clientSecret
            console.log(data)
            setClientSecret(returnedCS)
        }
        fetchCS()
    }, [amount])

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
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/success`
            }
        })

        if(error){
            setErrorMessage(error.message)
        }else {
            console.log(clientSecret)
            // Redirected to the url
        }
    }   
    
  return (
    <form onSubmit={handleSubmit}
    className='flex flex-col items-center justify-center gap-4 bg-sky-100 p-20 rounded-md shadow-md'>
        {clientSecret && <PaymentElement/>}
        <button 
            type='submit'
            className='w-fit p-4 bg-sky-700 shadow-md shadow-black text-sky-100 font-bold rounded-md'>
                {loading ? `Pay ${amount}€ now` : 'Processing...'}
        </button>
    </form> 
  )
}

export default CheckoutPage