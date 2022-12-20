import { Posts } from "./page/post/Posts";
import "./App.css";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import PostMain from "./page/post/PostMain";

function App() {
  return (
    <>
      <BrowserRouter>
      <header className="header">
        <ul>
          <li><Link to={"/"}>Posts</Link></li>
          <li><Link to={"/star-wars"}>Star was</Link></li>
        </ul>
      </header>
        <Routes>
          <Route path={"/"} element={<PostMain />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
