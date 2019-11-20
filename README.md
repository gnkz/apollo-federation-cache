# Issue

Cache control hints are ignored when using a federated schema

# Requirements

- node.js
- npm

# Installation

run `npm i` on the root folder.

# Running the services

run `npm run dev` to start the services using `nodemon` or `npm run start` to start the services using `node`

# Reproducing the issue

Once the services are running navigate to `http://localhost:4000/graphql` and send the following query

```graphql
query {
  me {
    id
    username
    currentOrg {
      id
      name
    }
  }
}
```

When this query is sent the logs are going to show something like

```
users: Resolving Query.me
organizations: Resolving User.currentOrg
```

This means that the resolvers are getting executed. Now if you run the same query multiple
times the logs are going to show something like

```
users: Resolving Query.me
organizations: Resolving User.currentOrg
organizations: Resolving User.currentOrg
organizations: Resolving User.currentOrg
organizations: Resolving User.currentOrg
organizations: Resolving User.currentOrg
organizations: Resolving User.currentOrg
organizations: Resolving User.currentOrg
organizations: Resolving User.currentOrg
```

Which means that the `me` query is getting cached but the `me.currentOrg` is not even when `info.cacheControl.setCacheHint({ maxAge: 60 })` is set on the resolver