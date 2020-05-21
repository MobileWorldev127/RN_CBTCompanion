import gql from "graphql-tag";

export const getDiscussionGroupsQuery = gql`
  query getDiscussionGroups($appId: SwasthApp!) {
    getDiscussionGroups(appId: $appId) {
      createdAt
      placeholder
      id
      appId
      name
    }
  }
`;

export const getDiscussionGroupMessagesQuery = `
  query getDiscussionGroupMessages($groupId: ID!) {
    getDiscussionGroupMessages(groupId: $groupId) {
      id
      groupId
      message
      createdAt
      senderId
      senderName
      comments {
        comment
        createdAt
        senderId
        senderName
        id
      }
      likes
      isReported
      reportedBy {
        userId
        name
      }
    }
  }
`;

export const sendMessageToDiscussionGroupMutation = `
  mutation sendMessageToDiscussionGroup($groupId: ID!, $message: String!) {
    sendMessageToDiscussionGroup(groupId: $groupId, message: $message) {
      id
      groupId
      message
      createdAt
      senderId
      senderName
      comments {
        comment
        createdAt
        senderId
        senderName
        id
      }
      likes
      isReported
      reportedBy {
        userId
        name
      }
    }
  }
`;

export const commentOnDiscussionGroupMessageMutation = `
  mutation commentOnDiscussionGroupMessage(
    $groupId: ID!
    $messageId: ID!
    $comment: String!
  ) {
    commentOnDiscussionGroupMessage(
      groupId: $groupId
      messageId: $messageId
      comment: $comment
    ) {
      msg
    }
  }
`;

export const likeUnlikeDiscussionGroupMessageMutation = `
  mutation likeUnlikeDiscussionGroupMessage(
    $groupId: ID!
    $messageId: ID!
    $like: Boolean!
  ) {
    likeUnlikeDiscussionGroupMessage(
      groupId: $groupId
      messageId: $messageId
      like: $like
    ) {
      msg
    }
  }
`;

export const reportDiscussionGroupMessageMutation = `
  mutation reportDiscussionGroupMessage($groupId: ID!, $messageId: ID!) {
    reportDiscussionGroupMessage(groupId: $groupId, messageId: $messageId) {
      msg
    }
  }
`;
