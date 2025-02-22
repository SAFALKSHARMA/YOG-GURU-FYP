import React, { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";

const PopularTeacher = () => {
  const [instructors, setInstructors] = useState([]);
  const axiosFetch = useAxiosFetch();
  useEffect(() => {
    axiosFetch
      .get("/instructors")
      .then((data) => {
        setInstructors(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="md:w-[80%] mx-auto my-36">
      <div>
        <h1 className="text-5xl font-bold text-center">
          Our <span className="text-secondary">Popular</span> Teachers
        </h1>
        <div className="w-[40%] text-center mx-auto my-4">
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti,
            quaerat sint incidunt voluptatum magnam!
          </p>
        </div>
      </div>
      {instructors ? (
        <>
          <div></div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PopularTeacher;
