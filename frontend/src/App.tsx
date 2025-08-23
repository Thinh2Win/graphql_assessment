import { useState } from 'react';
import { Routes, Route} from 'react-router-dom';
import './App.css';
import PatientsTable from './PatientsTable';
import PatientDetail from './PatientDetail';



function App() {

  return (
    <>
      <h1>Hi</h1>
      <Routes>
        <Route path='/' element={<PatientsTable/>}/>
        <Route path='/patients/:id' element={<PatientDetail/>}/>
      </Routes>
    </>
  )
}

export default App
