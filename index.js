const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const functions = require('./controllers/functions')

const views = path.join(__dirname,'./views');
const partials = path.join(__dirname,'./partials');

app.use(express.static(views));
app.use(bodyParser.urlencoded({extended: false}));
hbs.registerPartials(partials);

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
   res.render('index',{});
});

app.get('/coordinator', (req, res) => {
   res.render('coordinator',{});
});

app.get('/interested', (req, res) => {
   const courses = functions.getCourses();
   res.render('interested',{
      courses
   });
});

app.get('/candidate', (req, res) => {
   const courses = functions.getCourses();
   res.render('candidate',{
      courses
   });
});

app.get('/courseList', (req, res) => {
   const courses = functions.getCourses();
   res.render('courseList',{
      courses
   });
});

app.get('/subscribe/:courseID', (req, res) => {
   const course = functions.getCourse(req.params.courseID);
   res.render('subscribeCourse',{
      course
   });
});

app.get('/course/:id', (req, res) => {
   const course = functions.getCourse(req.params.id);
   res.render('courseDetail',{
      course
   });
});

app.get('/studentsByCourse/:id', (req, res) => {
   const students = functions.getStudentsByCourse(req.params.id);
   res.render('studentsByCourse',{
      students,
      courseID: req.params.id
   });
});

app.get('/deleteStudent/:id', (req, res) => {
   functions.deleteStudent(req.params.studentID,req.params.courseID);
   const courses = functions.getCourses();
   res.render('courseList',{
      courses
   });
});

app.post('/course', (req, res) => {
   try {
      functions.storeCourse(req.body);
      res.render('coordinator',{});
   } catch (err) {
      res.render('error',{
         error: err
      })
   }
})

app.post('/student', (req, res) => {
   try {
      functions.storeStudent(req.body);
      res.render('studentSubscribed',{
         course: req.body.courseID
      });
   } catch (err) {
      res.render('error',{
         error: err
      })
   }
})

app.listen(3000,() => {
   console.log('Listening on port 3000');
});