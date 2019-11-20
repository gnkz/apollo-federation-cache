const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const responseCachePlugin = require("apollo-server-plugin-response-cache");

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    username: String
  }

  extend type Query {
    me: User
  }
`;

const USER = {
  id: "1",
  username: "gnkz",
};

const resolvers = {
  User: {
    __resolveReference: () => USER,
  },
  Query: {
    me: (parent, args, ctx, info) => {
      info.cacheControl.setCacheHint({ maxAge: 60 });
      console.log("Resolving Query.me");
      return USER;
    },
  },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  introspection: true,
  subscriptions: false,
  plugins: [responseCachePlugin()],
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
