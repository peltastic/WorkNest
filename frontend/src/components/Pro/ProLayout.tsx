import React, { ReactNode } from 'react'
import ProNav from './ProNav'

type Props = {
    children: ReactNode
    type?: "login" | "signup";
}

const ProLayout = (props: Props) => {
  return (
    <div>
        <ProNav type={props.type} />
        <main className='px-10 bg-bg1 min-h-screen'>{props.children}</main>

    </div>
  )
}

export default ProLayout