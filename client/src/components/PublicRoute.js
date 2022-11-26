import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
function PublicRoute(props) {
  if (localStorage.getItem('token')) {
    return <Navigate to="/" />;
  } else {
    return props.children;
  }
}

PublicRoute.propTypes = {
  children: PropTypes.node,
};
export default PublicRoute;
