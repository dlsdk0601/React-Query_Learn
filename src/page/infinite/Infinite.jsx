import React from 'react';
import {InfinitePeople} from "./InfinitePeople";
import {InfiniteSpecies} from "./InfiniteSpecies";
import "./Infinite.css";

const Infinite = () => {
  return (
    <div className="App">
      <h1>Infinite SWAPI</h1>
      {/*<InfinitePeople />*/}
       <InfiniteSpecies />
    </div>
  );
};

export default Infinite;