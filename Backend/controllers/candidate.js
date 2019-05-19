const XLSX = require('xlsx');
Candidate = require('../models/candidate')
var mongoose = require('mongoose')
var each = require('async-each-series');
// connect to mongoose
mongoose.connect('mongodb://localhost/candidatedb');
const utilityFunctions = require('../utilities/utility')
var db = mongoose.connection;
  
  // upload api function
  exports.candidates_upload =(req, res) => {
      console.log('upload')
    const fileLocation = req.file.path;
    var workbook = XLSX.readFile(fileLocation);
    var sheet_name_list = workbook.SheetNames;
    let jsonFormat = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
      raw: false
    });
    if(jsonFormat.length > 1000){
      jsonFormat = jsonFormat.slice(0, 1000)
    }
    each(jsonFormat, function (candidateItem, next) {
      setTimeout(function () {
        try {
          console.log('email processing', candidateItem['Email'])
          const name_of_the_candidate = candidateItem['Name of the Candidate'],
            postal_address = candidateItem['Postal Address'],
            mobile_number = candidateItem['Mobile No.'],
            date_of_birth = candidateItem['Date of Birth'],
            email = candidateItem['Email'],
            work_experience = candidateItem['Work Experience'],
            resume_title = candidateItem['Resume Title'],
            current_location = candidateItem['Current Location'],
            preffered_location = candidateItem['Preferred Location'],
            current_employer = candidateItem['Current Employer'],
            current_designation = candidateItem['Current Designation'],
            annual_salary = candidateItem['Annual Salary'],
            education = candidateItem['Education']
          if (name_of_the_candidate && email) {
            Candidate.find({
              email: email
            }, (err, candidateWithEmail) => {
              if (candidateWithEmail.length == 0) {
                const newCandidate = new Candidate({
                  name_of_the_candidate: name_of_the_candidate,
                  postal_address,
                  postal_address,
                  mobile_number: mobile_number,
                  date_of_birth: date_of_birth,
                  email: email,
                  work_experience: work_experience,
                  resume_title: resume_title,
                  current_location: current_location,
                  preffered_location: preffered_location,
                  current_employer: current_employer,
                  current_designation: current_designation,
                  annual_salary: annual_salary,
                  education: education && education.split(',')
                })
                newCandidate.save().then(result => {
                  console.log('inserted email', result.email)
                  console.log()
                  console.log()
                })
              } else {
                console.log(`${email} already exist`)
                console.log()
                console.log()
              }
            })
          } else {
            console.log('email or name is missing.')
          }
        } catch (exc) {
          console.log('handlinge exception', exc)
        }
        next();
      }, Math.random() * 5000);
    }, function (err) {
      console.log('finished');
    });
  
    res.send('Processed')
  }


  //download api
  exports.candidates_download = (req, res) => {
    Candidate.getCandidates((err, candidates) => {
      if (err) {
        throw err
      }
      utilityFunctions.createSheet(candidates, res);
    });
  }