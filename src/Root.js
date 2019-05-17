import React from 'react';
import './styles/root.css';
import 'antd/dist/antd.css';
import MemberImages from "./components/MemberImages";  // or 'antd/dist/antd.less'

function Root() {
  return (
    <div>
      <h1 className={'title'}>
        Prospect Website Server
      </h1>
      <MemberImages/>
    </div>
  );
}

export default Root;
