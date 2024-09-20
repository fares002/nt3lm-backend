#firstly you have to install all the packages
npm install

#then u have to creat .env file and add your MONGOURL and JWT_SECRET_KEY
in your .env file:
MONGOURL= your database url
JWT_SECRET_KEY = any random key


after that you can run the project :
npm start


the project will run in port 5000 so make sure that port is free or change it 

API's:
http://localhost:5000/api/v1/users   #GET all users
http://localhost:5000/api/v1/login   #POST
http://localhost:5000/api/v1/register   #POST
http://localhost:5000/api/v1/users/:userId #GET ,DELETE, CREATE , UPDATE
http://localhost:5000/api/v1/courses #GET all courses
http://localhost:5000/api/v1/courses/search #GET search course by id
http://localhost:5000/api/v1/courses/:courseId #GET ,DELETE, CREATE , UPDATE
http://localhost:5000/api/v1/:courseId/addVideosToCourse #POST
http://localhost:5000/api/v1/:userId/enroll/:courseId #POST user enroll in course
http://localhost:5000/api/v1/:userId/enrolled-courses #GET user enrolled course

