import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import PianoHome from "./components/PianoHome.tsx";
import Home from "./components/Home.tsx";
import Piano1 from "./components/Piano.tsx";
import About from "./components/About.tsx";
import Project1 from "./components/Project1.tsx";
import Project2 from "./components/Project2.tsx";
import { AnimatePresence } from "framer-motion";

function App() {
    return (
        <>
            <AnimatePresence mode= "wait">
                <Router>
                    <Routes>
                        <Route index element={<PianoHome/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path = "/piano" element = {<Piano1 />}/>
                        <Route path = "/about" element = {<About />}/>
                        <Route path = "/project1" element = {<Project1/>}/>
                        <Route path = "/project2" element = {<Project2/>}/>
                        <Route path="*" element={<Navigate to="/" />}/>
                    </Routes>
                </Router>
            </AnimatePresence>
        </>
    );
}

export default App;