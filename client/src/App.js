import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PostDetails from './components/PostDetails/PostDetails';
import Auth from './components/Auth/Auth';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';

const App = () => {
    const user = JSON.parse(localStorage.getItem('profile'));

    return (
        <GoogleOAuthProvider clientId="438884535757-269c9b0p62ibq3j5tqm876t6crducqq3.apps.googleusercontent.com">
            <BrowserRouter>
                <Container maxWidth="xl">
                    <Navbar/>
                    <Routes>
                        <Route path="/" exact element={<Navigate to="/posts"/>}/>
                        <Route path="/posts" exact element={<Home />}/>
                        <Route path="/posts/search" exact element={<Home />}/>
                        <Route path="/posts/:id" element={<PostDetails />}/>
                        <Route path="/auth" exact element={!user ? <Auth /> : <Navigate to="/posts" />}/>
                    </Routes>
                </Container>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
};

export default App;