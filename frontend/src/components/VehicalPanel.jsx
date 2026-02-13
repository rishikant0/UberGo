import React from "react";

const VehicalPanel = (props) => {
  return (
    <div>
      {/* CLOSE BUTTON */}
      <h5
        onClick={() => props.setvehicalPanel(false)}
        className="p-3 text-center w-[90%] absolute top-0"
      >
        <i className="text-3xl ri-arrow-down-wide-line text-gray-500"></i>
      </h5>

      <h3 className="text-sm font-semibold mb-3">Select a vehicle</h3>

      {/* ================= CAR ================= */}
      <div
        onClick={() => {
          props.setvehicalType("car");
          props.setvehicalPanel(false);
          props.setconfirmRidepopUp(true);
          props.createRide?.(); // SAFE CALL
        }}
        className="flex items-center gap-3 border rounded-lg p-2 mb-2 cursor-pointer"
      >
        <img
          className="h-14 w-20 object-contain"
          src="https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png"
          alt=""
        />

        <div className="flex-1">
          <h4 className="text-sm font-semibold">
            UberGo <i className="ri-user-3-fill"></i> 4
          </h4>
          <p className="text-xs text-gray-500">2 min away</p>
        </div>

        <h2 className="text-sm font-semibold">₹200</h2>
      </div>

      {/* ================= BIKE ================= */}
      <div
        onClick={() => {
          props.setvehicalType("bike");
          props.setvehicalPanel(false);
          props.setconfirmRidepopUp(true);
          props.createRide?.();
        }}
        className="flex items-center gap-3 border rounded-lg p-2 mb-2 cursor-pointer"
      >
        <img
          className="h-14 w-20 object-contain"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MjAwMTg5YS03MWMwLTRmNmQtYTlkZS0xYjZhODUyMzkwNzkucG5n"
          alt=""
        />

        <div className="flex-1">
          <h4 className="text-sm font-semibold">
            Moto <i className="ri-user-3-fill"></i> 1
          </h4>
          <p className="text-xs text-gray-500">4 min away</p>
        </div>

        <h2 className="text-sm font-semibold">₹85</h2>
      </div>

      {/* ================= AUTO ================= */}
      <div
        onClick={() => {
          props.setvehicalType("auto");
          props.setvehicalPanel(false);
          props.setconfirmRidepopUp(true);
          props.createRide?.();
        }}
        className="flex items-center gap-3 border rounded-lg p-2 cursor-pointer"
      >
        <img
          className="h-14 w-20 object-contain"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCbJM0-gQ837Dz0sT-JfKtAiiBL0biDx7vcQ&s"
          alt=""
        />

        <div className="flex-1">
          <h4 className="text-sm font-semibold">
            Auto <i className="ri-user-3-fill"></i> 3
          </h4>
          <p className="text-xs text-gray-500">3 min away</p>
        </div>

        <h2 className="text-sm font-semibold">₹120</h2>
      </div>
    </div>
  );
};

export default VehicalPanel;
