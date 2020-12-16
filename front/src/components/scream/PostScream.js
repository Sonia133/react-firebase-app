import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import EditButton from '../../util/EditButton';
import { postScream, clearErrors } from '../../redux/actions/dataActions';

const styles = {
    textField: {
      marginBottom: "10px"
    },
    submitButton: {
      position: "relative",
      float: "right"
    },
    progress: {
      position: "absolute"
    },
    closeButton: {
      position: "absolute",
      left: "90%",
      top: "6%"
    }
};

class PostScream extends Component {
    state = {
        open: false,
        body: "",
        errors: {}
    };
    handleOpen = () => {
        this.setState({ open: true })
    }
    handleClose = () => {
        this.props.clearErrors(); 
        this.setState({ open: false, errors: {} })
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
      };
    handleSubmit = event => {
        event.preventDefault();
        this.props.postScream({ body: this.state.body });
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.ui.errors) {
            this.setState({ errors: nextProps.ui.errors });
        }
        if (!nextProps.ui.errors && !nextProps.ui.loading) {
            this.setState({ body: "", open: false, errors: {} });
        }
    }
    render() {
        const { classes, ui: { loading } } = this.props;
        const { errors } = this.state;
        return (
            <Fragment>
                <EditButton onClick={this.handleOpen} tip="post a scream">
                    <AddIcon></AddIcon>
                </EditButton>
                <Dialog 
                    open={this.state.open} 
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <EditButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </EditButton>
                    <DialogTitle>Post a new scream</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField 
                                name="body" 
                                type="text" 
                                label="Scream"
                                multiline
                                rows="3"
                                placeholder="Write a scream..."
                                error={errors.body ? true : false}
                                helperText={errors.body}
                                className={classes.textField}
                                onChange={this.handleChange}
                                fullWidth
                            ></TextField>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                className={classes.submitButton}
                                disabled={loading}
                            >
                                Post
                                {loading && (
                                    <CircularProgress size={30} className={classes.progressSpinner} />
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostScream.propTypes = {
    postScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    ui: state.ui
});

const mapActionToProps = {
    postScream,
    clearErrors
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(PostScream));