import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import PianoHome from "./components/PianoHome.tsx";
import Home from "./components/Home.tsx";
import Piano from "./components/Piano.tsx";
import { AnimatePresence } from "framer-motion";

function App() {
    return (
        <>
            <AnimatePresence mode= "wait">
                <Router>
                    <Routes>
                        <Route index element={<PianoHome/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path = "/piano" element = {<Piano />}/>
                        <Route path="*" element={<Navigate to="/" />}/>
                    </Routes>
                </Router>
            </AnimatePresence>
        </>
    );
}

export default App;