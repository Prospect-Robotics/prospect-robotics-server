import React, {Component} from 'react';
import {Button, Col, Icon, Row, Timeline, Typography} from "antd";
import SponsorModal from "./SponsorModal";

import '../styles/sponsors.css';

const Text = Typography.Text;

class Sponsors extends Component {
  state = {
    modalVisible: false,
    sponsors: {}
  };

  updateSponsor(sponsor) {
    let formData = new FormData();

    // formData.append('id', this.props.member.id);
    formData.append('year', sponsor.year);
    formData.append('name', sponsor.name || '');
    formData.append('description', sponsor.description || '');
    if (sponsor.logo) {
      formData.append('file', sponsor.logo.file.originFileObj);
      formData.append('fileName', sponsor.logo.file.name);
    }
    if (sponsor.id) {
      formData.append('id', sponsor.id);
    }

    fetch('/sponsors', {
      method: 'POST',
      body: formData
    }).then(() => {
      this.sponsorFormRef.resetFields();
      this.getSponsors();
    });
  }

  onEdit() {
    const {form} = this.sponsorFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      this.updateSponsor(values);
      setTimeout(() => this.sponsorFormRef.resetFields, 300);
      this.setState({modalVisible: false, selectedSponsor: undefined});
    });
  }

  getSponsors() {
    fetch('/sponsors')
      .then(response => response.json())
      .then(data => {
        let sponsors = {};
        for (let id in data) {
          if (data.hasOwnProperty(id)) {
            let sponsor = data[id];
            if (!sponsors[sponsor.year])
              sponsors[sponsor.year] = {};
            sponsors[sponsor.year][id] = sponsor;
          }
        }
        this.setState({sponsors});
      });
  }

  handleDeleteSponsor(id) {
    fetch('/sponsors/' + id, {
      method: 'DELETE'
    }).then(() => {
      this.getSponsors();
    });
  }

  componentDidMount() {
    this.getSponsors();
  }

  render() {
    return (
      <div className={"sponsors"}>
        <Row>
          <h1 style={{float: 'left'}}>Sponsors</h1>
          <Button icon={"plus"} type={"primary"} style={{float: 'right'}}
                  onClick={() => this.setState({modalVisible: true})}>New Sponsor</Button>
        </Row>
        <Timeline>
          {Object.keys(this.state.sponsors).sort((a, b) => {
            return parseInt(b) - parseInt(a);
          }).map(year => (
            <Timeline.Item key={year}>
              <div>
                <Col xs={24} sm={2}>
                  <h2>{year}</h2>
                </Col>
                <Col xs={24} sm={{span: 21, offset: 1}}>
                  <Row gutter={8}>
                    {Object.keys(this.state.sponsors[year]).map(id => {
                      let sponsor = this.state.sponsors[year][id];
                      return (
                        <Col xs={8} sm={6} md={4} lg={3} xl={2} key={id} className={"sponsor"}>
                          {sponsor.src ? (
                            <Col xs={24} style={{marginBottom: 12}}>
                              <img src={sponsor.src} alt="" style={{width: '100%'}}/>
                            </Col>
                          ) : ""}
                          <Col xs={24} style={{textAlign: 'center'}}>
                            <Text>{sponsor.name}</Text><br/>
                            <Text type={"secondary"}>{sponsor.description}</Text>
                          </Col>
                          <Button shape="circle" icon={"edit"} className="edit-sponsor" onClick={() => {
                            this.setState({
                              selectedSponsor: sponsor,
                              modalVisible: true
                            })
                          }}/>
                          <Button shape="circle" icon={"delete"} className="delete-sponsor"
                                  onClick={() => this.handleDeleteSponsor(sponsor.id)}/>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
        <SponsorModal wrappedComponentRef={formRef => this.sponsorFormRef = formRef}
                      onCancel={() => this.setState({modalVisible: false})}
                      onOk={this.onEdit.bind(this)}
                      sponsor={this.state.selectedSponsor}
                      visible={this.state.modalVisible}/>
      </div>
    )
  }
}

export default Sponsors;
