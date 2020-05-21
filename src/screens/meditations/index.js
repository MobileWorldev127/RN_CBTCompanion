import React, { Component, Fragment } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { mainStyles as styles } from "./styles";
// import Header from '../../components/header';
import Authors from "./authors";
import MeditationList from "./meditationlist";
import ThemeList from "./themelist";
import withData from "./hoc";
import LinearGradient from "react-native-linear-gradient";
import ThemeStyle from "./../../styles/ThemeStyle";
import Icon from "react-native-vector-icons/Ionicons";
import Header from "./../../components/Header";
import { recordScreenEvent, screenNames } from "../../utils/AnalyticsUtils";

class Meditation extends Component {
  state = {
    selected: "all"
  };
  onSelect = (type, name) => {
    if (type === "author") {
      this.props.getByAuthor(name);
    } else {
      this.props.getByTheme(name);
    }
    this.setState({ selected: name });
  };
  render() {
    const { authors, meditations, themes, navigation } = this.props;
    const { selected } = this.state;
    let { params } = navigation.state;
    let isBack = params && params.isBack;
    recordScreenEvent(screenNames.meditation, {
      category: this.state.selected
    });
    return (
      <Fragment>
        <Header
          isDrawer={isBack ? false : true}
          openDrawer={() => {
            this.props.navigation.openDrawer();
          }}
          goBack={isBack ? () => navigation.goBack(null) : undefined}
          title={"Meditations"}
        />
        <View style={styles.container}>
          <View style={{ backgroundColor: "#fff" }}>
            <Authors authors={authors} getByAuthor={this.onSelect} />
          </View>
          {selected === "all" ? (
            <ThemeList themes={themes} onSelect={this.onSelect} />
          ) : (
            <MeditationList
              meditations={meditations}
              selected={this.state.selected}
            />
          )}
        </View>
      </Fragment>
    );
  }
}

export default withData(Meditation);
