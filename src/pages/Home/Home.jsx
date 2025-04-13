import React from "react";
import HeroContainer from "./HeroContainer";
import Gallary from "./Gallary/Gallary";
import PopularClasses from "./PopularClasses";
import PopularInstructor from "./PopularInstructor";

function Home() {
  return (
    <section>
      <HeroContainer />
      <div className="max-w-screen-xl mx-auto">
        <Gallary />
        <PopularClasses />
        <PopularInstructor />
      </div>
    </section>
  );
}

export default Home;
// PopularTeacher;
