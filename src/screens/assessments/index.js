import AssessmentsScreen from "./AssessmentsScreen";
import { getUserSceduledAssessmentsRequest } from "./../../actions/AssessmentActions";
import { withStore, withSafeAreaActions } from "../../utils/StoreUtils";

const mapStateToProps = state => {
  return {
    assessments: state.assessments.assessments
  };
};

const mapDispatchToProps = dispatch => ({
  getUserSceduledAssessmentsRequest: () => {
    dispatch(getUserSceduledAssessmentsRequest());
  }
});

export default withSafeAreaActions(
  AssessmentsScreen,
  mapStateToProps,
  mapDispatchToProps
);
