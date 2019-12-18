import React, {Component} from 'react';
import {Button, Collapse} from "antd";
import EditBuildLogPost from "./EditBuildLogPost.js";
import Post from "./Post";

class BlogPosts extends Component {
  state = {
    posts: {},
    newBuildLogPostVisible: false
  };

  getPosts() {
    fetch('/buildLogImages')
      .then(res => res.json())
      .then(posts => {
        this.setState({posts});
      });
  }

  componentDidMount() {
    this.getPosts();
  }

  render() {
    let {posts} = this.state;

    return (
      <div>
        <div>
          <h1 style={{float: 'left'}}>
            Build Log
          </h1>
          <Button icon={"plus"} type={"primary"} style={{float: 'right'}}
                  onClick={() => this.setState({newBuildLogPostVisible: true})}>New Post</Button>
        </div>
        <Collapse accordian style={{clear: 'both'}}>
          {Object.keys(posts).reverse().map(key => (
            <Collapse.Panel header={this.state.posts[key].title} key={this.state.posts[key].id}>
              <Post url={'/buildLog/'} post={this.state.posts[key]} id={key} key={key} onEdit={() => this.getPosts()}/>
            </Collapse.Panel>
          ))}
        </Collapse>
        <EditBuildLogPost mode={"create"} visible={this.state.newBuildLogPostVisible}
                      onCancel={() => this.setState({newBuildLogPostVisible: false})} onEdit={() => {
          this.setState({newBuildLogPostVisible: false});
          this.getPosts();
        }}/>
      </div>
    )
  }
}

export default BlogPosts;
