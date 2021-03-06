import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import GroupForm from "../components/GroupForm";
import { Segment, Header, Grid, Card } from "semantic-ui-react";
import { setFetchHeaders } from "../lib";
import { SERVER1_URL } from "..";
import * as actions from "../store/actions";
import CardActions from "../components/CardActions";

class GroupListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const headers = setFetchHeaders("GET");
    try {
      const response = await fetch(
        `${SERVER1_URL}/measurement_groups/`,
        headers
      );
      if (response.ok) {
        const responseData = await response.json();
        this.props.setGroups(responseData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async deleteGroup(group) {
    toastr.confirm(`Are you sure you want to delete ${group.name}?`, {
      onOk: async () => {
        const headers = setFetchHeaders("DELETE");
        try {
          const response = await fetch(
            `${SERVER1_URL}/measurement_groups/${group.id}/`,
            headers
          );
          if (response.ok) {
            toastr.warning(`${group.name} has been successfully deleted...`);
            this.props.removeGroup(group);
          }
        } catch (e) {
          console.log(e);
          toastr.error(`Something went wrong...`);
        }
      }
    });
  }

  render() {
    return (
      <Grid stackable>
        <Grid.Column width={4}>
          <Segment.Group compact>
            <Segment inverted color="black">
              <Header> Start a new group of measurements</Header>
            </Segment>
            <Segment>
              <GroupForm />
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column width={12}>
          {this.props.groups.results.map((group, index) => (
            <Card key={`group-${index}`}>
              <Card.Content>
                <Card.Header>
                  <Link
                    to={`/recordings/${group.id}/`}
                    style={{ display: "inline-block" }}
                  >
                    {group.name ? group.name : "Recordings"}
                  </Link>
                  <CardActions
                    pullRight
                    deleteAction={() => this.deleteGroup(group)}
                    editAction={() => {
                      this.props.setCurrentGroup(group);
                    }}
                  />
                </Card.Header>
                <Card.Meta>{group.date ? group.date : ""}</Card.Meta>
                <Card.Description>{group.comment}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.main.groups
});

const mapDispatchToProps = {
  setGroups: actions.setGroups,
  removeGroup: actions.removeGroup,
  setCurrentGroup: actions.setCurrentGroup
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupListPage);
