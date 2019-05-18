const express = require('express')
const app = express()
const candidatesDummy = require('./candidates')
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
app.get('/upload', (req, res) => {
    res.send('Will Upload')
})
//PORT 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
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