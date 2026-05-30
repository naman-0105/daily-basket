import { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(null)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const selectedAddress = typeof selectAddress === 'number' && addressList[selectAddress]?.status !== false
    ? addressList[selectAddress]
    : addressList.find(address => address.status !== false) || null

  useEffect(() => {
    if (addressList.length === 0) {
      setSelectAddress(null)
      return
    }

    const activeAddressIndex = addressList.findIndex(address => address.status !== false)

    if (selectAddress === null || !addressList[selectAddress] || addressList[selectAddress]?.status === false) {
      if (activeAddressIndex >= 0) {
        setSelectAddress(activeAddressIndex)
      }
    }
  }, [addressList, selectAddress])

  const handleCashOnDelivery = async() => {
      try {
          if(!selectedAddress?._id){
            toast.error('Please select a delivery address before placing order')
            return
          }

          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : selectedAddress?._id,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              const orderSummary = {
                orderId : responseData.data?.orderId,
                paymentType : 'Cash on Delivery',
                paymentStatus : 'CASH ON DELIVERY',
                totalAmount : responseData.data?.totalAmount || totalPrice,
                products : responseData.data?.products || cartItemsList.map(item => ({
                  productDetails : item.productId,
                  quantity : item.quantity || 1,
                  subtotal : Number(item.productId.price || 0) * Number(item.quantity || 1),
                  price : Number(item.productId.price || 0)
                })),
                deliveryAddress : selectedAddress,
              }

              localStorage.setItem('pendingOrderSummary', JSON.stringify(orderSummary))
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/success',{
                state : {
                  text : "Order",
                  orderData : orderSummary,
                  paymentType : 'Cash on Delivery'
                }
              })
          }

      } catch (error) {
        toast.dismiss()
        AxiosToastError(error)
      }
  }

  const handleOnlinePayment = async()=>{
    try {

        if(!selectedAddress?._id){
          toast.error('Please select a delivery address before proceeding to payment')
          return
        }

        if (totalPrice < 50) {
          toast.error('Online payment is available for orders of ₹50 or more.')
          return
        }

        const loadingToast = toast.loading("Loading...")

        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        const stripePromise = await loadStripe(stripePublicKey)
       
        const response = await Axios({
            ...SummaryApi.payment_url,
            data : {
              list_items : cartItemsList,
              addressId : selectedAddress?._id,
            }
        })

        toast.dismiss(loadingToast)

        const { data : responseData } = response

        const pendingOrderSummary = {
          paymentType : 'Paid',
          paymentStatus : 'paid',
          totalAmount : totalPrice,
          products : cartItemsList.map(item => ({
            productDetails : item.productId,
            quantity : item.quantity || 1,
            subtotal : Number(item.productId.price || 0) * Number(item.quantity || 1),
            price : Number(item.productId.price || 0)
          })),
          deliveryAddress : selectedAddress,
        }

        localStorage.setItem('pendingOrderSummary', JSON.stringify(pendingOrderSummary))

        stripePromise.redirectToCheckout({ sessionId : responseData.id })
        
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
    } catch (error) {
        toast.dismiss()
        AxiosToastError(error)
    }
  }
  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {
              addressList.map((address, index) => {
                return (
                  <label key={address._id || index} htmlFor={"address" + index} className={!address.status && "hidden"}>
                    <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                      <div>
                        <input id={"address" + index} type='radio' value={index} checked={Number(selectAddress) === index} onChange={(e) => setSelectAddress(Number(e.target.value))} name='address' />
                      </div>
                      <div>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>



        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>
          {/**summary**/}
          <h3 className='text-lg font-semibold'>Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quntity total</p>
              <p className='flex items-center gap-2'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p className='flex items-center gap-2'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p >Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
          {!selectedAddress?._id ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-700 font-medium">
                Please select or add a delivery address to proceed.
              </p>
            </div>
          ) : (
            <>
              <div>
                <button
                  className={`w-full py-2 px-4 rounded font-semibold ${
                    totalPrice < 50
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                  }`}
                  disabled={totalPrice < 50}
                  onClick={handleOnlinePayment}
                >
                  Online Payment
                </button>

                {totalPrice < 50 && (
                  <p className="mt-1 text-xs text-red-600">
                    Online payment is available for orders of ₹50 or more.
                  </p>
                )}
              </div>

              <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>
                Cash on Delivery
              </button>
            </>
          )}

          </div>
        </div>
      </div>


      {
        openAddress && (
          <AddAddress close={() => setOpenAddress(false)} />
        )
      }
    </section>
  )
}

export default CheckoutPage
