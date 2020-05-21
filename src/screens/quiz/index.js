import QuizScreen from "./QuizScreen";
import {
  getAllQuizItemsRequest,
  setLastQuizDate
} from "./../../actions/QuizActions";
import { withStore } from "../../utils/StoreUtils";

const mapStateToProps = state => {
  return {
    quiz: state.quiz.quizItems
  };
};

const mapDispatchToProps = dispatch => ({
  getAllQuizItemsRequest: () => {
    dispatch(getAllQuizItemsRequest());
  },
  setLastQuizDate: date => {
    dispatch(setLastQuizDate(date));
  }
});

export default withStore(QuizScreen, mapStateToProps, mapDispatchToProps);
