import * as React from 'react';
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Paper from '@mui/material/Paper';

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    dob: string;
    email: string;
    appointments: number[];
}

interface GetPatientsData {
    patients: Patient[];
}

const GET_PATIENTS = gql`
  query GetPatients {
    patients {
      id
      first_name
      last_name
      dob
      email
      appointments {
        id
      }
    }
  }
`

export default function PatientsTable() {
    const { loading, error, data } = useQuery<GetPatientsData>(GET_PATIENTS);
    const navigate = useNavigate();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
    const rows = data?.patients || [];

    return (
    <TableContainer component={Paper}>
        <Typography variant="h4" gutterBottom>Patients Table</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell align="right">DOB</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Appointments</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        onClick={() => navigate(`/patients/${row.id}`)}
                    >
                        <TableCell component="th" scope="row">
                        {`${row.first_name} ${row.last_name}`}
                        </TableCell>
                        <TableCell align="right">{row.dob}</TableCell>
                        <TableCell align="right">{row.email}</TableCell>
                        <TableCell align="right">{row.appointments.length}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
  );
}
