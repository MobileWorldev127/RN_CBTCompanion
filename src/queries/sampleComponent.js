import React from 'react';
import {
  View, Text
} from 'react-native';

import { graphql, compose } from 'react-apollo';
import DefaultItemsQuery from './DefaultItemsQuery';

class DefaultItems extends React.Component {
  render() {
    return (
      <View>
        <Text> {JSON.stringify(this.props.posts.length)} </Text>
        {/* {this.props.posts && this.props.posts[0].map(skill => <Text>Skill: {skill.title}</Text>)} */}
      </View>
    )
  }
}

const AppWithDefaultItems = compose(
  graphql(DefaultItemsQuery, {
    options: {
      fetchPolicy: 'cache-and-network'
    },
    props: (props) => ({
      posts: props.data.getDefaultItems && props.data.getDefaultItems
    })
  })
)(DefaultItems);

