import { useState, useEffect, useCallback } from "react";

const useFetchData = (dataURL) => {
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    let data;
    try {
      const response = await fetch(dataURL);
      data = await response.json();
    } catch (error) {
      console.log(error);
    }

    if (data) {
      setData(data);
      return;
    }
  }, [dataURL]);
  useEffect(() => {
    getData();
  }, []);

  return [data, setData];
};

export default useFetchData;
