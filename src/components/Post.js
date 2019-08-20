import React, {Component} from 'react';
import {Button} from "antd";
import EditBlogPost from "./EditBlogPost";
import moment from "moment";

class Post extends Component {
  state = {
    edit: false
  };

  onDelete() {
    fetch('/blog/' + this.props.id, {
      method: 'DELETE'
    }).then(() => {
      this.props.onEdit();
    });
  }

  render() {
    let {post} = this.props;

    return (
      <div>
        <h1>{post.title}</h1>
        <h3>{moment(post.date).toString()}</h3>
        {post.src ? <img src={post.src} alt="" style={{width: '100%', maxWidth: '480px', margin: '0 auto'}}/> : ""}
        <p>{post.content}</p>
        <Button.Group>
          <Button icon={"edit"} type="primary" onClick={() => this.setState({edit: true})}>Edit</Button>
          <Button icon={"delete"} type="danger" onClick={this.onDelete.bind(this)}>Delete</Button>
        </Button.Group>
        <EditBlogPost post={post} mode={"create"} visible={this.state.edit}
                      onCancel={() => this.setState({edit: false})} onEdit={() => {
          this.setState({edit: false});
          this.props.onEdit();
        }}/>
      </div>
    )
  }
}

export default Post;
