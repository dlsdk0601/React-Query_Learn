import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import PostMain from "./page/post/PostMain";
import Infinite from "./page/infinite/Infinite";

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
          <Route path={"/star-wars"} element={<Infinite />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
