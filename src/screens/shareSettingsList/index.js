import ShareSettingsListComponent from "./ShareSettingsListComponent";
import { getShareSettings } from "../../actions/ShareSettings";
import { withStore, withSubscriptionActions } from "../../utils/StoreUtils";

const mapStateToProps = state => {
  return {
    providerList: state.shareSettings.providerList
  };
};

const mapDispatchToProps = dispatch => ({
  getShareSettings: () => {
    dispatch(getShareSettings());
  }
});

export default withSubscriptionActions(
  ShareSettingsListComponent,
  mapStateToProps,
  mapDispatchToProps
);
