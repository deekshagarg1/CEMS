import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import About from "./pages/About.jsx";
import Certificate from "./pages/student/Certificate";
import Contact from "./pages/Contact.jsx";
import AdminManageEvents   from "./pages/admin/AdminManageEvents.jsx";
import AdminManageStudents from "./pages/admin/AdminManageStudents.jsx";
import AdminManageFaculty  from "./pages/admin/AdminManageFaculty.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Profile from "./pages/Profile.jsx";
import EventDetail        from "./pages/EventDetail.jsx";
import CreateEvent        from "./pages/faculty/CreateEvent.jsx";
import RegisteredEvents   from "./pages/student/RegisteredEvents.jsx";
// import EventRegistrations from "./pages/admin/EventRegistrations";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Events from "./pages/Events.jsx";
import Registrations from "./pages/admin/Registrations.jsx";
import MyEvents  from "./pages/faculty/MyEvents.jsx";
import MyCertificates from "./pages/student/MyCertificates";


function App() {

return (

<Router>

<Navbar/>

<Routes>

<Route path="/certificate/:id" element={<Certificate />} />
<Route path="/" element={<Home/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/sign" element={<Signup/>}/>
<Route path="/about" element={<About />} />
<Route path="/events" element={<Events />} />
<Route path="/student/certificates" element={<MyCertificates />} />
<Route path="/contact" element={<Contact />} />
<Route path="/events/:id"                element={<EventDetail />} />
<Route path="/faculty/create-event"      element={<CreateEvent />} />
<Route path="/student/registered"        element={<RegisteredEvents />} />
<Route path="/admin/registrations"       element={<Registrations />} />

<Route path="/faculty/my-events"       element={<MyEvents />} />

<Route path="/profile" element={<Profile />} />


<Route path="/admin/manage-events"   element={<AdminManageEvents />} />
<Route path="/admin/manage-students" element={<AdminManageStudents />} />
<Route path="/admin/manage-faculty"  element={<AdminManageFaculty />} />
</Routes>


<Footer/>

</Router>

);

}

export default App;