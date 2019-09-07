import React, {Component} from 'react';
import {Form, Icon, Input, InputNumber, message, Modal, Upload} from "antd";

import '../styles/sponsor-modal.css';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  return isJPG;
}

class SponsorModal extends Component {
  state = {};

  resetFields() {
    this.setState({imageUrl: undefined});
    this.props.form.resetFields();
  }

  dummyRequest = ({file, onSuccess}) => {
    console.log(file);

    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  handleChange(info) {
    getBase64(info.file.originFileObj, imageUrl => this.setState({
      imageUrl
    }));
  }

  render() {
    const {visible, onCancel, onOk, form} = this.props;
    const sponsor = this.props.sponsor || {};
    const {getFieldDecorator, resetFields} = form;

    getFieldDecorator('id', {initialValue: sponsor.id}); // initialize

    let image = (
      <div>
        <Icon type={'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    if (sponsor.src)
      image = <img style={{width: "100%", maxWidth: 512, margin: "0 auto"}} src={sponsor.src} alt=" "/>;
    if (this.state.imageUrl)
      image = <img style={{width: "100%", maxWidth: 512, margin: "0 auto"}} src={this.state.imageUrl} alt="avatar"/>;

    return (
      <Modal title={"Sponsor"} visible={visible} onCancel={() => {
        setTimeout(() => resetFields(), 300);
        onCancel();
      }} onOk={onOk} customFooter={null} className={"sponsor-modal"}>
        <Form layout={"vertical"}>
          <Form.Item label={"Year"}>
            {getFieldDecorator('year', {
              rules: [{required: true, message: "Please choose a year!"}],
              initialValue: sponsor.year || 2019
            })(
              <InputNumber min={2008} max={3000}/>
            )}
          </Form.Item>
          <Form.Item label={"Sponsor Logo"}>
            {getFieldDecorator('logo')(
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={this.handleChange.bind(this)}
                customRequest={this.dummyRequest}
                style={{width: "100%"}}
              >
                {image}
              </Upload>
            )}
          </Form.Item>
          <Form.Item label={"Sponsor Name"}>
            {getFieldDecorator('name', {
              rules: [{required: true, message: "Please enter sponsor name!"}],
              initialValue: sponsor.name || ""
            })(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label={"Sponsor Description"}>
            {getFieldDecorator('description', {
              initialValue: sponsor.description || ""
            })(
              <Input.TextArea/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({name: "sponsor-modal"})(SponsorModal);
