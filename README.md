# Take Home Event Service w/ Graphql

Frameworks used w/Typescript:
- Express
- Apollo Server
- Jest + Supertest

To run with Docker:

`docker-compose up --build`

Using Postman, use this url once the docker build is complete to query the graph:

`http://0.0.0.0:4000/graphql`

Next Steps:
1. Include token validation on queries
    - This should not include the createUser mutation as it would not have a login.
    - I had a validation at the app level, but it prevented user creation
2. Add tests
3. Add 24 hour cancellation check
4. Add Approval and Public/Private events
5. Add Upcoming vs Past events
5. Add Github Actions yml
