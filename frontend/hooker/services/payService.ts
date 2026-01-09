
export async function verifyPayment(orderID: string, token: string) {
    const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderID })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Payment verification failed');
    }

    return response.json();
}
