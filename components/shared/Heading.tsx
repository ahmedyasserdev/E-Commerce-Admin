import React from 'react'

const Heading = ({title , description} : {title : string , description : string} ) => {
  return (
    <div>
        <h2 className='h2-bold tracking-tight' >{title}</h2>
        <p  className = "p-regular-14 text-muted-foreground" >{description}</p>
    </div>
  )
}

export default Heading