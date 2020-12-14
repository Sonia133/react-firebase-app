import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';

import { logoutUser, uploadImage } from '../redux/actions/userActions';

const styles = (theme) => ({
    paper: {
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%"
        }
      },
      "& .profile-image": {
        width: 160,
        height: 160,
        objectFit: "cover",
        maxWidth: "90%",
        borderRadius: "50%"
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: theme.palette.primary.main
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    }
});

class Profile extends Component {
    handleImageChange = (event) => {
        const image = event.target.files[0];
        // send to server
        const formData = new FormData();
        formData.append('image', image, image.name);

        this.props.uploadImage(formData);
    };
    handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    }
    render() {
        const { 
            classes, 
            user: {
                authenticated,
                credentials: { handle, createdAt, imageUrl, bio, website, location },
                loading
            }
        } = this.props;

        let profileMarkup = !loading ? (authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img src={imageUrl} alt="profile" className="profile-image"/>
                        <input hidden="hidden" type="file" id="imageInput" onChange={this.handleImageChange}></input>
                        <Tooltip title="Edit profile picture" placement="top">
                            <IconButton onClick={this.handleEditPicture} className="button">
                                <EditIcon color="primary"></EditIcon>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr/>
                    <div className="profile-details">
                        <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                            @{handle}
                        </MuiLink>
                        <hr/>
                        {bio && <Typography variant="body2">{bio}</Typography>}
                        <hr/>
                        {location && (
                            <Fragment>
                                <LocationOn color="primary" /> <span>{location}</span>
                                <hr/>
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary"></LinkIcon>
                                <a href={website} target="_blank" rel="noopener noreferrer">
                                    {' '}{website}
                                </a>
                                <hr/>
                            </Fragment>
                        )}
                        <CalendarToday color="primary"/> {' '}
                        <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                    </div>
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    No porfile found, please login again.
                </Typography>
                <div className={classes.buttons}>
                    <Button variant="contained" color="primary" component={Link} to="/login">
                        Log in
                    </Button>
                    <Button variant="contained" color="secondary" component={Link} to="/signup">
                        Sign up
                    </Button>
                </div>
            </Paper>
        )) : (<p>loading..</p>)
        return profileMarkup;
    }
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionToProps = { logoutUser, uploadImage };

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Profile));
