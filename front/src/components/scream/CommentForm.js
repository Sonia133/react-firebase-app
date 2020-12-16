import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import Comments from './Comments';
import { submitComment } from '../../redux/actions/dataActions';

const styles = {
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)"
    },
    textField: {
      margin: "10px auto 10px auto"
    },
    button: {
      marginTop: 10,
      position: "relative",
      marginTop: 10
    }
};

class CommentForm extends Component {
    state = {
        body: '',
        errors: {}
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.ui.errors) {
          this.setState({ errors: nextProps.ui.errors });
        }
        if (!nextProps.ui.errors && !nextProps.ui.loading) {
          this.setState({ body: "", errors: {} });
        }
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    handleSubmit = event => {
        event.preventDefault();
        this.props.submitComment(this.props.screamId, { body: this.state.body });
    };
    render() {
        const { classes, authenticated, ui: { loading } } = this.props;
        const errors = this.state.errors;

        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{ textAlign: 'center' }}>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        name="body"
                        type="text"
                        label="Comment on scream"
                        error={errors.comment ? true : false}
                        helperText= {errors.comment}
                        value={this.state.body}
                        onChange={this.handleChange}
                        className={classes.textField}
                        fullWidth
                    />
                    <Button 
                        variant="contained"
                        type="submit"
                        color="primary"
                        className={classes.button}
                        disabled={loading}
                    >
                        Submit
                    </Button>
                </form>
            </Grid>
        ) : null;

        return commentFormMarkup;
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
    screamId: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
    ui: state.ui,
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));