import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Appointment {
    id: ID!
    patientId: ID!
    date: String
    type: String
  }

  type Patient {
    id: ID!
    firstName: String
    lastName: String
    name: String
    dob: String
    email: String
    phone: String
    address: String
    appointments: [Appointment!]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    patients: [Patient]
    patient(patientId: ID!): Patient
    appointments(patientId: ID!): [Appointment]
    appointment(appointmentId: ID!): Appointment
  }
`;

const appointments = [
  {
    id: 1,
    patientId: '1',
    date: '01-01-2022',
    type: 'follow up'
  },
  {
    id: 2,
    patientId: '1',
    date: '02-03-2025',
    type: 'check up'
  },
]

const patients = [
  {
    id: '1',
    firstName: 'Jin',
    lastName: 'Lee',
    name: 'Jin Lee',
    dob: '01-02-1994',
    phone: '123456789',
    email: null,
    address: '1234 home street'
  }
]
await prisma.appointment.deleteMany({})
await prisma.patient.deleteMany({})
await prisma.patient.createMany({data: patients})
await prisma.appointment.createMany({data: appointments})
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    patients: async() => await prisma.patient.findMany({}),
    patient: async(parent, {patientId}) => await prisma.patient.findUnique({where: {id: patientId}}),
    appointments: async(parent, {patientId}) => await prisma.appointment.findMany({where: {patientId: patientId}})
  },
  Patient: {
    appointments: async(parent) => await prisma.appointment.findMany({where: {patientId: parent.id}})
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async() => ({
    prisma
  }),
});

console.log(`🚀  Server ready at: ${url}`);