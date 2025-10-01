import React from "react";
import { assets } from "../assets/assets_frontend/assets";
const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p className="text-lg text-gray-500">
          ABOUT <span className="text-gray-900 font-medium">US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-12 my-10 ">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to Med-Help, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Med-Help, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
          Med-Help is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Med-Help is here to support you every step of the
            way.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
          Our vision at Med-Help is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>

        </div>
      </div>

      <div>
        <p className="text-xl my-4 text-gray-400">WHY <span className="text-gray-900 font-semibold">CHOOSE US</span></p>
        
        <div className="flex flex-col md:flex-row mb-20">
          <div className="flex flex-col gap-5 text-[15px] px-10 md:px-16 py-8 md:py-16 border border-gray-300 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
            <b className="mb-4">EFFICIENCY:</b>
            <p>
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          <div className="flex flex-col gap-5 text-[15px] px-10 md:px-16 py-8 md:py-16 border border-gray-300 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b className="mb-4">CONVENIENCE:</b>
          <p>
            Access to a network of trusted healthcare professionals in your area.
          </p>
          </div>

          <div className="flex flex-col gap-5 text-[15px] px-10 md:px-16 py-8 md:py-16 border border-gray-300 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
          <b className="mb-4">PERSONALIZATION:</b>
          <p>
           Tailored recommendations and reminders to help you stay on top of your health.
          </p>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default About;
