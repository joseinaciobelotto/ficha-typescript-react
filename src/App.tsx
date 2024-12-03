import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RPGLandingPage from './pages/home';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import './index.css'; 

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/home" element={<RPGLandingPage />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
