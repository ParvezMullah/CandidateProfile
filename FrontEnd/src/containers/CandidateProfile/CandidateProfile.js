import React, { Component } from 'react';
import './style.scss'
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
  });

  
class CandidateProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedFile: null,
            upload_error: ''
        }
    }

    fileSelectedHandler = (event) => {
        // console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    fileUploadHandler = async() => {
        const fd = new FormData();
        fd.append('file', this.state.selectedFile)
        const responseData = await axios.post(apiPath + 'upload', fd)
        console.log(responseData)
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
            </div>
        );
    }
}

CandidateProfile.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(CandidateProfile);