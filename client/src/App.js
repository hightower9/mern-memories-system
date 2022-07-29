import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Auth from './components/Auth/Auth';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';

const App = () => (
    <GoogleOAuthProvider clientId="438884535757-269c9b0p62ibq3j5tqm876t6crducqq3.apps.googleusercontent.com">
        <BrowserRouter>
            <Container maxWidth="lg">
                <Navbar/>
                <Routes>
                    <Route path="/" exact element={<Home />}/>
                    <Route path="/auth" exact element={<Auth />}/>
                </Routes>
            </Container>
        </BrowserRouter>
    </GoogleOAuthProvider>
);

export default App;