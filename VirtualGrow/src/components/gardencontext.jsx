import { createContext, useState, useContext } from "react";

const GardenContext = createContext();

export const GardenProvider = ({ children }) => {
  const [gardens, setGardens] = useState([]); // List of gardens
  const [selectedGarden, setSelectedGarden] = useState(null); // Active garden

  const updateGardenImage = (gardenId, newImage) => {
    setGardens((prevGardens) =>
      prevGardens.map((garden) =>
        garden.id === gardenId ? { ...garden, image: newImage } : garden
      )
    );

    // Ensure the selected garden updates too
    if (selectedGarden?.id === gardenId) {
      setSelectedGarden((prev) => ({ ...prev, image: newImage }));
    }
  };

  return (
    <GardenContext.Provider value={{ gardens, selectedGarden, setSelectedGarden, updateGardenImage }}>
      {children}
    </GardenContext.Provider>
  );
};

export const useGarden = () => useContext(GardenContext);
