import { Routes, Route} from 'react-router-dom';
import './App.css';
import PatientsTable from './PatientsTable';
import PatientDetail from './PatientDetail';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<PatientsTable/>}/>
        <Route path='/patients/:id' element={<PatientDetail/>}/>
      </Routes>
    </>
  )
}

export default App
