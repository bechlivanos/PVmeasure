import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { logout } from "../auth/authActions";

const Navbar = props => {
  return (
    <Menu inverted>
      <Menu.Item icon as={NavLink} to="/" exact>
        <Icon name="calculator" />
        &nbsp;&nbsp;&nbsp;Measurements
      </Menu.Item>
      <Menu.Item icon as={NavLink} to="/failures">
        <Icon name="exclamation triangle" />
        &nbsp;&nbsp;&nbsp;Failures
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item onClick={props.logout}>
          <Icon name="sign out" />
          Sign out
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

const mapDispatchToProps = { logout };

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Navbar)
);
