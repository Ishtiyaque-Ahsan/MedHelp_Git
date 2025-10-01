import React from 'react'
import { assets } from "../assets/assets_frontend/assets";

export default function Contact() {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm my-10'>
        <img className='w-full max-w-[360px] ' src={assets.contact_image} alt='' />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
          <p className='text-gray-500'>Sir Syed Nagar <br/> Aligarh, Uttar Pradesh, India</p>
          <p className='text-gray-500'>Tel: (000) 000-0000 <br/> Email: iahsanamu@gmail.com</p>
          <p className='text-gray-600 text-lg font-semibold'>CAREERS AT Med-Help</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-gray-800 p-5 rounded-lg hover:bg-black hover:text-white transition-all duration-500 cursor-pointer'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}
