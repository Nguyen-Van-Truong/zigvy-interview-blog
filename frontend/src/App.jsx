// E:\zigvy\zigvy-interview-blog\frontend\src\App.jsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from "./pages/Login.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Router>
    );
};

export default App;
