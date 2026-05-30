import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')

    if(!code){
      setStatus('invalid')
      return
    }

    const verifyEmail = async()=>{
      try {
        const response = await Axios({
          ...SummaryApi.verifyEmail,
          data : { code }
        })

        if(response.data.success){
          setStatus('success')
        }
      } catch (error) {
        setStatus('error')
        AxiosToastError(error)
      }
    }

    verifyEmail()
  }, [searchParams])

  const handleGoToLogin = () => {
    navigate('/login', {
      state : {
        bannerMessage : 'Email verified successfully. Please log in to continue.'
      }
    })
  }

  return (
    <div className='min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center'>
        {status === 'loading' && (
          <div className='space-y-4'>
            <div className='mx-auto h-12 w-12 rounded-full border-4 border-green-200 border-t-green-700 animate-spin'></div>
            <h1 className='text-2xl font-bold text-gray-800'>Verifying your email</h1>
            <p className='text-gray-600'>Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className='space-y-5'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl'>✓</div>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>Email verified successfully</h1>
              <p className='mt-2 text-gray-600'>Your account is now active. You can log in and start shopping.</p>
            </div>
            <button onClick={handleGoToLogin} className='w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800'>Go to Login</button>
          </div>
        )}

        {(status === 'invalid' || status === 'error') && (
          <div className='space-y-5'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-700 text-2xl'>!</div>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>Verification failed</h1>
              <p className='mt-2 text-gray-600'>The verification link is invalid or expired. Please register again or request a new verification email.</p>
            </div>
            <div className='flex flex-col gap-3'>
              <Link to='/register' className='rounded-lg border border-green-700 px-4 py-3 font-semibold text-green-700 hover:bg-green-50'>Create account</Link>
              <Link to='/login' className='rounded-lg bg-gray-800 px-4 py-3 font-semibold text-white hover:bg-gray-900'>Back to Login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
