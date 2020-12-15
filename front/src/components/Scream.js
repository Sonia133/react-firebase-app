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
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import EditButton from '../util/EditButton';
import DeleteScream from '../components/DeleteScream';

import { likeScream, unlikeScream } from '../redux/actions/dataActions';

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
    likedScream = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.screamId === this.props.scream.screamId)) {
            return true;
        } else return false;
    }
    likeScream = () => {
        this.props.likeScream(this.props.scream.screamId);
    }
    unlikeScream = () => {
        this.props.unlikeScream(this.props.scream.screamId);
    }
    render() {
        dayjs.extend(relativeTime);
        const { user: { authenticated, credentials: { handle } }, classes, scream: { body, createdAt, userImage, userHandle, screamId, likeCount, commentCount} } = this.props;
        const likeButton = !authenticated ? (
            <EditButton tip="like">
                <Link to='/login'>
                    <FavoriteBorder color="primary"></FavoriteBorder>
                </Link>
            </EditButton>
        ) : (
            this.likedScream() ? (
                <EditButton tip="unlike" onClick={this.unlikeScream}>
                    <FavoriteIcon color="primary"></FavoriteIcon>
                </EditButton>
            ) : (
                <EditButton tip="like" onClick={this.likeScream}>
                    <FavoriteBorder color="primary"></FavoriteBorder>
                </EditButton>
            )
        )
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId}/>
        ) : null
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
                    {likeButton}
                    <span>{likeCount} Likes</span>
                    <EditButton tip="comments">
                        <ChatIcon color="primary"></ChatIcon>    
                    </EditButton> 
                    <span>{commentCount} Comments </span>
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