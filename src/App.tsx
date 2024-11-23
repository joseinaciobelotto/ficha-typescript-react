import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Restaurant from './pages/restaurant';
import Food from './pages/food';
import Profile from './pages/profile';
import Login from './pages/login';
import './index.css'; 

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/restaurant/:id" element={<Restaurant />} />
                    <Route path="/food/:id" element={<Food />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
