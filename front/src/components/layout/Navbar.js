import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Notifications from './Notifications';
import EditButton from '../../util/EditButton';
import PostScream from '../scream/PostScream';

import HomeIcon from "@material-ui/icons/Home";

class Navbar extends Component {
    render() {
        const { authenticated } = this.props;
        return (
            <AppBar>
                <Toolbar className="nav-container"> 
                   {authenticated ? 
                   (
                       <Fragment>
                           <PostScream/>
                           <Link to='/'>
                                <EditButton tip="Home">
                                        <HomeIcon></HomeIcon>
                                </EditButton>
                           </Link>
                            <Notifications />
                       </Fragment>
                   ) 
                   : (
                       <Fragment>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/">
                                Home
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                Signup
                            </Button>
                        </Fragment>
                   )}
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
})

export default connect(mapStateToProps)(Navbar);
