import SuccessPage from '@/components/successPage'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
     <Suspense> <SuccessPage/></Suspense>
    </div>
  )
}

export default page
