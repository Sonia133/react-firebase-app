import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import EditIcon from '@material-ui/icons/Edit';

import { editUserDetails } from '../redux/actions/userActions';
import EditButton from '../util/EditButton';

const styles = {
    button: {
      float: "right"
    },
    textField: {
      margin: "10px auto 10px auto"
    }
};

class EditDetails extends Component {
    constructor() {
        super();

        this.state = {
            bio: '',
            location: '',
            website: '',
            open: false
        }
    }
    setUserDetailsToState = (credentials) => {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            location: credentials.location ? credentials.location : '',
            website: credentials.website ? credentials.website : ''
        })
    }
    componentDidMount() {
        const { credentials } = this.props;
        this.setUserDetailsToState(credentials);
    }
    handleOpen = () => {
        this.setState({
            open: true
        })
        this.setUserDetailsToState(this.props.credentials);
    } 
    handleClose = () => {
        this.setState({
            open: false
        })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location,
        };
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <EditButton 
                    tip="Edit Details" 
                    onClick={this.handleOpen}
                    btnClassName={classes.button}
                >
                    <EditIcon color="primary"></EditIcon>
                </EditButton>
                <Dialog 
                    open={this.state.open} 
                    onClose={this.handleClose} 
                    fullWidth 
                    maxWidth="sm"
                >
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                type="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField
                                name="website"
                                type="text"
                                label="Website"
                                placeholder="Your personal/professional website"
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <TextField
                                name="location"
                                type="text"
                                label="Location"
                                placeholder="Your location"
                                className={classes.textField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.handleSubmit} color="primary">Submit</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}


EditDetails.propTypes = {
    classes: PropTypes.object.isRequired,
    editUserDetails: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    credentials: state.user.credentials
});

const mapActionsToProps = { editUserDetails };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails));