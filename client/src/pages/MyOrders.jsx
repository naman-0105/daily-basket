import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import NoData from '../components/NoData'
import { format } from 'date-fns'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const { orderId } = useParams()
  const filteredOrders = orderId ? orders.filter(order => order.orderId === orderId) : orders

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className='bg-white shadow-md p-4 mb-6 rounded-lg'>
        <h1 className="text-2xl font-semibold">My Orders</h1>
      </div>

      {!filteredOrders[0] && <NoData />}

      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const paymentType = order?.paymentStatus === 'paid' || order?.payment_status === 'paid' ? 'Paid' : 'Cash on Delivery'
          const productItems = Array.isArray(order?.products) && order.products.length
            ? order.products
            : [{
                productDetails : order.product_details || {},
                quantity : Number(order?.quantity || 1),
                subtotal : Number(order?.totalAmount || order?.totalAmt || order?.subTotalAmt || 0),
              }]

          return (
            <div 
              key={order._id + index + "order"} 
              className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.01]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600">Order No:</p>
                  <p className="font-medium">{order?.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Ordered on:</p>
                  <p className="font-medium">
                    {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(order.orderDate), 'hh:mm a')}
                  </p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-medium text-gray-800">{paymentType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Order total</p>
                  <p className="font-medium text-gray-800">{DisplayPriceInRupees(Number(order?.totalAmount || order?.totalAmt || 0))}</p>
                </div>
              </div>

              <div className="space-y-3">
                {productItems.map((item, itemIndex) => {
                  const image = Array.isArray(item?.productDetails?.image) ? item.productDetails.image[0] : item?.productDetails?.image || item?.image || ''
                  const name = item?.productDetails?.name || item?.name || 'Product'
                  const quantity = Number(item?.quantity || 1)
                  const subtotal = Number(item?.subtotal || item?.price || 0)

                  return (
                    <div key={`${order._id}-${itemIndex}`} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                      <img
                        src={image}
                        alt={name}
                        className="h-20 w-20 rounded-md object-contain"
                      />
                      <div className="flex-1">
                        <h3 className="mb-2 text-lg font-medium">{name}</h3>
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-3">
                          <div>
                            <p className="text-gray-500">Quantity</p>
                            <p className="font-medium text-gray-800">{quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="font-medium text-gray-800">{DisplayPriceInRupees(Number(item?.price || subtotal / quantity || 0))}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Subtotal</p>
                            <p className="font-medium text-gray-800">{DisplayPriceInRupees(subtotal)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
