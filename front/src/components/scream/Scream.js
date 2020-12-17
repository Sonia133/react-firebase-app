import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import ChatIcon from '@material-ui/icons/Chat';

import LikeButton from './LikeButton';
import EditButton from '../../util/EditButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';

import { likeScream, unlikeScream } from '../../redux/actions/dataActions';

const styles = {
    card: {
        display: 'flex',
        marginBottom: 20,
        position: 'relative'
    },
    image: {
        minWidth: 150
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

class Scream extends Component {
    render() {
        dayjs.extend(relativeTime);
        const { user: { authenticated, credentials: { handle } }, classes, scream: { body, createdAt, userImage, userHandle, screamId, likeCount, commentCount} } = this.props;
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId}/>
        ) : null;
        return (
           <Card className={classes.card}>
               <CardMedia
                   image={userImage}
                   title="Profile image"
                   className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography 
                        variant="h5" 
                        component={Link} 
                        to={`/users/${userHandle}`}
                        color="primary"
                    >
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography 
                        variant="body2" 
                        color="textSecondary"
                    >
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography 
                        variant="body1"
                    >
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} Likes</span>
                    <EditButton tip="comments">
                        <ChatIcon color="primary"></ChatIcon>    
                    </EditButton> 
                    <span>{commentCount} Comments </span>
                    <ScreamDialog screamId={screamId} userHandle={userHandle} openDialog={this.props.openDialog}/>
                </CardContent>
           </Card>
        )
    }
}

Scream.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    openDialog: PropTypes.bool,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionToProps = {
    likeScream,
    unlikeScream
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Scream));