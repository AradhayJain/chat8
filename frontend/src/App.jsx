import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom";
import '/src/css/home.css'; // Correct relative import for CSS file
import UserContextProvider from "./provider/ChatProvider";


const App = () => {
  const navigate=useNavigate();
  // const [count, setCount] =useState(0);
  return (
  <UserContextProvider navigate={navigate}>
    <div className="App">
      <Outlet/>
    </div>
  </UserContextProvider>
    
   
    
  
  )
}

export default App
