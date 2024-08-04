# Drusti Server 
This is a server of drusti an video social media app which is similar to the YouTube.

## Functions:
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

## ScreenShots
<img src="https://github.com/user-attachments/assets/8211d276-8532-48bd-8828-4b346db86aac" height="300" alt="Screenshot 1">
<img src="https://github.com/user-attachments/assets/e58a8341-1c5e-4e68-b875-aee2b3b62c5d" height="300" alt="Screenshot 2">
<img src="https://github.com/user-attachments/assets/59eab2ab-a978-46b5-a22c-08a78dec3ce4" height="300" alt="Screenshot 3">
<img src="https://github.com/user-attachments/assets/0c0f8eb9-b408-46fb-b1ba-02c53d1afa2f" height="300" alt="Screenshot 4">
<img src="https://github.com/user-attachments/assets/ca385054-bf69-4893-ba94-159b1297c38f" height="300" alt="Screenshot 5">
<img src="https://github.com/user-attachments/assets/296417e8-e54e-473b-bf0a-25f7879c5b59" height="300" alt="Screenshot 6">
<img src="https://github.com/user-attachments/assets/580635bc-7331-40d1-963b-9d869ed3ad4a" height="300" alt="Screenshot 7">
<img src="https://github.com/user-attachments/assets/cb30627e-1fd5-4d8f-ab89-1490e42dc89b" height="300" alt="Screenshot 8">
<img src="https://github.com/user-attachments/assets/68092e0e-a1f1-49e1-8f52-9d06a51dadf7" height="300" alt="Screenshot 9">
<img src="https://github.com/user-attachments/assets/6ab2fb25-d79a-4408-b56f-5a097328e601" height="300" alt="Screenshot 10">
<img src="https://github.com/user-attachments/assets/14167f28-e566-42af-ab94-72fcba418a6e" height="300" alt="Screenshot 11">
<img src="https://github.com/user-attachments/assets/1b8959a6-deeb-48a0-9978-e278a4a795da" height="300" alt="Screenshot 12">
<img src="https://github.com/user-attachments/assets/b8c0757f-6fca-4abb-b790-b10f721272c9" height="300" alt="Screenshot 13">
<img src="https://github.com/user-attachments/assets/2d6880b4-d202-4c07-8728-e989f1091f18" height="300" alt="Screenshot 14">



## Frontend (Android)
[Drustii App](https://github.com/codewithdinesh/drusti-app/)

# Start
1) Git clone
2) Run `npm install` command

#### Add Environment Variable
1) create `.env` file in parent folder
2) add following
```PORT=port number for server
DB_URL= mongodb database url
DB_URL_Local= for testing on local database 
SECRET_KEY= add jwt secret key
HOST_EMAIL=smtp host address for mail
EMAIL_SMTP_AUTH_USER= smtp user address
EMAIL_SMTP_AUTH_PASSWORD=smtp password
EMAIL_SMTP_PORT=smtp port number
AWS_ACCESS_KEY= aws access key
AWS_SECRET_KEY= aws secret key
AWS_REGION= aws region code
AWS_BUCKET_NAME= aws s3 bucket name
```

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

