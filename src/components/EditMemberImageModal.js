import React, {Component} from 'react';
import {Button, Modal} from "antd";
import AddMemberImage from "./AddMemberImage";

class EditMemberImageModal extends Component {

  render() {
    let {member, visible, onEdit, onCancel} = this.props;

    return (
      <Modal visible={visible} title={"Edit Member"}
             onCancel={onCancel} footer={null}>
        <AddMemberImage member={member} onAdd={onEdit} onCancel={onCancel} customFooter={(
          <div className={'ant-modal-footer'}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type={"primary"} htmlType={'submit'} icon={'edit'}>Edit</Button>
          </div>
        )}/>
      </Modal>
    )
  }
}

export default EditMemberImageModal;
