// Loads Razorpay's checkout script once and reuses it on later calls,
// instead of injecting a new <script> tag every time someone pays.
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'))
    document.body.appendChild(script)
  })
}

// Opens the Razorpay checkout popup for a given order, and resolves with
// the payment details once the user completes payment. Rejects if the
// popup is dismissed or the script fails to load.
export async function openRazorpayCheckout({ order, name, description, prefill }) {
  await loadRazorpayScript()

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name,
      description,
      prefill,
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    })
    razorpay.open()
  })
}
