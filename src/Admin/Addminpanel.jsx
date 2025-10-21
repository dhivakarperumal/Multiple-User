// import React from 'react'

// const Addminpanel = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Addminpanel


import React from "react";
import Sidebar from "./Header/Sidebar";
import Topbar from "./Header/Topbar";
import { Outlet } from "react-router-dom";

const Addminpanel = () => {
  return (
    <div className="flex">
     
      <Sidebar />

     
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <Topbar />

       
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Addminpanel;
