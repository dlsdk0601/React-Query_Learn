import React from 'react';
import { Posts } from "./Posts";

import "./App.css";

const PostMain = () => {
  return (
    <div>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
    </div>
  );
};

export default PostMain;