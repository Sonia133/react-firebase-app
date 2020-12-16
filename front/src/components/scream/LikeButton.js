import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import EditButton from '../../util/EditButton';

import { likeScream, unlikeScream } from '../../redux/actions/dataActions';

class LikeButton extends Component {
    likedScream = () => {
        if (this.props.user.likes && this.props.user.likes.find(like => like.screamId === this.props.screamId)) {
            return true;
        } else return false;
    }
    likeScream = () => {
        this.props.likeScream(this.props.screamId);
    }
    unlikeScream = () => {
        this.props.unlikeScream(this.props.screamId);
    }
    render() {
        dayjs.extend(relativeTime);
        const { authenticated } = this.props.user;

        const likeButton = !authenticated ? (
            <Link to='/login'>
                <EditButton tip="like">
                        <FavoriteBorder color="primary"></FavoriteBorder>
                </EditButton>
            </Link>
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
        return likeButton;
    }
}

LikeButton.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});

const mapActionToProps = {
    likeScream,
    unlikeScream
}

export default connect(mapStateToProps, mapActionToProps)(LikeButton);