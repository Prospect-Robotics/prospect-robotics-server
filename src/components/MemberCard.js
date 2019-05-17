import React from 'react';
import Meta from "antd/es/card/Meta";
import Card from "antd/es/card";

import missing from '../images/missing.svg';
import Text from "antd/es/typography/Text";
import Button from "antd/es/button";

import '../styles/member-card.css';

const MemberCard = ({member, onDelete, onEdit}) => {
  if (member === undefined)
    member = {};

  return (
    <Card className={"member-image-card"} key={member.name || 'Missing'} hoverable
          cover={(
            <div className={"member-image-cover"}>
              <img src={member.src !== undefined ? member.src : missing} alt=" "/>
              {onDelete !== undefined ?
                <Button className={"member-image-delete-button"} icon="delete" type="danger" shape={"circle"}
                        onClick={() => onDelete(member)}/> : ""}
              {onEdit !== undefined ? <Button className={"member-image-edit-button"} icon="edit" shape={"circle"}
                                              onClick={() => onEdit(member)}/> : ""}
            </div>
          )}>
      <Text type={'secondary'} style={{marginBottom: 8}}>
        {(() => {
          switch (member.position) {
            case "president":
              return "President";
            case "vicePresident":
              return "Vice President";
            case "treasurer":
              return "Treasurer";
            case "secretary":
              return "Secretary";
            default:
              return "Member";
          }
        })()}
      </Text>
      <Meta title={member.name || 'Missing'} description={member.description}/>
    </Card>
  )
};

export default MemberCard;
