import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShortenUrlPage from "./components/ShortenUrlPage";
import { LandingPage } from "./components/LandingPage";
import { AboutPage } from "./components/AboutPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import PrivateRoute from "./PrivateRoute";
import FullLog from "./components/FullLog";
import LinkAnalytics from "./components/LinkAnalytics";

// <PrivateRoute publicPage={true}>
//      <RegisterPage />
// </PrivateRoute>

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<PrivateRoute publicPage={true}><LoginPage /></PrivateRoute>} />
          <Route path="/register" element={<PrivateRoute publicPage={true}><RegisterPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute publicPage={false}><Dashboard /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute publicPage={false}><Analytics /></PrivateRoute>} />
          <Route path="/analytics/:linkId" element={<PrivateRoute publicPage={false}><LinkAnalytics /></PrivateRoute>} />
          <Route path="/fullLog" element={<PrivateRoute publicPage={false}><FullLog /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default AppRouter;

export const SubDomainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:url" element={<ShortenUrlPage />} />
      </Routes>
    </BrowserRouter>
  )
}