const fs = require('fs');
const path = require('path');

const courseFile = path.join(__dirname,'../data','courses.json');
const studentFile = path.join(__dirname,'../data','students.json');

let courses = [];
let students = [];
let courseStudents = [];

function storeCourse(course_) {
   readCourseFile();
   let courseFound = courses.find(course => course.courseID === course_.courseID)
   if(!courseFound) {
      course_['active'] = true;
      courses.push(course_);
      storeCourseData();
   } else {
      throw `Ya existe un curso con id ${course_.courseID}`;
   }
}

function readCourseFile() {
   try {
      courses = require(courseFile);
   } catch(e) {
      courses = [];
   }
}

function readStudentFile() {
   try {
      students = require(studentFile);
   } catch(e) {
      students = [];
   }
}

const storeCourseData = function () {
   let data = JSON.stringify(courses);

   fs.writeFile(courseFile, data, (err) => {
      if (err) {
         console.log('Error writing');
      }
   })
}

const storeStudentData = function () {
   let data = JSON.stringify(students);

   fs.writeFile(studentFile, data, (err) => {
      if (err) {
         console.log('Error writing');
      }
   })
}

function getCourses() {
   readCourseFile();
   return courses;
}

function getCourse(id) {
   readCourseFile();
   const course = courses.find(course => course.courseID == id);
   return course;
}

function storeStudent(student_) {
   let studentToSave = {
      studentID: student_.studentID,
      studentName: student_.studentName,
      studentEmail: student_.studentEmail,
      studentPhone: student_.studentPhone,
      studentCourses: [student_.courseID]
   }
   readStudentFile();
   let studentFound = students.find(student => student.studentID === student_.studentID)
   if(!studentFound) {
      students.push(studentToSave);
   } else {
      const courseFound = studentFound.studentCourses.find(course => course === student_.courseID);

      if(courseFound) {
         throw `El estudiante ${studentFound.studentID} ya está pre inscrito en el curso ${student_.courseID}`;
      } else {
         studentFound.studentCourses.push(student_.courseID);
      }
   }
   storeStudentData();
}

module.exports = {
   storeCourse,
   getCourses,
   getCourse,
   storeStudent
}