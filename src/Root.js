import React from 'react';
import './styles/root.css';
import 'antd/dist/antd.css';
import MemberImages from "./components/MemberImages";
import BlogPosts from "./components/BlogPosts";
import BuildLogPosts from "./components/BuildLogPosts";
import Sponsors from "./components/Sponsors";

function Root() {
  return (
    <div>
      <h1 className={'title'}>
        Prospect Website Server
      </h1>
      <BuildLogPosts/>
      <BlogPosts/>
      <br/>
      <Sponsors/>
      <MemberImages/>
    </div>
  );
}

export default Root;
