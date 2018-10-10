import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import { logout } from 'modules/auth/redux/actions';

const TopBar = ({ currentUser, logout: logoutAction }) => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/" href="/">
          Home&nbsp; <Glyphicon glyph="home" />
        </Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Navbar.Collapse>
      {currentUser.get('role') === 'admin' && (
        <Nav>
          <NavItem componentClass={Link} href="/users" to="/users">
            Users &nbsp;<Glyphicon glyph="user" />
          </NavItem>
          <NavItem componentClass={Link} href="/restaurants" to="/restaurants">
            Restaurants&nbsp;<Glyphicon glyph="th-list" />
          </NavItem>
        </Nav>
      )}
      {(currentUser.get('role') === 'owner' ||
        currentUser.get('role') === 'user') && (
        <Nav>
          <NavItem componentClass={Link} to="/restaurants" href="/restaurants">
            Restaurants&nbsp;<Glyphicon glyph="th-list" />
          </NavItem>
        </Nav>
      )}
      <Nav pullRight>
        <NavItem>{`${currentUser.get('firstName')} (${currentUser.get(
          'role',
        )})`}</NavItem>

        <NavItem
          componentClass={Link}
          href="/logout"
          to="/logout"
          onClick={logoutAction}
        >
          Log out&nbsp; <Glyphicon glyph="log-out" />
        </NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

TopBar.propTypes = {
  logout: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const mapDispatchToProps = {
  logout,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(TopBar);
