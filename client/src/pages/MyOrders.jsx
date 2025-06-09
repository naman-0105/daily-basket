import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { format } from 'date-fns'
import { FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa'
import { MdPending } from 'react-icons/md'

const getStatusIcon = (status) => {
  switch(status) {
    case 'pending': return <MdPending className="text-yellow-500" size={20} />
    case 'processing': return <FaBox className="text-blue-500" size={20} />
    case 'shipped': return <FaShippingFast className="text-purple-500" size={20} />
    case 'delivered': return <FaCheckCircle className="text-green-500" size={20} />
    default: return null
  }
}

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className='bg-white shadow-md p-4 mb-6 rounded-lg'>
        <h1 className="text-2xl font-semibold">My Orders</h1>
      </div>

      {!orders[0] && <NoData />}

      <div className="space-y-4">
        {orders.map((order, index) => (
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

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={order.product_details.image[0]} 
                alt={order.product_details.name}
                className="w-20 h-20 object-contain rounded-md"
              />  
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">
                  {order.product_details.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="capitalize text-gray-700">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
