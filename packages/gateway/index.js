const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

(async () => {
  const gateway = new ApolloGateway({
    serviceList: [
      { name: "users", url: "http://localhost:4001/graphql" },
      { name: "organizations", url: "http://localhost:4002/graphql" },
    ],
  });

  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    schema,
    executor,
    subscriptions: false,
    introspection: true,
  });

  const { url } = await server.listen(4000);

  console.log(`🚀 Server ready at ${url}`);
})().catch(console.error);
