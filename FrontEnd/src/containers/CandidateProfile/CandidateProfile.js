import React, { Component } from 'react';
import './style.scss'
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import Chip from '@material-ui/core/Chip';
import FileDownload from 'js-file-download';
const apiPath = "http://localhost:3000/candidate/";

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
      width: '200px'
    },
    input: {
      display: 'none',
    },
    helperText: {
        margin: theme.spacing.unit,
    },
  });

  
class CandidateProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedFile: null,
            upload_error: '',
            success_message: false
        }
    }

    fileSelectedHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            success_message: false,
            upload_error:""
        })
    }

    fileUploadHandler = async() => {
        const fd = new FormData();
        fd.append('file', this.state.selectedFile)
        const RecievingResponse = await axios.post(apiPath + 'upload', fd)
        const responseData = RecievingResponse.data
        console.log(responseData)
        if(responseData.status){
            this.setState({
                upload_error : "",
                success_message: true,
                selectedFile: null
            })
        }
        else{
            this.setState({
                success_message: false,
                upload_error: responseData.message,
                selectedFile: null
            })
        }
    }

    downloadStudentRecords = async() => {
        const sendingObject = {
            responseType: 'blob',
            url: apiPath + 'download',
            method: 'GET',
        }

        const responseData = await axios(sendingObject)
        try{
            FileDownload(responseData.data, 'CandidatesProfile.xlsx');
        }
        catch(exc){
            console.log(exc)
        }
        console.log('respnse', responseData)
    }
    render() {
        const { classes } = this.props;
        const {upload_error, success_message, selectedFile} = this.state;
        return (
            <div className="candidate-profile">
                <Button 
                    variant="contained" 
                    color="primary" 
                    className={classes.button}
                    onClick={this.downloadStudentRecords}
                    >
                    Download
                </Button>
                <div className="upload-section">
                    <input
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel/*"
                        className={classes.input}
                        id="contained-button-file"
                        type="file"
                        onChange={this.fileSelectedHandler}
                        ref = {fileInput =>  this.fileInput = fileInput}
                    />
                    <Button 
                        variant="contained"
                        component="span" 
                        className={classes.button}
                        onClick={() => this.fileInput.click()}
                        >
                        Select
                    </Button>
                    <Button 
                        variant="contained"
                        color="primary"  
                        className={classes.button}
                        onClick={this.fileUploadHandler}
                        >
                        Upload
                </Button>
                </div>
                {
                    selectedFile ?  <Chip label={selectedFile.name} className={classes.button1} /> : null
                }
                {
                    upload_error ? <FormHelperText className={classes.helperText} error={upload_error}>{upload_error}</FormHelperText>: null
                }
                {
                    success_message ? <div className="success-block">
                        <p>Thank You</p>
                        <p>File Upload Successfully</p>
                        <p>Your records will be processed shortly</p>
                    </div> : null
                }
                <div className="instructions">
                    <p>Note: </p>
                    <p>- We support upto 1000 records in a file</p>
                    <p>- Maximum support file size is 5MB</p>
                    <p>- Name and Email are mandatory</p>
                </div>
            </div>
        );
    }
}

CandidateProfile.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(CandidateProfile);