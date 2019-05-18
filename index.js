const express = require('express')
const app = express()
const XLSX = require('xlsx');
const multer = require("multer");
var excel = require('excel4node');
Candidate = require('./models/candidate')
var mongoose = require('mongoose')
// connect to mongoose
mongoose.connect('mongodb://localhost/candidatedb');
var db = mongoose.connection;

app.get('/download', (req, res) => {
    Candidate.getCandidates((err, candidates) => {
        if (err) {
            throw err
        }
        const generatedFile = createSheet(candidates);
        console.log('written and will be send')
        res.download(generatedFile)
    });
});



const createSheet = (candidatesData) => {
    var workbook = new excel.Workbook();

    // Add Worksheets to the workbook
    var worksheet = workbook.addWorksheet('MySheet');
    //write header names
    const headerNames = ["name of the candidate", "postal address", "mobile no", "Date of birth", "Email", "Work", "Resume Title", "Current Location", "Preferred Location", "Current Employer", "Current Designation", "Annual Salary", "Education"];
    const columnNames = ["name_of_the_candidate", "postal_address", "mobile_number", "date_of_birth", "email", "work", "resume_title", "current_location", "preffered_location", "current_employer", "current_designation", "annual_salary", "education"]
    headerNames.forEach((headerName, index) => {
        worksheet.cell(1, index + 1).string(headerName);
    })

    //Write data
    candidatesData.forEach((candidateData, i) => {
        worksheet.cell(i + 2, 1).string(candidateData[columnNames[0]])
        worksheet.cell(i + 2, 2).string(candidateData[columnNames[1]])
        worksheet.cell(i + 2, 3).number(candidateData[columnNames[2]])
        worksheet.cell(i + 2, 4).string(candidateData[columnNames[3]])
        worksheet.cell(i + 2, 5).string(candidateData[columnNames[4]])
        worksheet.cell(i + 2, 6).string(candidateData[columnNames[5]])
        worksheet.cell(i + 2, 7).string(candidateData[columnNames[6]])
        worksheet.cell(i + 2, 8).string(candidateData[columnNames[7]])
        worksheet.cell(i + 2, 9).string(candidateData[columnNames[8]])
        worksheet.cell(i + 2, 10).string(candidateData[columnNames[9]])
        worksheet.cell(i + 2, 11).string(candidateData[columnNames[10]])
        worksheet.cell(i + 2, 12).string(candidateData[columnNames[11]])
        worksheet.cell(i + 2, 13).string(candidateData[columnNames[12]])

    })

    const filePath = workbook.write('Excel.xlsx', () => {
        console.log('written on disk');
        return './Excel.xlsx'
    });
    console.log('written with name', filePath)
    return './Excel.xlsx';
}



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
  });
  var upload = multer({ //multer settings
    storage: storage
  });
  
  function validate(req, res, next) {
    if (!req.file) {
      return res.send({
        errors: {
          message: 'file cant be empty'
        }
      });
    }
    next();
  }
  
app.post('/upload', upload.single('file'), validate, (req, res) => {
    // res.send('Will Upload')
    const fileLocation = req.file.path;
    // console.log(fileLocation); // logs uploads/file-1541675389394.xls
  var workbook = XLSX.readFile(fileLocation);
  var sheet_name_list = workbook.SheetNames;
  const jsonFormat = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
//   res.send(jsonFormat)
  jsonFormat.forEach((candidateItem) => {
      try{
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
        if(name_of_the_candidate && email){
            Candidate.find({email: email}, (err, candidateWithEmail) => {
                if (candidateWithEmail.length == 0){
                    console.log(`${email} will be inserted`)
                    const newCandidate = new Candidate({
                        name_of_the_candidate: name_of_the_candidate,
                        postal_address, postal_address,
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
                        education: education
                    })
                    newCandidate.save()
                }
                else{
                    console.log(`${email} already exist`)
                }
            })
        }
      }
      catch(exc){
          console.log('handlinge exception', exc)
      }
  })
  res.send('Processed')
});


  //PORT 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});