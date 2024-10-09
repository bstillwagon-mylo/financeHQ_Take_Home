# Objective:
Your objective for this exercise is to develop a GraphQL API using TypeScript/JavaScript for
event management. This project aims to showcase your ability to handle feature development
similar to what you might encounter at FinanceHQ.
You have 48 hours to complete this assignment. While you can choose to approach the exercise
with varying levels of detail, your primary goal should be to consider all the use cases that would
arise in real-world feature development. Focus on what you would consider production-ready
when deploying an application.
# Scenario:
Develop a backend for event management and registration. This platform should be able to
handle user creation, event management, as well as attendee registration.
# Product Requirements:
1. User Management
  - a. Ability to register, login, and manage basic profile information.
  - b. Users must have the ability to view and cancel their registrations. However,
cancellation must take place at least 24 hours in advance.
  - c. Users have the ability to see past events they’ve registered for.
2. Event Management
- a. Any user can create an event.
- b. Events must have categories.
  - i. By default querying events will return all events, unless filtered by a
category. Returned result should be paginated.
  - ii. BONUS: Implement search functionality by event name.
- c. Events will have maximum allowed attendees.
- d. Events can be private or public.
  - i. Private events require organizer’s approval upon registration.
  - ii. Public events can be searched by every user and do not require
organizer’s approval for registration.
- e. Events can be edited or canceled by organizers.
3. Attendee Management
- a. Event organizers will have the ability to view the list of attendees for every event.

# Technical Requirements:
1. Include a README file with explanation for your approach, any assumptions made and
how you would improve the project given more time.
2. Your GraphQL schema should include types for all tables you decide to create for this
assignment (User, Event, etc.)
3. Your GraphQL schema should include necessary queries and mutations to handle all
product requirements mentioned above.
4. Include basic tests for your API, you may use any testing framework you’re comfortable
with.
5. Your application must use Dockerfile that containerizes the application
- a. Ensure you set up the correct environments, install dependencies, and run the
application.
- b. Include instructions on how to build and run the Docker container.
6. Using your favorite deployment automation tool, include a workable automation script
and steps on how to deploy your application. You may choose CircleCI, Github Actions,
etc.
# Evaluation Criteria:
1. Correctness
2. Code quality
3. Security
4. Documentation
5. Containerization

Prioritize having a workable code over completion of all features. If time permits, add data
validation. You may be as creative as you’d like. Please document any trade-offs you make and
explain your considerations.

The purpose of this task is to be completed in approximately 48 hours. However, please spend
no more than 48 hours on it. If you are unable to complete all requirements within the time limit,
prioritize the most critical features and document what remains unfinished.