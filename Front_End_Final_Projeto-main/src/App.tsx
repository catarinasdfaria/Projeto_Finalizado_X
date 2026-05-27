import Content from "./components/Content"
import { createContext, useState } from "react";
import "./styles/theme.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
export const ThemeContext = createContext<any>(null);
import ErrorPage from "./components/ErrorPage";
import LandingPage from "./components/LandingPage";

function App() {

  const [theme,setTheme]= useState('ligth');
  

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <div className={`app-root container-fluid text-center theme-${theme}`} data-bs-theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="*" element={<ErrorPage/>} />
            <Route path="/content" element={<ProtectedRoute><Content/></ProtectedRoute>}/>
            <Route path="/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard/></ProtectedRoute>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
