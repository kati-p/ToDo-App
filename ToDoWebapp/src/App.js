import { Routes, Route } from "react-router-dom";
import Credit from "./Components/Credit";
import Main from "./Components/Main";
import SignIn from "./Components/SignIn";
import SignOut from "./Components/SignOut";
import SignUp from "./Components/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn/>} />
      <Route path="/signin" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/signout" element={<SignOut/>} />
      <Route path="/main" element={<Main/>} />
      <Route path="/credit" element={<Credit/>} />
    </Routes>
  );
}

export default App;
