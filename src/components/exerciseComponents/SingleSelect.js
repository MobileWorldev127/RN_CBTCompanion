import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import textStyles from "../../common/TextStyles";
import { ApolloConsumer } from "react-apollo";
import { getLookupValuesQuery } from "../../queries/getLookupValues";
import ComponentImage from "./Image";
import Title from "./Title";
import { showApiError } from "../../utils";
import * as Animatable from "react-native-animatable";
var _ = require("lodash");

export default class SingleSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingTop: 10,
          paddingBottom: 32,
          backgroundColor: "#fff"
        }}
      >
        {this.props.image && <ComponentImage image={this.props.image} />}
        <Title
          showInstructions={this.props.showInstructions}
          title={this.props.question}
          style={{
            fontSize: 16
          }}
          containerStyle={{
            paddingVertical: 16,
            paddingHorizontal: 16
          }}
        />

        <ApolloConsumer>
          {client => {
            if (this.props.source) {
              if (this.state.elements.length == 0) {
                this.props.setLoading(true);
                client
                  .watchQuery({
                    query: getLookupValuesQuery,
                    variables: {
                      keyname: this.props.source
                    },
                    fetchPolicy: "cache-and-network"
                  })
                  .subscribe({
                    next: data => {
                      if (data.loading && !data.data) {
                        return;
                      }
                      console.log(data);
                      this.props.setLoading(false);
                      if (
                        this.state.elements.length == 0 &&
                        data.data.getLookupValues
                      ) {
                        this.setState({
                          elements: _.cloneDeep(data.data.getLookupValues.value)
                        });
                      }
                    },
                    error: error => {
                      this.props.setLoading(false);
                      console.log(error);
                      showApiError(true);
                    }
                  });
              }
            } else {
              if (this.state.elements.length === 0)
                this.state.elements = _.cloneDeep(this.props.options);
            }
            let elementsList = [];
            if (this.state.elements.length > 0) {
              this.state.elements.map((data, index) => {
                elementsList.push(
                  <Animatable.View
                    animation="zoomIn"
                    delay={index * 50}
                    duration={500}
                  >
                    <TouchableOpacity
                      key={data.name}
                      style={{
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        marginRight: 8,
                        marginBottom: 12,
                        borderRadius: 25,
                        paddingVertical: 6,
                        borderColor: data.color,
                        backgroundColor: data.percentage ? data.color : "#fff"
                      }}
                      onPress={() => {
                        this.state.elements.forEach(element => {
                          element.percentage = undefined;
                        });
                        data.percentage = 24;
                        this.setState({
                          shouldRefresh: !this.state.shouldRefresh,
                          elements: this.state.elements
                        });
                        console.log(this.state.elements);
                        this.props.onValueChange({
                          keyValues: [
                            {
                              key: {
                                name: data.name,
                                color: data.color
                              },
                              value: 0
                            }
                          ]
                        });
                      }}
                    >
                      <Text
                        style={[
                          textStyles.ContentText,
                          {
                            color: data.percentage ? "#fff" : data.color
                          }
                        ]}
                      >
                        {data.name}
                      </Text>
                    </TouchableOpacity>
                  </Animatable.View>
                );
              });
            }
            return (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  paddingHorizontal: 16
                }}
              >
                {elementsList}
              </View>
            );
          }}
        </ApolloConsumer>
      </View>
    );
  }
}
