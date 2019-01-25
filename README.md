# treehouse_unit_9_project

Features :
1. Getting a user infos (only for the authenticated user)
2. Adding new users to the database {"firstName", "lastName", "emailAddress" and "password" are required}
3. Getting all the courses and the users who created them
4. Getting one specific course and the user who created it
5. Adding new courses to the database ("title" and "description" are required, "estimatedTime" and "materialsNeeded" are optionnal, "user" is automatically added as the authenticated user ) (only for an authenticated user)
6. Updating courses (only for an authenticated user and only if he is the "user" of the course)
7. Deleting courses (only for an authenticated user and only if he is the "user" of the course)

Use Postman to test the routes.
You can try to add this users:
{
  "firstName": "Myriam",
  "lastName": "Peanuts",
  "emailAddress": "myriam@gmail.com",
  "password": "thing"
}

{
  "firstName": "Julien",
  "lastName": "Ju",
  "emailAddress": "julien@gmail.com",
  "password": "thing"
}


You can try to add this courses, then update and delete them:
{
  "title": "Linguistics",
  "description": "Linguistics for dummies",
  "estimatedTime": "96 hours",
  "materialsNeeded": "Brain"
}

{
  "title": "Linguistics",
  "description": "Linguistics for dummies, but less dummies",
  "estimatedTime": "32 hours",
  "materialsNeeded": "Brain"
}

{
  "title": "French Grammar",
  "description": "The exhaustive French Grammar",
  "estimatedTime": "200 hours",
  "materialsNeeded": "Dr French app"
}



# Full Stack JavaScript Techdegree v2 - REST API Project

## Overview of the Provided Project Files

We've supplied the following files for you to use:

* The `seed` folder contains a starting set of data for your database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create your app's database and populate it with data (we'll explain how to do that below).
* We've included a `.gitignore` file to ensure that the `node_modules` folder doesn't get pushed to your GitHub repo.
* The `app.js` file configures Express to serve a simple REST API. We've also configured the `morgan` npm package to log HTTP requests/responses to the console. You'll update this file with the routes for the API. You'll update this file with the routes for the API.
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run your REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore your REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, ensure that you have MongoDB installed globally on your system.

* Open a `Command Prompt` (on Windows) or `Terminal` (on Mac OS X) instance and run the command `mongod` (or `sudo mongod`) to start the MongoDB daemon.
* If that command failed then you’ll need to install MongoDB.
* [How to Install MongoDB on Windows](http://treehouse.github.io/installation-guides/windows/mongo-windows.html)
* [How to Install MongoDB on a Mac](http://treehouse.github.io/installation-guides/mac/mongo-mac.html)

Third, seed your MongoDB database with data.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
