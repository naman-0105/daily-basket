import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const Success = () => {
  const location = useLocation()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const savedSummary = location.state?.orderData || JSON.parse(localStorage.getItem('pendingOrderSummary') || 'null')

        if (savedSummary) {
          setSummary(savedSummary)
        }

        const token = localStorage.getItem('accesstoken')

        if (token) {
          const response = await Axios({
            ...SummaryApi.getOrderItems,
          })

          if (response.data.success && response.data.data?.length) {
            const latestOrder = response.data.data[0]
            const normalizedProducts = Array.isArray(latestOrder.products) && latestOrder.products.length
              ? latestOrder.products
              : [
                  {
                    productDetails: latestOrder.product_details,
                    quantity: latestOrder.quantity || 1,
                    subtotal: Number(latestOrder.totalAmt || latestOrder.subTotalAmt || 0),
                    price: Number(latestOrder.totalAmt || latestOrder.subTotalAmt || 0)
                  }
                ]

            const normalizedSummary = {
              orderId: latestOrder.orderId,
              paymentType: latestOrder.paymentStatus === 'paid' ? 'Paid' : 'Cash on Delivery',
              paymentStatus: latestOrder.paymentStatus || latestOrder.payment_status || 'Pending',
              totalAmount: Number(latestOrder.totalAmount || latestOrder.totalAmt || 0),
              products: normalizedProducts,
              deliveryAddress: latestOrder.deliveryAddress || latestOrder.delivery_address,
            }

            setSummary(normalizedSummary)
            localStorage.setItem('pendingOrderSummary', JSON.stringify(normalizedSummary))
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [location.state])

  useEffect(() => {
    return () => {
      localStorage.removeItem('pendingOrderSummary')
    }
  }, [])

  if (loading) {
    return (
      <div className='m-4 mx-auto max-w-2xl rounded bg-white p-6 shadow'>
        <p className='text-gray-700'>Loading order details...</p>
      </div>
    )
  }

  const paymentLabel = summary?.paymentType === 'Paid' ? 'Payment successful' : 'Order placed successfully'
  const paymentBadge = summary?.paymentType === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'

  return (
    <div className='mx-auto my-6 w-full max-w-3xl px-4'>
      <div className='rounded-2xl bg-white p-6 shadow-lg'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${paymentBadge}`}>{paymentLabel}</p>
            <h1 className='mt-3 text-2xl font-bold text-gray-900'>Your order is confirmed</h1>
            <p className='mt-2 text-sm text-gray-600'>Thanks for shopping with Daily Basket.</p>
          </div>
          <div className='rounded-lg bg-green-50 px-3 py-2 text-right'>
            <p className='text-xs uppercase tracking-wide text-green-700'>Total amount</p>
            <p className='text-xl font-bold text-green-900'>{DisplayPriceInRupees(summary?.totalAmount || 0)}</p>
          </div>
        </div>

        <div className='mt-6 grid gap-4 md:grid-cols-2'>
          <div className='rounded-xl bg-gray-50 p-4'>
            <p className='text-xs uppercase tracking-wide text-gray-500'>Order ID</p>
            <p className='mt-1 font-semibold text-gray-900'>{summary?.orderId || 'N/A'}</p>
          </div>
          <div className='rounded-xl bg-gray-50 p-4'>
            <p className='text-xs uppercase tracking-wide text-gray-500'>Payment status</p>
            <p className='mt-1 font-semibold capitalize text-gray-900'>{summary?.paymentStatus || 'Pending'}</p>
          </div>
        </div>

        <div className='mt-6 rounded-xl bg-gray-50 p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <p className='text-sm font-semibold text-gray-900'>Products</p>
            <p className='text-xs uppercase tracking-wide text-gray-500'>Qty / Subtotal</p>
          </div>

          <div className='space-y-3'>
            {summary?.products?.map((product, index) => (
              <div key={index} className='flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm'>
                <div>
                  <p className='font-medium text-gray-900'>{product?.productDetails?.name || product?.name || 'Product'}</p>
                  <p className='text-xs text-gray-500'>Payment: {summary?.paymentType || 'Pending'}</p>
                </div>
                <div className='text-right'>
                  <p className='font-semibold text-gray-900'>{product?.quantity || 1} x</p>
                  <p className='text-sm text-gray-600'>{DisplayPriceInRupees(product?.subtotal || product?.price || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-6 rounded-xl bg-gray-50 p-4'>
          <p className='text-xs uppercase tracking-wide text-gray-500'>Delivery address</p>
          <p className='mt-2 text-sm text-gray-800'>
            {summary?.deliveryAddress?.address_line || summary?.deliveryAddress?.addressLine || 'Address not available'}
          </p>
          <p className='text-sm text-gray-700'>
            {summary?.deliveryAddress?.city || ''}{summary?.deliveryAddress?.city ? ', ' : ''}{summary?.deliveryAddress?.state || ''} {summary?.deliveryAddress?.pincode || ''}
          </p>
        </div>

        <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
          {summary?.orderId && (
            <Link to={`/dashboard/myorders/${summary.orderId}`} className='rounded-lg bg-green-700 px-4 py-2 text-center font-semibold text-white hover:bg-green-800'>View My Order</Link>
          )}
          <Link to='/' className='rounded-lg border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700 hover:bg-gray-50'>Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

export default Success
