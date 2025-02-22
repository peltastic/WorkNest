import LoginForm from '@/components/Forms/LoginForm'
import React from 'react'

type Props = {}

const UserLoginPage = (props: Props) => {
  return (
    <section className='flex bg-bg1'>
      <div className="min-h-screen border w-[50%] user-auth-bg"></div>
      <div className="w-[50%] flex flex-col justify-center items-center">
        <div className="px-20 mt-20 flex w-full ">
          <div className="w-full">
            <h2 className="text-2xl font-medium">Log into your account</h2>
            <div className="w-full">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserLoginPage