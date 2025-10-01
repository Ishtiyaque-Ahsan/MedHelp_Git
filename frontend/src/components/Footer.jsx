import React from 'react'
import {assets} from '../assets/assets_frontend/assets'
const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        {/* left section */}
        <div >
            <img className='mb-5 w-40' src={assets.Logo_MH} alt='' />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>
              Med-Help is online doctor appointment booking platform. Here you can browse through list of qualified doctors of various categories and book your appointment and get treatment hazzlefree.
            </p>
        </div>

        {/* center section */}
        <div>
            <p className='text-xl mb-5 font-medium'>Company</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        {/* right section */}
        <div>
        <p className='text-xl mb-5 font-medium'>Get In Touch</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
            <li>123-45-678-90</li>
            <li>abc@gmail.com</li>
        </ul>
        </div>
      </div>
      {/* copyright*/}
      <div>
        <hr />
        <p className='text-center py-5 text-sm'>All Rights Reserved @ Med-Help</p>
      </div>
    </div>
  )
}

export default Footer
