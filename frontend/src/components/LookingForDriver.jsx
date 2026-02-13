import React from 'react'

const LookingForDriver = (props) => {
  return (
   <div className="relative px-4 pt-12 pb-6">

      {/* CLOSE HANDLE */}
      <div
        onClick={() => props.setvehicalFound(false)}
        className="absolute top-2 left-0 right-0 flex justify-center cursor-pointer"
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-400"></i>
      </div>

      {/* TITLE */}
      <h3 className="text-center text-base font-semibold mb-4">
        Looking for driver
      </h3>

      {/* VEHICLE IMAGE */}
      <div className="flex justify-center mb-4">
        <img
          className="h-20 object-contain"
          src="https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png"
          alt="vehicle"
        />
      </div>

      {/* DETAILS CARD */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">

        {/* PICKUP */}
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-line text-lg text-gray-700"></i>
          <div>
            <h4 className="text-sm font-medium">151/12-B</h4>
            <p className="text-xs text-gray-500">
              {props.pickup}
            </p>
          </div>
        </div>

        {/* DESTINATION */}
        <div className="flex items-start gap-3">
          <i className="ri-map-pin-fill text-lg text-gray-700"></i>
          <div>
            <h4 className="text-sm font-medium">151/12</h4>
            <p className="text-xs text-gray-500">
              {props.destination}
            </p>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="flex items-start gap-3">
          <i className="ri-bank-card-line text-lg text-gray-700"></i>
          <div>
            <h4 className="text-sm font-medium">₹1549</h4>
            <p className="text-xs text-gray-500">Cash payment</p>
          </div>
        </div>
      </div>
 

    </div>
  )
}

export default LookingForDriver