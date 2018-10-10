import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Button, Grid, Row, Col, Table, Modal } from 'react-bootstrap';
import { makeSelectCurrentUser } from 'containers/App/redux/selectors';
import Loading from 'components/LoadingIndicator';
import { userListRequest, userDeleteRequest } from '../redux/actions';
import {
  makeSelectUserList,
  makeSelectUserListLoading,
} from '../redux/selectors';

class UsersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteId: null,
      showDeleteConfirm: false,
    };
  }

  componentDidMount() {
    this.props.userList();
  }

  componentWillMount() {
    this.props.userList();
  }

  onDelete = deleteId => () => {
    this.setState({ deleteId, showDeleteConfirm: true });
  };

  handleConfirm = () => {
    this.props.userDelete(this.state.deleteId);
    this.setState({ showDeleteConfirm: false });
  };

  handleCancel = () => this.setState({ showDeleteConfirm: false });

  renderConfirmDialog = () => {
    const { currentUser } = this.props;
    const { showDeleteConfirm, deleteId } = this.state;

    return (
      <Modal show={showDeleteConfirm} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser.get('_id') === deleteId
            ? 'You can not delete yourself'
            : 'Are you sure to delete this User?'}
        </Modal.Body>
        <Modal.Footer>
          {currentUser.get('_id') !== deleteId && (
            <Button bsStyle="danger" onClick={this.handleConfirm}>
              Delete
            </Button>
          )}
          <Button bsStyle="primary" onClick={this.handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  renderUsers = users => {
    if (!users.size) {
      return (
        <tr>
          <td>No Users</td>
        </tr>
      );
    }

    return users.map((user, idx) => (
      <tr key={user.get('_id')}>
        <td>{idx + 1}</td>
        <td>
          {user.get('firstName')}
          &nbsp;
          {user.get('lastName')}
        </td>
        <td>{user.get('email')}</td>
        <td>{user.get('role')}</td>
        <td>
          <Link
            className="btn btn-info"
            role="button"
            to={`/users/${user.get('_id')}`}
            href={`/users/${user.get('_id')}`}
          >
            Edit
          </Link>
          &nbsp;
          <Button bsStyle="danger" onClick={this.onDelete(user.get('_id'))}>
            Delete
          </Button>
        </td>
      </tr>
    ));
  };

  render() {
    const { loading, users } = this.props;

    if (loading) {
      return <Loading />;
    }
    return (
      <Grid>
        <Row>
          <Col>
            <Row className="page-header">
              <Col sm={6}>
                <h2>Users</h2>
              </Col>
              <Col sm={6} className="header-btn">
                <Link
                  className="signup-link btn btn-primary"
                  role="button"
                  to="/users/new"
                  href="/users/new"
                >
                  Add
                </Link>
              </Col>
            </Row>
            {this.renderConfirmDialog()}
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{this.renderUsers(users)}</tbody>
            </Table>
          </Col>
        </Row>
      </Grid>
    );
  }
}

UsersPage.propTypes = {
  userList: PropTypes.func.isRequired,
  userDelete: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUserList(),
  loading: makeSelectUserListLoading(),
  currentUser: makeSelectCurrentUser(),
});

const mapDispatchToProps = {
  userList: userListRequest,
  userDelete: userDeleteRequest,
};

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(UsersPage);
