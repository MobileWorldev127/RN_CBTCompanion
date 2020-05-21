import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import ThemeStyle from "../../styles/ThemeStyle";
import textStyles from "../../common/TextStyles";
import { ApolloConsumer } from "react-apollo";
import { getLookupValuesQuery } from "../../queries/getLookupValues";
import ComponentImage from "./Image";
import Title from "./Title";
import { exerciseIcons } from "../../constants";
import { showApiError } from "../../utils";
var _ = require("lodash");

export default class MultiSelectWithDesc extends Component {
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
          style={{
            fontSize: 16
          }}
          containerStyle={{
            paddingVertical: 24,
            paddingHorizontal: 24
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
                      console.log(data);
                      if (data.loading || !data.data) {
                        return;
                      }
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
                    error: err => {
                      this.props.setLoading(false);
                      showApiError();
                      console.log(err);
                    }
                  });
              }
            } else {
              if (this.state.elements.length === 0)
                this.state.elements = _.cloneDeep(this.props.options);
            }

            let elementsList = [];
            if (this.state.elements.length > 0) {
              this.state.elements.map(data => {
                elementsList.push(
                  <TouchableOpacity
                    key={data.name}
                    style={{
                      paddingHorizontal: 16,
                      borderWidth: 1,
                      marginHorizontal: 8,
                      marginBottom: 16,
                      borderRadius: 10,
                      paddingVertical: 16,
                      borderColor: data.isSelected ? data.color : "#ddd",
                      backgroundColor: data.isSelected
                        ? data.color + "17"
                        : "#fff",
                      width: "100%"
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
                              color: element.color,
                              description: element.description,
                              icon: element.icon
                            },
                            value: 0
                          });
                        }
                      });
                      this.props.onValueChange({ keyValues: selectedValues });
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={exerciseIcons[data.icon]}
                        style={{
                          width: 24,
                          height: 24,
                          tintColor: data.color
                        }}
                      />
                      <Text
                        style={[
                          textStyles.GeneralTextBold,
                          {
                            color: data.color,
                            marginLeft: 12
                          }
                        ]}
                      >
                        {data.name}
                      </Text>
                    </View>
                    <Text style={[textStyles.ContentText, {marginTop: 8}]}>
                      {data.description}
                    </Text>
                  </TouchableOpacity>
                );
              });
            }
            return (
              <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingBottom: 24
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
