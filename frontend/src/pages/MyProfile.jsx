import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import assets from "../assets/assets";
const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    //api call to backend to update user profile data
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address)); // Convert address object to JSON string
      formData.append("gender", userData?.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);
      
      const {data}=await axios.post(backendUrl + "/api/user/update-profile", formData, {headers: {token}})
      if(data.success){
        toast.success(data.message)
        await loadUserProfileData() //to load updated data
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error(error.message)
    }
  }

  // we put userData as conditional rendering as initially userData is false
  // after api call it will have data
  // if we dont put conditional rendering, page will load first and it will give error as initially userData is false and false.name is not possible
  //so we put userData && to first check if userData is there then only load the page
  return userData && (
    <div className="max-w-lg flex flex-col gap-2 text-sm">

      {
        isEdit ?
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer ">
              <img className="w-36 rounded opacity-75" src={image ? URL.createObjectURL(image) : userData.image} alt="" />
              <img className="w-10 absolute bottom-12 right-12" src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
          : <img className='w-36 rounded' src={userData.image} alt="" />


      }

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-80 mt-4"
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userData.name}
        />
      ) : (
        <p className="text-neutral-800 text-3xl font-medium mt-4">{userData.name}</p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div >
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email Id:</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userData.address.line1}
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userData.address.line2}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="mx-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value={"Male"}>Male</option>
              <option value={"Female"}>Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  DOB: e.target.value,
                }))
              }
              value={userData.DOB}
            />
          ) : (
            <p className="text-gray-400">{userData.DOB}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        {
          isEdit
            ? <button className="border border-primary py-2 px-8 rounded-full hover:bg-primary hover:text-white transition-all" onClick={updateUserProfileData}>Save Information</button>
            : <button className="border border-primary py-2 px-8 rounded-full hover:bg-primary hover:text-white transition-all" onClick={() => setIsEdit(true)}>Edit</button>
        }
      </div>

    </div>
  );
};

export default MyProfile;
 