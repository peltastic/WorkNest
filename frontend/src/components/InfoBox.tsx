import React from 'react'

type Props = {
    title: string
    body: string
}

const InfoBox = ({body, title}: Props) => {
  return (
    <div className='border border-tertiary text-center  rounded-md w-[25rem]  py-10'>
        <p className='text-2xl font-medium'>{title}</p>
        <p className='font-light text-primary'>{body}</p>
    </div>
  )
}

export default InfoBox