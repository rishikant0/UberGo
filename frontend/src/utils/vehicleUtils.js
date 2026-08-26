export const getVehicleDetails = (type) => {
  const normalizedType = String(type || "car").toLowerCase();

  if (normalizedType === "bike" || normalizedType === "motorcycle") {
    return {
      type: "bike",
      key: "motorcycle",
      name: "Moto",
      label: "Bike",
      icon: "🏍️",
      capacity: 1,
      tag: "1–3 min away • Speedy solo ride",
      image: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MjAwMTg5YS03MWMwLTRmNmQtYTlkZS0xYjZhODUyMzkwNzkucG5n",
    };
  }

  if (normalizedType === "auto") {
    return {
      type: "auto",
      key: "auto",
      name: "Uber Auto",
      label: "Auto",
      icon: "🛺",
      capacity: 3,
      tag: "2–5 min away • Pocket-friendly auto",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCbJM0-gQ837Dz0sT-JfKtAiiBL0biDx7vcQ&s",
    };
  }

  // Default to Car
  return {
    type: "car",
    key: "car",
    name: "UberGo",
    label: "Car",
    icon: "🚗",
    capacity: 4,
    tag: "2–4 min away • Comfortable sedan",
    image: "https://tb-static.uber.com/prod/vehicles-importer/2024/maruti-suzuki/dzire/high_res/1813669578094.png",
  };
};
