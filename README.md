# SENDGRID API

SENDGRID INTEGRATION WITH NODEJS

## HOW TO RUN THE PROJECT

### INSTALL DEPENDENCIES

Install dependencies

`$ npm install`

Install development dependencies

`$ npm install -D`

### CREATE .ENV FILE

Create a .env file in functions/ directory

📦project  
┣ 📂src  
┃ ┗ 📜index.ts  
┣ 📜<b>.env</b>  
┗ 📜nodemon.json  
┗ 📜package.json  

Open the .env file for edit, and add the desired keys. Take as an example the .env.example file

> APP_SENDGRID_PORT=3000  
> APP_SENDGRID_DOMAIN=app.domain.com  
> APP_SENDGRID_API_KEY=apiKeyFromSendgrid  

### RUN PROJECT

For the development environment

`$ npm run dev`

For the production environment

`$ npm run build`

`$ npm start`

By default project run in:

> http://localhost:3000

Make sure that port 3000 or port defined in .env file, is not used.