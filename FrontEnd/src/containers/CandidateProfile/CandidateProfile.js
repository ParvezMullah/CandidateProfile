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
            fileToUpload: null,
            upload_error: ''
        }
    }

    downloadStudentRecords = async() => {
        const responseData = await axios.get(apiPath + 'download')
        try{
            FileDownload(responseData.data, 'dd.xlsx');
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
                <input
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel/*"
                    className={classes.input}
                    id="contained-button-file"
                    type="file"
                />
                <label htmlFor="contained-button-file">
                <Button 
                    variant="contained"
                    color="primary"  
                    component="span" 
                    className={classes.button}>
                    Upload
                </Button>
            </label>
            </div>
        );
    }
}

CandidateProfile.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(CandidateProfile);