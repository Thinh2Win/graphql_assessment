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
    patient_id: ID!
    appointment_date: String
    appointment_type: String
  }

  type Patient {
    id: ID!
    first_name: String
    last_name: String
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

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    patients: async() => await prisma.patient.findMany({}),
    patient: async(parent, {patientId}) => await prisma.patient.findUnique({where: {id: patientId}}),
    appointments: async(parent, {patientId}) => await prisma.appointment.findMany({where: {patient_id: patientId}}),
    appointment: async(parent, {appointmentId}) => await prisma.appointment.findUnique({where: {id: appointmentId}}),
  },
  Patient: {
    appointments: async(parent) => await prisma.appointment.findMany({where: {patient_id: parent.id}})
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