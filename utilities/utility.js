const multer = require("multer");
var excel = require('excel4node');
var path = require('path');
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  }
});

exports.upload = multer({ //multer settings
  storage: storage,
  limits: { fileSize: 5000000 }
});

exports.validate = function (req, res, next) {
  const inputFile = req.file;
  let errorMessage = ""
  if (!req.file) {
    errorMessage = 'file cant be empty';
    
  } 
  else if (path.extname(inputFile.filename) !== "xlsx") {
    errorMessage = "Please upload only .xlsx";
  }
  if (errorMessage) {
    return res.send({
      errors: {
        message: errorMessage
      }
    });
  }
  next();
}


exports.createSheet = (candidatesData, res) => {
  var workbook = new excel.Workbook();

  // Add Worksheets to the workbook
  var worksheet = workbook.addWorksheet('MySheet');
  //write header names
  const headerNames = ["name of the candidate", "postal address", "mobile no", "Date of birth", "Email", "Work Experience", "Resume Title", "Current Location", "Preferred Location", "Current Employer", "Current Designation", "Annual Salary", "Education"];
  const columnNames = ["name_of_the_candidate", "postal_address", "mobile_number", "date_of_birth", "email", "work_experience", "resume_title", "current_location", "preffered_location", "current_employer", "current_designation", "annual_salary", "education"]
  headerNames.forEach((headerName, index) => {
    worksheet.cell(1, index + 1).string(headerName);
  })

  //Write data
  candidatesData.forEach((candidateData, i) => {
    //console.log(candidateData[columnNames[3]], typeof candidateData[columnNames[3]])
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

  workbook.write('Excel.xlsx', () => {
    res.download('./Excel.xlsx')
  });
}