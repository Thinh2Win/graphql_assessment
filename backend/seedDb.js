import csv from 'csv-parser'
import dayjs from 'dayjs'
import { parsePhoneNumber, isPossiblePhoneNumber} from 'libphonenumber-js'
import fs from 'fs'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const patients = [];
const appointments = [];

fs.createReadStream('phi.csv')
    .pipe(csv())
    .on('data', async (data) => {
        const patient = {};
        const appointment = {patient_id: data.patient_id};
        for (let info in data) {
            let val = data[info];
            if (!val.length) data[info] = ''
            else if (info === 'dob' || info === 'appointment_date') data[info] = dayjs(val).isValid() ? dayjs(val).format('MM-DD-YYYY') : ''
            else if (info === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) data['email'] = ''
            else if (info === 'phone') {
                const phoneNumber = parsePhoneNumber(val, 'US');
                // just checking if phone number is correct length as valid
                data['phone'] = isPossiblePhoneNumber(val, 'US') ? phoneNumber.number : ''
            }
            // separate patient and appointment info
            if (info.includes('appointment')) {
                if (info === 'appointment_id') appointment['id'] = val
                else appointment[info] = data[info]
            }
            else if (info === 'patient_id') patient['id'] = val
            else patient[info] = data[info]
        }

        patients.push(patient);
        appointments.push(appointment);
    })
    .on('end', async() => {
        for (const patient of patients) {
            if (!patient.id) continue;
            await prisma.patient.upsert({
                where: {id: patient.id},
                update: patient,
                create: patient
            })
        }
        for (const appointment of appointments) {
            if (!appointment.id) continue;
            await prisma.appointment.upsert({
                where: {id: appointment.id},
                update: appointment,
                create: appointment
            })
        }

        console.log('db seeded successfully')
    })