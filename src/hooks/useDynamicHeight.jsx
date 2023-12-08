import { useState, useEffect, useRef } from "react";

const useDynamicHeight = () => {
  const [height, setHeight] = useState(100);
  const containerRef = useRef(null);

  const updateHeight = () => {
    if (containerRef.current) {
      setHeight(containerRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateHeight();

    const handleResize = () => {
      updateHeight();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { height, containerRef };
};

export default useDynamicHeight;
