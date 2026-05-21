# Mia - Messages in Air

Mia is an interactive web app for digital postcard exchange.  
Users can design personalised postcards in an editor, write a message and send them to another user who gets randomly picked.
Users get informed about new postcards with an email to their inbox.

## Frontend Libraries (React - tsx)

Libraries shipping with the finished frontend part of the product and their usage.

- better-auth
  - authentication, password reset and user management
- konva/react-konva
  - Canvas library for the Postcard Editor
- leaflet/react-leaflet
  - Map library
- react-confetti
  - Confetti to celebrate how great you are!
- react-dom/react-router-dom
  - library to simulate a dom structure and enable spa routing
- use-image
  - Library to load images with react-konva
- uuid
  - Give each image a unique id

## Backend Libraries (Express - js)

Libraries shipping with the finished backend part of the product and their usage.

- prisma
  - Database middleware
- axios
  - Library for sending HTTP requests (used for requests from the API)
- bad-words
  - NSFW detection for the postcard message
- better-auth
  - authentication, password reset and user management
- cors
  - allow cross origin resource sharing (browser allows backend and frontend domains on one page)
- form-data
  - creating a form that simulates a frontend request from the backend
- languagedetect
  - detect the postcard message language
- multer
  - middleware for file uploads: used for handling the image during image NSFW-content detection
- resend
  - mail exchange API integration

# How to run the App Locally

To run the App locally do the following:

1. Use npm install on the frontend and backend to install all dependencies
2. Create the following .env files:   
- **/backend/.env**

```
DATABASE_URL="postgresql://xxxxxxxxx:xxxxxxxx@xxxxxxxx:xxxx/xx"
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
TEST=true
RESEND_API_KEY=re_xxx
SIGHTENGINE_API_USER=xxx
SIGHTENGINE_API_SECRET=xxx
NODE_ENV=dev
```

- **/frontend/.env**

```
VITE_API_URL=http://localhost:3001
```

3.  Create API key on: - resend.com [https://resend.com] - sightengine.com [https://sightengine.com]  
    Write keys and usernames into the .env file.
4.  Create a betterAuth secret with openssl rand -base64 32 on the commandline and fill it into the .env file
5.  Write the correct port numbers (:xxxx) on localhost instead of the provided ones  
    (BETTER_AUTH_URL = backend; FRONTEND_URL = frontend)
6.  Write the frontend port in the backend .env file
7.  Make sure a database (postgres,...) is running on your machine and write your credentials in the .env file like this:
    "postgresql://[xxx]:[user]@[url]:[port]/[db-name]"
8.  Run npx prisma migrate dev while being in the backend folder
9. Run npm run dev in both: the front- and backend folder to run the project.  
    **NOTE**: The TEST variable sets the behaviour with APIs. While on true the requests are only mocked. You might see test requests but none that would change your credits.  
    You should let NODE_ENV stay set to dev while developing locally.  
    Now you are all set. Have fun writing postcards to yourself

# How to run the App on a Server

To run the App on a Dokploy server/Docker do the following:

1. Create an app and set the frontend/backend App to read the frontend/backend folder
2. Create a database and copy the internal url
3. Fill in the environment tab/.env file with the following:   
- **Backend**

```
DATABASE_URL="postgresql://xxxxxxxxx:xxxxxxxx@xxxxxxxx:xxxx/xx"
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=https://api.mia.jlaoemir.at
FRONTEND_URL=https://mia.jlaoemir.at
TEST=false
RESEND_API_KEY=re_xxx
SIGHTENGINE_API_USER=xxx
SIGHTENGINE_API_SECRET=xxx
NODE_ENV=production
```
- **Frontend**   
**IMPORTANT**: Write this in the variables available during the build process as they are baked into the finished build and not loaded during runtime.

```
VITE_API_URL=https://api.mia.jlaoemir.at
```

**NOTE**: You can just copy your local variables and replace the database and URLs.  
4. Start the App    
5. Go to the backend console and seed the database with (will be filled in later)
