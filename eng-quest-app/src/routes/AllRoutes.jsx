import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Signup from '../components/Signup'
import Login from '../components/Login'
import Homepage from '../components/Homepage'
import PrivateRoute from './PrivateRoute'

const AllRoutes = () => {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={
                <PrivateRoute>
                    <Homepage />
                </PrivateRoute>
            } />
        </Routes>
    )
}

export default AllRoutes