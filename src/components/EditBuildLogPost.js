import React, {Component} from 'react';
import {Button, Col, DatePicker, Form, Icon, Input, message, Modal, Row, Upload} from 'antd';
import moment from 'moment';
import '../styles/edit-blog-post.scss';

const {TextArea} = Input;

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
  return isJPG;
}

class EditBuildLogPost extends Component {
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
    console.log('submit');
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        let file = this.state.imageFile;

        let formData = new FormData();

        if (file) {
          formData.append('file', file);
          formData.append('fileName', file.name);
        }
        formData.append('title', values.title);
        formData.append('date', values.date);
        formData.append('content', values.content || '');
        if (this.props.post !== undefined)
          formData.append('id', this.props.post.id);

        fetch('/buildLog', {
          method: 'POST',
          body: formData
        }).then(response => {
          if (this.props.onEdit)
            this.props.onEdit();

          this.setState({
            imageUrl: null
          });
          this.props.form.resetFields();
        });
      } else {
        if (this.props.post !== undefined) {
          let formData = new FormData();

          formData.append('id', this.props.post.id);
          formData.append('title', values.title);
          formData.append('date', values.date);
          formData.append('content', values.content || '');

          fetch('/buildLog', {
            method: 'POST',
            body: formData
          }).then(response => {
            if (this.props.onEdit)
              this.props.onEdit();

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
      getFieldDecorator, getFieldError, isFieldTouched, resetFields
    } = this.props.form;

    const titleError = isFieldTouched('title') && getFieldError('title');

    const imageUrl = this.state.imageUrl;

    const post = this.props.post || {};

    let image = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    if (post.src)
      image = <img src={post.src} alt=" " style={{width: '100%'}}/>;
    if (imageUrl)
      image = <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>;

    return (
      <Modal title={this.props.mode === "create" ? "Create New Build Log Post" : "Edit New Build Log Post"}
             visible={this.props.visible} onCancel={this.props.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit} className={'edit-blog-post-form'}>
          <Row gutter={8}>
            <Col xs={16}>
              <Form.Item
                validateStatus={titleError ? 'error' : ''}
                help={titleError || ''}
                label={"Title"}
              >
                {getFieldDecorator('title', {
                  rules: [{required: true, message: 'Please make a title!'}],
                  initialValue: post.title || ""
                })(
                  <Input prefix={<Icon type="edit" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Title"/>
                )}
              </Form.Item>
            </Col>
            <Col xs={8}>
              <Form.Item label={"Date"}>
                {getFieldDecorator('date', {
                  initialValue: post.date ? moment(post.date) : moment(),
                })(
                  <DatePicker/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Post Photo"
          >
            <div>
              {getFieldDecorator('file')(
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                  customRequest={this.dummyRequest}
                  style={{width: '100%'}}
                >
                  {image}
                </Upload>
              )}
            </div>
          </Form.Item>
          <Form.Item label={"Content"}>
            {getFieldDecorator('content', {
              initialValue: post.content || ""
            })(
              <TextArea rows={4}/>
            )}
          </Form.Item>
          <div className={'ant-modal-footer'}>
            <Button onClick={() => {
              resetFields();
              this.props.onCancel();
            }}>Cancel</Button>
            <Button type={"primary"} htmlType={'submit'} icon={'edit'}>Edit</Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({name: 'edit_build_log_post'})(EditBuildLogPost);
