import {Routes,Route,BrowserRouter }  from "react-router-dom";
import EmployeesTable from "./Table/table";
import LogIn from "./LoginPage/login";
import RegistrationForm from "./RegisterPage/register";
function App() {
  return (
     <>
 <BrowserRouter>
    <Routes>
      <Route path="/" element={<LogIn/>}/>
      <Route path="/signup" element={<LogIn/>}/>
      <Route path="/table" element={<EmployeesTable/>}/>  
      <Route path="/register" element={<RegistrationForm/>}/> 

    </Routes>
 </BrowserRouter>  
      </>
  );
}

export default App;
