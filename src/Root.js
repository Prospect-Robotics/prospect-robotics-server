import React from 'react';
import './styles/root.css';
import 'antd/dist/antd.css';
import MemberImages from "./components/MemberImages";
import BlogPosts from "./components/BlogPosts";

function Root() {
  return (
    <div>
      <h1 className={'title'}>
        Prospect Website Server
      </h1>
      <BlogPosts/>
      <MemberImages/>
    </div>
  );
}

export default Root;
