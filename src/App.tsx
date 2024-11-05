import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Restaurant from './pages/restaurant';
import Food from './pages/food';
import Profile from './pages/profile';
import './index.css'; 

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restaurant" element={<Restaurant />} />
                    <Route path="/food" element={<Food />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
