import AssessmentHistory from "./AssessmentHistory";
import { getUserAssessmentsByIdRequest } from "./../../actions/AssessmentActions";
import { withStore } from "../../utils/StoreUtils";

const mapStateToProps = state => {
  return {
    history: state.assessments.history
  };
};

const mapDispatchToProps = dispatch => ({
  getUserAssessmentsByIdRequest: id => {
    dispatch(getUserAssessmentsByIdRequest(id));
  }
});

export default withStore(
  AssessmentHistory,
  mapStateToProps,
  mapDispatchToProps
);
