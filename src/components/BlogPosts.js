import React, {Component} from 'react';
import {Button, Collapse} from "antd";
import EditBlogPost from "./EditBlogPost";
import Post from "./Post";

class BlogPosts extends Component {
  state = {
    posts: {},
    newBlogPostVisible: false
  };

  getPosts() {
    fetch('/blogImages')
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
            Blog
          </h1>
          <Button icon={"plus"} type={"primary"} style={{float: 'right'}}
                  onClick={() => this.setState({newBlogPostVisible: true})}>New Post</Button>
        </div>
        <Collapse accordian style={{clear: 'both'}}>
          {Object.keys(posts).reverse().map(key => (
            <Collapse.Panel header={this.state.posts[key].title} key={this.state.posts[key].id}>
              <Post post={this.state.posts[key]} id={key} key={key} onEdit={() => this.getPosts()}/>
            </Collapse.Panel>
          ))}
        </Collapse>
        <EditBlogPost mode={"create"} visible={this.state.newBlogPostVisible}
                      onCancel={() => this.setState({newBlogPostVisible: false})} onEdit={() => {
          this.setState({newBlogPostVisible: false});
          this.getPosts();
        }}/>
      </div>
    )
  }
}

export default BlogPosts;
