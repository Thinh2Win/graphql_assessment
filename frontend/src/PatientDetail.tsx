import * as React from 'react';
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useParams } from "react-router-dom";


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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
    const patient: Patient = data?.patient || {}
    const appointments: Appointment[] = patient.appointments || []

    return (
        <>
       
    </>
    )
}