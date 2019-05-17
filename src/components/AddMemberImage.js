import React, {Component} from 'react';
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";
import {Col, Icon, message, Row, Select, Upload} from 'antd';
import TextArea from "antd/es/input/TextArea";
import missing from "../images/missing.svg";

const {Option} = Select;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class AddMemberImage extends Component {
  state = {
    imageUrl: null,
    imageFile: null
  };

  dummyRequest = ({file, onSuccess}) => {
    this.setState({
      imageFile: file
    });

    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  handleChange = (info) => {
    getBase64(info.file.originFileObj, imageUrl => this.setState({
      imageUrl
    }));
  };

  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        let file = this.state.imageFile;

        let formData = new FormData();

        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('name', values.name);
        formData.append('position', values.position || '');
        formData.append('description', values.description || '');
        if (this.props.member !== undefined)
          formData.append('id', this.props.member.id);

        fetch('/upload', {
          method: 'POST',
          body: formData
        }).then(response => {
          console.log(response);
          if (this.props.onAdd)
            this.props.onAdd();

          this.setState({
            imageUrl: null
          });
          this.props.form.resetFields();
        });
      } else {
        if (this.props.member !== undefined) {
          let formData = new FormData();

          formData.append('id', this.props.member.id);
          formData.append('name', values.name);
          formData.append('position', values.position || '');
          formData.append('description', values.description || '');

          fetch('/upload', {
            method: 'POST',
            body: formData
          }).then(response => {
            console.log(response);
            if (this.props.onAdd)
              this.props.onAdd();

            this.setState({
              imageUrl: null
            });
            this.props.form.resetFields();
          });
        }
      }
    });
  };

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    const nameError = isFieldTouched('name') && getFieldError('name');
    const fileError = isFieldTouched('file') && getFieldError('file');

    const imageUrl = this.state.imageUrl;

    const member = this.props.member || {};

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    let image = uploadButton;
    if (member.src)
      image = <img src={member.src} alt=" "/>;
    if (imageUrl)
      image = <img src={imageUrl} alt="avatar"/>;

    return (
      <Form onSubmit={this.handleSubmit} className={'add-member-image-form'}>
        <Row>
          <Col xs={12}>
            <Form.Item
              label="Member Photo"
            >
              <div>
                {getFieldDecorator('file', {
                  rules: [{required: true, message: 'Please choose a file!'}],
                })(
                  <Upload
                    name="file"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    customRequest={this.dummyRequest}
                  >
                    {image}
                  </Upload>
                )}
              </div>
            </Form.Item>
            <Form.Item
              validateStatus={nameError ? 'error' : ''}
              help={nameError || ''}
              label={"Member Name"}
            >
              {getFieldDecorator('name', {
                rules: [{required: true, message: 'Please choose a name!'}],
                initialValue: member.name || ""
              })(
                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Name"/>
              )}
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              label={"Position"}
            >
              {getFieldDecorator('position', {
                initialValue: member.position || 'member'
              })(
                <Select>
                  <Option value="member">Member</Option>
                  <Option value="president">President</Option>
                  <Option value="vicePresident">Vice President</Option>
                  <Option value="treasurer">Treasurer</Option>
                  <Option value="secretary">Secretary</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label={"Description"}>
              {getFieldDecorator('description', {
                initialValue: member.description || ""
              })(
                <TextArea rows={4}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          {this.props.customFooter !== undefined ? this.props.customFooter : (
            <Form.Item>
              <Button type={"primary"} htmlType="submit" icon={"plus"}>Add</Button>
            </Form.Item>
          )}
        </Row>
      </Form>
    );
  }
}

export default Form.create({name: 'add_member_image'})(AddMemberImage);
