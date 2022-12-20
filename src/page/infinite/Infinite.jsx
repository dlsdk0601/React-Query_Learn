import React from 'react';
import {InfinitePeople} from "./InfinitePeople";
import "./Infinite.css";

const Infinite = () => {
  return (
    <div className="App">
      <h1>Infinite SWAPI</h1>
      <InfinitePeople />
      {/* <InfiniteSpecies /> */}
    </div>
  );
};

export default Infinite;