import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import textStyles from "../../common/TextStyles";
import { Query, ApolloConsumer } from "react-apollo";
import { getLookupValuesQuery } from "../../queries/getLookupValues";
import ComponentImage from "./Image";
import Title from "./Title";
import { showApiError } from "../../utils";
import * as Animatable from "react-native-animatable";
var _ = require("lodash");

export default class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
  }

  render() {
    return (
      <View>
        {this.props.image && <ComponentImage image={this.props.image} />}
        <Title
          showInstructions={this.props.showInstructions}
          title={this.props.question}
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
                      console.log("LOOKUP", data);
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
                        backgroundColor: data.isSelected ? data.color : "#fff"
                      }}
                      onPress={() => {
                        data.isSelected = !data.isSelected;
                        this.setState({
                          shouldRefresh: !this.state.shouldRefresh
                        });
                        let selectedValues = [];
                        this.state.elements.forEach(element => {
                          if (element.isSelected) {
                            selectedValues.push({
                              key: {
                                name: element.name,
                                color: element.color
                              },
                              value: 0
                            });
                          }
                        });
                        this.props.onValueChange({ keyValues: selectedValues });
                      }}
                    >
                      <Text
                        style={[
                          textStyles.ContentText,
                          {
                            color: data.isSelected ? "#fff" : data.color
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
                  paddingHorizontal: 16,
                  paddingBottom: 32
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
