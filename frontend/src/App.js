import "./App.css";
import { DisplayData } from "./Components/DisplayData";
import { RegistrationForm } from "./Components/RegistrationForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThankYou from "./Components/ThankYou";
import Login from "./Components/Login";
import PrivateComponent from "./Components/Privatecomponent";
import Sidebar from "./Components/Sidebar";
import { AddAgent } from "./Components/AddAgent";
import Profile from "./Components/Profile";
import { DisplayAgent } from "./Components/DisplayAgent";
import { UploadExel } from "./Components/UploadExel";
import Footer from "./Components/Footer";
import Report from "./Components/Report";
import { UpdateAgent } from "./Components/UpdateAgent";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/data" element={<DisplayData />}></Route>
            <Route path="/agent-data" element={<DisplayAgent />}></Route>
            <Route path="/add-agent" element={<AddAgent />}></Route>
            <Route path="/update/:agentId" element={<UpdateAgent />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/bulk-upload" element={<UploadExel />}></Route>
            <Route path="/reports" element={<Report />}></Route>
          </Route>
          <Route path="/" element={<RegistrationForm />}></Route>
          <Route path="/thankyou" element={<ThankYou />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
