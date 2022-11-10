# Drusti Server 
This is a server of drusti an video social media app which is similar to the YouTube.

#### Functions:
- Video streaming / watch videos
- search video
- recommendation videos
- Video Upload and manage the videos
- Like the video
- User Authentication 
- Creator and user two different user functionality
- increase the video views
- Automatic thumbnail generate
- convert any video to .mp4 while uploading so streaming made easy
- Otp verification to create user account so fake account can be stopped
- Multiple privacy option can be set on video like private video, public video, and share only video



# Start
1) Git clone
2) Run `npm install` command

#### Add Environment Variable
1) create `.env` file in parent folder
2) add following
- PORT=port number for server
- DB_URL= mongodb database url
- DB_URL_Local= for testing on local database 
- SECRET_KEY= add jwt secret key
- HOST_EMAIL=smtp host address for mail
- EMAIL_SMTP_AUTH_USER= smtp user address
- EMAIL_SMTP_AUTH_PASSWORD=smtp password
- EMAIL_SMTP_PORT=smtp port number
- AWS_ACCESS_KEY= aws access key
- AWS_SECRET_KEY= aws secret key
- AWS_REGION= aws region code
- AWS_BUCKET_NAME= aws s3 bucket name

#### Run server
3) Run `npm start` command to run server.

# Languages and Tools
- Nodejs
- ExpressJs
- Aws s3
- Mongodb


# Reference 

- https://auth0.com/blog/node-js-and-express-tutorial-building-and-securing-restful-apis/
- https://www.toptal.com/nodejs/secure-rest-api-in-nodejs
- https://github.com/techreagan/youtube-clone-nodejs-api/blob/master/controllers/videos.js
- https://stackoverflow.com/questions/31529013/nodejs-file-upload-with-progress-bar-using-core-nodejs-and-the-original-node-s
- https://www.freecodecamp.org/news/how-to-authenticate-users-and-implement-cors-in-nodejs-applications/

