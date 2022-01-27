import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Create } from "./components/Create";
import { Videoroom } from "./components/Videoroom";

const  App =  () => {
  return (
    <div className="App">
      
   <Router>
      <div className="videocontainer">
        <Routes>
        <Route path="/" element={<Videoroom />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
