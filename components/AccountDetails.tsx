import React from 'react'

const AccountDetails = () => {
  return (
    <div>
       <div className="bg-[#EEF9FF] lg:p-2 rounded-md p-1  ">
                    
                 
                <div className="flex justify-between lg:p-2 p-1  ">  <p className="lg:text-sm text-[0.7rem] ">Account Name:</p> <p className='text-[0.7rem] lg:text-sm] truncate max-w-[200px]'>John Doe</p></div>
                <div className="flex justify-between lg:p-2 p-1  ">  <p className="lg:text-sm text-[0.7rem] ">Account Number:</p> <p className='text-[0.7rem] lg:text-sm]'>7083175021</p></div>
                <div className="flex justify-between lg:p-2 p-1  ">  <p className="lg:text-sm text-[0.7rem] ">Bank Name:</p> <p className='text-[0.7rem] lg:text-sm]'>Opay</p></div>
                
                
                 </div>
    </div>
  )
}

export default AccountDetails
