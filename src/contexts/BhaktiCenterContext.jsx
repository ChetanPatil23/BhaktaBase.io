import React, { createContext, useContext, useEffect, useState } from "react";

const BhaktiCenterContext = createContext();

export const useBhaktiCenter = () => useContext(BhaktiCenterContext);

export const BhaktiCenterProvider = ({ children }) => {
  const [selectedCenter, setSelectedCenter] = useState(() => {
    return localStorage.getItem("bhaktiCenter") || "";
  });

  const [centers, setCenters] = useState([]);
  const [batches, setBatches] = useState([]);

  const updateCenter = (center) => {
    setSelectedCenter(center);
    localStorage.setItem("bhaktiCenter", center);
  };

  const fetchCenters = async () => {
    try {
      const response = await fetch(`http://localhost:3000/center`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCenters(data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch(`http://localhost:3000/batch`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };
  useEffect(() => {
    fetchCenters();
    fetchBatches();
  }, []);

  return (
    <BhaktiCenterContext.Provider
      value={{ selectedCenter, updateCenter, centers, batches }}
    >
      {children}
    </BhaktiCenterContext.Provider>
  );
};
