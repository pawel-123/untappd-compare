# Untappd Compare

[Untappd Compare](https://untappdcompare.com/) is an app that allows you to compare mutual ratings between two users of [Untappd](https://untappd.com/), a craft beer rating app. The ratings are fetched via Untappd API.

After registering as a user and logging in, the app allows you to:
- request and view a comparison
- view all comparisons
- view all of your comparisons
- save comparisons to your account

## Technology

Untappd Compare was my first app built with Node.js & Express. It uses MongoDB as a database and was deployed to AWS EC2 and linked with [](https://untappdcompare.com) the domain.

The app has two parts:
- backend API that returns JSONs
- simple server side rendered front-end

During this project I purposefully tried to stick to low level implementations (i.e. avoiding templating) in order to understand better how things work without some of the abstractions.

Since this was a primarily backend focused project, there is no styling.

## Learnings
- Node.js and Express (i.e. routing, middelware, error handling)
- MongoDB & Mongoose (i.e. setting up DB, defining models, accessing and writing to DB with Mongoose)
- Architecture based on models, controllers, services and utilities/helpers
- Authorization and authentication with bcrypt and JSON Web Tokens with tokens stored in cookies (not ideal)
- Setting up environment variables with dotenv
- Backend API routes returning JSON
- Server side rendered front-end with routes returning HTML files and HTML strings
- Conditionally rendering HTML elements with JS (i.e. Register & Login vs Logout) in the navigation
- Automatically savings all new comparison requests to DB (after request, the route checks if such comparison already exists in DB - if yes, it fetches it from the DB and if not, it fetches it from Untappd API and saves to DB)
- Making requests with VSCode REST Client and Postman
- Deploying to AWS EC2 instance (including DB)
- Connecting the deployed app to a domain

## To Do's
- [ ] Implement refresh tokens