var mongoose = require('mongoose')

// candidate schema
var candidateSchema = mongoose.Schema({
    name_of_the_candidate: {
        type: String,
        required: true
    },
    postal_address: {
        type: String,
    },
    mobile_number: {
        type: Number
    },
    date_of_birth: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    work: {
        type: String
    },
    resume_title: {
        type: String
    },
    current_location: {
        type: String
    },
    preffered_location: {
        type: String
    },
    current_employer: {
        type: String
    },
    current_designation: {
        type: String
    },
    annual_salary: {
        type: String
    },
    education: {
        type: String
    }
})

var Candidate = module.exports = mongoose.model('Candidate', candidateSchema)

//get candidates
module.exports.getCandidates = (callback, limit) => {
    Candidate.find(callback).limit(limit)
}