const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const responseCachePlugin = require("apollo-server-plugin-response-cache");

const typeDefs = gql`
  type Organization {
    id: ID!
    name: String
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    currentOrg: Organization
  }

  extend type Query {
    currentOrg: Organization
  }
`;

const ORG = {
  id: "1",
  name: "Awesome Inc.",
};

const resolvers = {
  Organization: {
    __resolveReference: () => ORG,
  },
  User: {
    currentOrg: (user, args, ctx, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60 });
      console.log("Resolving User.currentOrg");
      return ORG;
    },
  },
  Query: {
    currentOrg: (parent, args, ctx, info) => {
      console.log("Resolving currentOrg");
      return ORG;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  introspection: true,
  subscriptions: false,
  plugins: [responseCachePlugin()],
});

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
