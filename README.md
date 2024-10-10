# financeHQ_Take_Home

Initial commit contains the scaffolding for the backend events service.

Frameworks used w/Typescript:
- Express
- Apollo Server
- Jest + Supertest

To run with Docker:

`docker-compose up --build`

Using Postman, use this url once the docker build is complete:

`http://0.0.0.0:4000/graphql`

Next Steps:
1. Include token validation on queries
    - This should skip the createUser mutation
    - I had a validation at the app level, but it prevented user creation
2. Fix the users query (currently error on ID! being required)
3. Add 24 hour cancellation check
4. Add Github Actions yml
5. Add tests
