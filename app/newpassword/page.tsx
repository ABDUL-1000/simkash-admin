import NewPassword from '@/components/newPassword'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
    <Suspense><NewPassword/></Suspense> 
    </div>
  )
}

export default page
