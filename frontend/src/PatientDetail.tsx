import * as React from 'react';
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


interface Appointment {
    id: string;
    patient_id: string;
    appointment_date: string;
    appointment_type: string;
}

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
    appointments: Appointment[];
}

interface GetPatientData {
    patient: Patient;
}

const GET_PATIENT = gql`
  query GetPatient($patientId: ID!) {
    patient(patientId: $patientId) {
        id
        first_name
        last_name
        dob
        email
        phone
        address
        appointments {
        id
        patient_id
        appointment_date
        appointment_type
        }
    }
  }
`

export default function PatientDetail() {
    const { id } = useParams();
    const {loading, error, data} = useQuery<GetPatientData>(GET_PATIENT, {variables: {patientId: id}})

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;
    
    const patient = data?.patient;
    if (!patient) return null;

    const patientFields = [
        ['Name', `${patient.first_name} ${patient.last_name}`],
        ['Date of Birth', patient.dob],
        ['Email', patient.email],
        ['Phone', patient.phone],
        ['Address', patient.address]
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>Patient Details</Typography>
            
            <TableContainer style={{ marginBottom: '2rem' }}>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Table>
                    <TableBody>
                        {patientFields.map(([label, value]) => (
                            <TableRow key={label}>
                                <TableCell><strong>{label}</strong></TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer>
                <Typography variant="h6" gutterBottom>Appointments</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patient.appointments?.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.appointment_date}</TableCell>
                                <TableCell>{appointment.appointment_type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}