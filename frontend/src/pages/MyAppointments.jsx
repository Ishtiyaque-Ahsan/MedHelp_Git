import React, { useContext, useState, useEffect } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
const MyAppointments = () => {

  const {backendUrl, token, getDoctorsData} = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormatter = (slotDate) => {
    const dateArray = slotDate.split("-")
    const day = dateArray[0]
    const month = months[parseInt(dateArray[1])-1]  //because month array is 0 indexed
    //Number(dateArray[1])-1 can also be used instead of parseInt
    const year = dateArray[2]
    return `${day} ${month} ${year}`
  }
  const getUserAppointments = async() => {
    try {
      const {data} = await axios.get(backendUrl+'/api/user/appointments', {headers:{token}})
      if(data?.success){
        setAppointments(data?.appointments.reverse())
        console.log(data?.appointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    if(token){
      getUserAppointments()
    }
  }, [token])

  const cancelAppointment = async (appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/user/cancel-appointment', {appointmentId}, {headers:{token}})
      if(data?.success){
        toast.success(data?.message)
        getUserAppointments()
        getDoctorsData() // to update the available slots of the doctor
        //due to getDoctorsData(), the available slots of the doctor will be updated in the frontend without refreshing the page
        //Reason: getDoctorsData() is updating the useState variable 'doctors' in AppContext, which will depict the changes in frontend immediately without refreshing the page
        //if you are only updating the backend database, then also the changes will not be reflected in frontend until you refresh the page
      } else {
        toast.error(data?.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {appointments.map((item,index)=> (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={index}> 
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt='' />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-700 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormatter(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div>

            </div>

            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && <button className='text-sm text-red-600 text-center sm:min-w-48 py-2 border border-red-600 '>Appointment Cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
