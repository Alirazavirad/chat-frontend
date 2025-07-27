import Chat from '@/components/Chat'
import React from 'react'

function page({params}) {
  return (
    <div>
        <Chat id={params.id}/>
    </div>
  )
}

export default page