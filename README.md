# repro-fastify
Using fastify-passport with mercurius.

## Install
```bash
yarn install && yarn generate:nexus
```

## Running
```
yarn start
```

## Reproducing

1. First you need to create a JWT token associated to your email for that, run the following:
```bash
curl --location --request POST 'http://localhost:3000/api/v1/auth/' \
--header 'Content-Type: application/json' \
--data-raw '{ "redirect": "/graphiql", "destination": "me@example.com" }'
```
2. Once you create this JWT it will send an email containing a login link (visible in the console logs). Copy that link and open it in your browser.
3. When navigating to that link you'll be redirected to the Graphiql interface. You'll need to run the following query:
```
query {
  currentUser {
    id
  }
}
```
4. To double check your session is actually working you can navigate to http://localhost:3000/api/v1/auth/test .
5. You'll be able to see how the session is working for REST urls but not working for the Graphql route.
