import gql from "graphql-tag";

export const getJoinedPeerSupportGroupsQuery = gql`
  query getJoinedPeerSupportGroups($appId: SwasthApp!) {
    getJoinedPeerSupportGroups(appId: $appId) {
      id
      appId
      name
      createdAt
      creatorId
      creatorName
      description
      status
      participants {
        name
        userId
        nickname
      }
    }
  }
`;

export const getPeerSupportGroupsQuery = `query getPeerSupportGroups($appId : SwasthApp!, $search : String){
    getPeerSupportGroups(appId: $appId, search : $search){
        id
        appId
        name
        createdAt
        creatorId
        creatorName
        description
        status
        participants{
          name
          userId
          nickname
        }
      }
}`;

export const getPeerSupportGroupMessagesQuery = `query getPeerSupportGroupMessages($groupId: ID!, $pageSize: Int!, $pageIndex: Int!){
    getPeerSupportGroupMessages(groupId: $groupId, pageSize: $pageSize, pageIndex: $pageIndex){
        groupId
        message
        senderId
        senderName
        createdAt
        id
      }
}`;

export const joinPeerGroupQuery = `mutation joinPeerSupportGroup($appId: SwasthApp!, $groupId: ID!, $nickname: String!){
  joinPeerSupportGroup(appId: $appId, groupId: $groupId, nickname: $nickname){
    msg
  }
}`;

export const createPeerGroupQuery = `mutation createPeerSupportGroup($name: String!, $description: String!, $nickname: String!, $appId: SwasthApp!){
    createPeerSupportGroup(
      name: $name,
      description: $description,
      nickname: $nickname
      appId: $appId){
        id
        appId
        name
        createdAt
        creatorId
        creatorName
        description
        status
        participants{
          name
          userId
          nickname
        }
      }
  }`;

export const leavePeerGroupQuery = `mutation leavePeerSupportGroup($appId: SwasthApp!, $groupId: ID!){
  leavePeerSupportGroup(appId: $appId, groupId: $groupId){
    msg
  }
}`;

export const sendPeerGroupMessageQuery = `mutation sendPeerSupportGroupMessage($groupId: ID!, $message: String!){
  sendPeerSupportGroupMessage(groupId: $groupId, message: $message){
    groupId
    message
    senderId
    senderName
    createdAt
    id
  }
}`;

export const subscribeToPeerSupportGroupMessage = `subscription subscribeToPeerSupportGroupMessage($groupId: ID!){
  subscribeToPeerSupportGroupMessage(groupId: $groupId){
    groupId
    message
    senderId
    senderName
    createdAt
    id
  }
}`;

export const getUnJoinedPeerSupportGroups = `query getUnJoinedPeerSupportGroups($appId : SwasthApp!){
  getUnJoinedPeerSupportGroups(appId: $appId){
      id
      appId
      name
      createdAt
      creatorId
      creatorName
      description
      status
      participants{
        name
        userId
        nickname
      }
    }
}`;