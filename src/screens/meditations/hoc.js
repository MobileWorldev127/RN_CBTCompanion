import React, { Component } from "react";
import { getAmplifyConfig, getEnvVars } from "../../constants";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { getMeditationsByAuthor } from "../../queries/getMeditationsByAuthor";
import { getAuthors } from "../../queries/getAuthors";
import { getThemes } from "../../queries/getThemes";
import { showMessage } from "react-native-flash-message";
import { errorMessage, showApiError } from "../../utils";
import { getMeditationsByTheme } from "../../queries/getMeditationsByTheme";
import { swasthCommonsClient } from "../../App";

export default withData = Component => {
  const myAppConfig = getAmplifyConfig(
    getEnvVars().SWASTH_COMMONS_ENDPOINT_URL
  );
  return class extends Component {
    state = {
      authors: {
        data: [],
        loading: false
      },
      meditations: {
        data: [],
        loading: false
      },
      themes: {
        data: [],
        loading: false
      }
    };
    componentDidMount() {
      this.getAuthors();
      this.getThemes();
    }
    getAuthors = () => {
      swasthCommonsClient
        .watchQuery({
          query: getAuthors,
          fetchPolicy: "cache-and-network"
        })
        .subscribe({
          next: response => {
            console.log(response);
            let authors = this.state.authors;
            if (response.data) {
              authors.data = response.data.getAuthors;
            }
            this.setState({ authors });
          },
          error: err => {
            console.log(err);
            showApiError();
          }
        });
    };

    getThemes = () => {
      let themes = this.state.themes;
      themes.loading = true;
      this.setState({ themes });
      swasthCommonsClient
        .watchQuery({
          query: getThemes,
          fetchPolicy: "cache-and-network"
        })
        .subscribe({
          next: respose => {
            if (respose.data) {
              themes = {
                data: respose.data.getThemes,
                loading: false
              };
              this.setState({ themes });
            }
          },
          error: err => {
            console.log(err);
            showApiError();
          }
        });
    };

    getMeditationsByAuthor = author => {
      let meditations = this.state.meditations;
      meditations.loading = true;
      this.setState({ meditations });
      swasthCommonsClient
        .watchQuery({
          query: getMeditationsByAuthor,
          variables: { author },
          fetchPolicy: "cache-and-network"
        })
        .subscribe({
          next: response => {
            if (response.data) {
              meditations = {
                data: response.data.getMeditationsByAuthor,
                loading: false
              };
              this.setState({ meditations });
            }
          },
          error: err => {
            console.log(err);
            showApiError();
          }
        });
    };

    getMeditationsByTheme = theme => {
      let meditations = this.state.meditations;
      meditations.loading = true;
      this.setState({ meditations });
      swasthCommonsClient
        .watchQuery({
          query: getMeditationsByTheme,
          variables: { theme }
        })
        .subscribe({
          next: response => {
            console.log(
              "---MEDITATIONS---",
              response.data.getMeditationsByTheme
            );
            meditations = {
              data: response.data.getMeditationsByTheme,
              loading: false
            };
            this.setState({ meditations });
          },
          error: err => {
            console.log(err);
            showApiError();
          }
        });
    };

    render() {
      const { authors, meditations, themes } = this.state;
      return (
        <Component
          authors={authors}
          meditations={meditations}
          themes={themes}
          getAuthors={this.getAuthors}
          getByAuthor={this.getMeditationsByAuthor}
          getByTheme={this.getMeditationsByTheme}
          {...this.props}
        />
      );
    }
  };
};
