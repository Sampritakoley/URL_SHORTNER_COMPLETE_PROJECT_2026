import { Route, Routes } from "react-router-dom";
import { getApps } from "./utils/helper";


function App() {

  const CurrentApp = getApps();

  return <CurrentApp />;

}

export default App;

