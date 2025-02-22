import React from 'react'

import classes from "@/app/styles/Spinner.module.css"

type Props = {
    dark?: boolean
}

const Spinner = (props: Props) => {
  return (
    <div className={`${classes.loader} border-2 ${props.dark ? "border-black" : "border-white"}  w-full`}></div>
  )
}

export default Spinner