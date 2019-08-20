import React, {Component} from 'react';
import '../styles/member-images.css';
import AddMemberImage from "./AddMemberImage";
import Row from "antd/es/grid/row";
import MemberCard from "./MemberCard";
import {Col} from "antd";
import EditMemberImageModal from "./EditMemberImageModal";

class MemberImages extends Component {

  constructor(props) {
    super(props);

    this.state = {
      memberImages: {
        members: {}
      },
      editMemberImageVisible: false
    };
  }

  fetchMemberImages() {
    fetch('/memberImages')
      .then(response => {
        return response.json();
      })
      .then(memberImages => {
        this.setState({memberImages});
      });
  }

  componentDidMount() {
    this.fetchMemberImages();
  }

  handleAddMember() {
    this.fetchMemberImages();
  }

  handleDeleteMember(member) {
    fetch('/memberImages/' + member.id, {
      method: 'DELETE'
    }).then(() => {
      this.fetchMemberImages();
    });
  }

  render() {
    let {memberImages} = this.state;

    return (
      <div className={"member-images"}>
        <Row>
          <Col xs={24} md={8}>
            <AddMemberImage onAdd={this.handleAddMember.bind(this)}/>
          </Col>
          <Col xs={24} md={16} style={{paddingLeft: 32}}>
            <h1>Board Members</h1>
            <Row>
              <Col xs={12} md={6}>
                <MemberCard member={memberImages.president}/>
              </Col>
              <Col xs={12} md={6}>
                <MemberCard member={memberImages.vicePresident}/>
              </Col>
              <Col xs={12} md={6}>
                <MemberCard member={memberImages.treasurer}/>
              </Col>
              <Col xs={12} md={6}>
                <MemberCard member={memberImages.secretary}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          {memberImages.members !== undefined ? Object.keys(memberImages.members).map(memberId => (
            <MemberCard member={memberImages.members[memberId]} key={memberId}
                        onDelete={this.handleDeleteMember.bind(this)}
                        onEdit={(member) => this.setState({editMemberImageVisible: true, editMember: member})}/>
          )) : ""}
        </Row>

        <EditMemberImageModal visible={this.state.editMemberImageVisible} member={this.state.editMember}
                              onCancel={() => this.setState({editMemberImageVisible: false, editMember: undefined})}
                              onEdit={() => {
                                this.setState({
                                  editMemberImageVisible: false, editMember: undefined
                                });
                                this.fetchMemberImages();
                              }}/>
      </div>
    )
  }
}

export default MemberImages;
