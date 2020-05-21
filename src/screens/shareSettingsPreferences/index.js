import ShareSettingsPreferences from "./ShareSettingsPreferences";
import { getShareSettings } from "../../actions/ShareSettings";
import { withStore } from "../../utils/StoreUtils";

const mapStateToProps = state => {};

const mapDispatchToProps = dispatch => ({
  getShareSettings: () => {
    dispatch(getShareSettings());
  }
});

export default withStore(
  ShareSettingsPreferences,
  mapStateToProps,
  mapDispatchToProps
);
