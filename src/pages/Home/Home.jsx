import React from "react";
import HeroContainer from "./HeroContainer";
import Gallary from "./Gallary/Gallary";
import PopularClasses from "./Popular Classes/PopularClasses";
import PopularTeacher from "./PopularTeacher/PopularTeacher";

function Home() {
  return (
    <section>
      <HeroContainer />
      <div className="max-w-screen-xl mx-auto">
        <Gallary />
        <PopularClasses />
        <PopularTeacher />
      </div>
    </section>
  );
}

export default Home;
// PopularTeacher;
