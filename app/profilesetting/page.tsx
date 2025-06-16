import ProfileSetting from '@/components/profileSetting'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div>
    <Suspense><ProfileSetting/></Suspense>  
    </div>
  )
}

export default page
