import { createDrawerNavigator } from "react-navigation-drawer";
import NewScreen from "../screens/NewScreen";
import LoginScreen from "../screens/LoginScreen";
import TabNav from "../screens/TabComponents";
import Drawermenu from "../screens/Drawermenu";
import SignUpScreen from "../screens/SignUpScreen";
import Record from "./../screens/TabComponents/Record";
import Emotions from "../screens/Emotions";
import Summary from "./../screens/TabComponents/Summary";
import Graph from "./../screens/TabComponents/Graph";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import JournalScreen from "../screens/JournalScreen";
import SettingScreen from "../screens/SettingScreen";
import ReminderScreen from "./../screens/settings/reminder";
import AffirmationScreen from "../screens/AffirmationScreen";
import EditProfileScreen from "../screens/settings/profile";
import MedicationScreen from "./../screens/MedicationScreen";
import QuizAlertScreen from "../screens/QuizAlertScreen";
import QuizConfirmationScreen from "../screens/QuizConfirmationScreen";
import ExerciseReviewScreen from "../screens/ExerciseReviewScreen";
import ExerciseScreen from "./../screens/ExerciseScreen";
import LessonsModule from "./../screens/lessons/LessonsScreen";
import LessonsContent from "./../screens/lessons/LessonsContent";
import LessonsCard from "./../screens/lessons/LessonsCard";
import ExerciseSettings from "./../screens/settings/ExerciseSettings";
import AssessmentsScreen from "./../screens/assessments";
import AssessmentHistory from "./../screens/assessmentHistory";
import Onboarding from "./../screens/tour";
import QuizScreen from "./../screens/quiz";
import ImageViewer from "./../screens/ViewImage";
import ForgotPasswordScreen from "./../screens/forgotPassword";
import ShareSettingsList from "./../screens/shareSettingsList";
import ShareSettingsPreferences from "./../screens/shareSettingsPreferences";
import ShareSettingsVerification from "./../screens/shareSettingsVerification/ShareSettingsVerification";
import PINCodeScreen from "./../screens/PINCodeScren";
import HomeworkScreen from "./../screens/homework/HomeworkScreen";
import MeditationPlay from "./../screens/meditations/meditationPlay";
import ACTMeasuresScreen from "./../screens/ACTMeasuresScreen";
import ACTMeasuresHistoryScreen from "./../screens/actMeasures/ACTMeasuresHistoryScreen";
import NotesScreen from "../screens/notes";
import SingleNoteScreen from "../screens/notes/SingleNoteScreen";
import ExerciseHistoryScreen from "../screens/exercise/ExerciseHistoryScreen";
import ExerciseByModules from "./../screens/exercise/ExercisesOfModuleScreen";
import PracticeIdeasListScreen from "../screens/practiceIdeas/PracticeIdeasListScreen";
import PracticeIdeaReview from "../screens/practiceIdeas/PracticeIdeaReview";
import MeditationScreen from "../screens/meditations";
import EntryPreferencesScreen from "../screens/settings/EntryPreferences";
import FavoritesScreen from "../screens/favourites/FavoritesScreen";
import PracticeIdeasScreen from "../screens/practiceIdeas/PracticeIdeaScreen";
import AboutScreen from "../screens/AboutScreen";
import FaqScreen from "../screens/FaqScreen";
import BrowseGroupsScreen from "../screens/community/peerGroups/BrowseGroupsScreen";
import JoinGroupScreen from "../screens/community/peerGroups/JoinGroupScreen";
import PeerGroupChatScreen from "../screens/community/peerGroups/PeerGroupChatScreen";
import CreatePeerGroupScreen from "../screens/community/peerGroups/CreatePeerGroupScreen";
import DiscussionPostsScreen from "../screens/community/discussions/DiscussionPostsScreen";
import CommunityScreen from "../screens/community/CommunityScreen";
import DiscussionViewScreen from "../screens/community/discussions/DiscussionViewScreen";
import HomeScreen from "../screens/TabComponents/HomeScreen";
import FollowUpScreen from "../screens/FollowUpScreen";
import ExerciseModules from "../screens/exercise/ExerciseListScreen";
import LogFoodScreen from "../screens/TabComponents/LogFoodScreen";
import FoodAddScreen from "../screens/TabComponents/FoodAddScreen";
import FoodDetailScreen from "../screens/TabComponents/FoodDetailScreen";
import FoodCaloriesDetailScreen from "../screens/TabComponents/FoodCaloriesDetailScreen";
import LogExerciseScreen from "../screens/TabComponents/LogExerciseScreen";
import ExerciseAddScreen from "../screens/TabComponents/ExerciseAddScreen";
import SleepAddScreen from "../screens/TabComponents/SleepAddScreen";
import { App } from "./../screens/BreathingExcercise/components/App/App";
import DeviceListSceen from "../screens/settings/DeviceListSceen";
import SourceSettingsScreen from "../screens/settings/SourceSettingsScreen";
const DrawerRoutes = createDrawerNavigator(
  {
    TabNav: { screen: TabNav }
    // PaymentScreen: {screen: PaymentScreen},
  },
  {
    drawerWidth: 250,
    drawerPosition: "left",
    drawerType: "slide",
    contentComponent: Drawermenu,
    initialRouteName: "TabNav",
    overlayColor: "#0000",
    unmountInactiveRoutes: true
  }
);

const Routes = {
  NewScreen: {
    screen: NewScreen,
    navigationOptions: {
      header: null
    }
  },

  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      header: null
    }
  },

  SignUpScreen: {
    screen: SignUpScreen,
    navigationOptions: {
      header: null
    }
  },

  DrawerRoutes: {
    screen: DrawerRoutes,
    navigationOptions: {
      header: null
    }
  },

  SettingScreen: {
    screen: SettingScreen,
    navigationOptions: {
      header: null
    }
  },

  ReminderScreen: {
    screen: ReminderScreen,
    navigationOptions: {
      header: null
    }
  },

  AffirmationScreen: {
    screen: AffirmationScreen,
    navigationOptions: {
      header: null
    }
  },

  EditProfileScreen: {
    screen: EditProfileScreen,
    navigationOptions: {
      header: null
    }
  },

  QuizAlertScreen: {
    screen: QuizAlertScreen,
    navigationOptions: {
      header: null
    }
  },

  QuizConfirmationScreen: {
    screen: QuizConfirmationScreen,
    navigationOptions: {
      header: null
    }
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null
    }
  },
  LogFood: {
    screen: LogFoodScreen,
    navigationOptions: {
      header: null
    }
  },
  FoodAdd: {
    screen: FoodAddScreen,
    navigationOptions: {
      header: null
    }
  },
  FoodDetail: {
    screen: FoodDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  FoodCaloriesDetail: {
    screen: FoodCaloriesDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  FollowUpScreen: {
    screen: FollowUpScreen,
    navigationOptions: {
      header: null
    }
  },
  Emotions: {
    screen: Emotions,
    navigationOptions: {
      header: null
    }
  },
  RecordScreen: {
    screen: Record,
    navigationOptions: {
      header: null
    }
  },
  ActivitiesScreen: {
    screen: ActivitiesScreen,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  MedicationScreen: {
    screen: MedicationScreen,
    navigationOptions: {
      header: null
    }
  },
  ExerciseScreen: {
    screen: ExerciseScreen,
    navigationOptions: {
      header: null
    }
  },
  ExerciseReviewScreen: {
    screen: ExerciseReviewScreen,
    navigationOptions: {
      header: null
    }
  },
  JournalScreen: {
    screen: JournalScreen,
    navigationOptions: {
      header: null
    }
  },
  LessonsContent: {
    screen: LessonsContent,
    navigationOptions: {
      header: null
    }
  },
  LessonsCard: {
    screen: LessonsCard,
    navigationOptions: {
      header: null
    }
  },
  ExerciseSettings: {
    screen: ExerciseSettings,
    navigationOptions: {
      header: null
    }
  },
  AssessmentsScreen: {
    screen: AssessmentsScreen,
    navigationOptions: {
      header: null
    }
  },
  AssessmentHistory: {
    screen: AssessmentHistory,
    navigationOptions: {
      header: null
    }
  },
  Onboarding: {
    screen: Onboarding,
    navigationOptions: {
      header: null
    }
  },
  QuizScreen: {
    screen: QuizScreen,
    navigationOptions: {
      header: null
    }
  },
  ImageViewer: {
    screen: ImageViewer,
    navigationOptions: {
      header: null
    }
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: {
      header: null
    }
  },
  ShareSettingsList: {
    screen: ShareSettingsList,
    navigationOptions: {
      header: null
    }
  },
  ShareSettingsPreferences: {
    screen: ShareSettingsPreferences,
    navigationOptions: {
      header: null
    }
  },
  ShareSettingsVerification: {
    screen: ShareSettingsVerification,
    navigationOptions: {
      header: null
    }
  },
  PINCodeScreen: {
    screen: PINCodeScreen,
    navigationOptions: {
      header: null
    }
  },
  HomeworkScreen: {
    screen: HomeworkScreen,
    navigationOptions: {
      header: null
    }
  },
  MeditationPlay: {
    screen: MeditationPlay,
    navigationOptions: {
      header: null
    }
  },
  ACTMeasuresScreen: {
    screen: ACTMeasuresScreen,
    navigationOptions: {
      header: null
    }
  },
  ACTMeasuresHistoryScreen: {
    screen: ACTMeasuresHistoryScreen,
    navigationOptions: {
      header: null
    }
  },
  Summary: {
    screen: Summary,
    navigationOptions: {
      header: null
    }
  },
  GraphScreen: {
    screen: Graph,
    navigationOptions: {
      header: null
    }
  },
  ExerciseByModules: {
    screen: ExerciseByModules,
    navigationOptions: {
      header: null
    }
  },
  LessonsModule: {
    screen: LessonsModule,
    navigationOptions: {
      header: null
    }
  },

  PracticeIdeasScreen: {
    screen: PracticeIdeasScreen,
    navigationOptions: {
      header: null
    }
  },
  NotesScreen: {
    screen: NotesScreen,
    navigationOptions: {
      header: null
    }
  },
  SingleNoteScreen: {
    screen: SingleNoteScreen,
    navigationOptions: {
      header: null
    }
  },
  ExerciseHistoryScreen: {
    screen: ExerciseHistoryScreen,
    navigationOptions: {
      header: null
    }
  },
  PracticeIdeaReviewScreen: {
    screen: PracticeIdeaReview,
    navigationOptions: {
      header: null
    }
  },
  MeditationScreen: {
    screen: MeditationScreen,
    navigationOptions: {
      header: null
    }
  },
  EntryPreferencesScreen: {
    screen: EntryPreferencesScreen,
    navigationOptions: {
      header: null
    }
  },
  FavoritesScreen: {
    screen: FavoritesScreen,
    navigationOptions: {
      header: null
    }
  },
  PracticeIdeasListScreen: {
    screen: PracticeIdeasListScreen,
    navigationOptions: {
      header: null
    }
  },
  AboutScreen: {
    screen: AboutScreen,
    navigationOptions: {
      header: null
    }
  },
  FaqScreen: {
    screen: FaqScreen,
    navigationOptions: {
      header: null
    }
  },
  BrowseGroupsScreen: {
    screen: BrowseGroupsScreen,
    navigationOptions: {
      header: null
    }
  },
  JoinGroupScreen: {
    screen: JoinGroupScreen,
    navigationOptions: {
      header: null
    }
  },
  PeerGroupChatScreen: {
    screen: PeerGroupChatScreen,
    navigationOptions: {
      header: null
    }
  },
  CreatePeerGroupScreen: {
    screen: CreatePeerGroupScreen,
    navigationOptions: {
      header: null
    }
  },
  DiscussionPostsScreen: {
    screen: DiscussionPostsScreen,
    navigationOptions: {
      header: null
    }
  },
  CommunityScreen: {
    screen: CommunityScreen,
    navigationOptions: {
      header: null
    }
  },
  DiscussionViewScreen: {
    screen: DiscussionViewScreen,
    navigationOptions: {
      header: null
    }
  },
  ExerciseModules: {
    screen: ExerciseModules,
    navigationOptions: {
      header: null
    }
  },
  LogExercise: {
    screen: LogExerciseScreen,
    navigationOptions: {
      header: null
    }
  },
  ExerciseAdd: {
    screen: ExerciseAddScreen,
    navigationOptions: {
      header: null
    }
  },
  SleepAdd: {
    screen: SleepAddScreen,
    navigationOptions: {
      header: null
    }
  },
  ExcerciseBreathingScreen: {
    screen: App,
    navigationOptions: {
      header: null
    }
  },
  DeviceList: {
    screen: DeviceListSceen,
    navigationOptions: {
      header: null
    }
  },
  SourceSettings: {
    screen: SourceSettingsScreen,
    navigationOptions: {
      header: null
    }
  }
};

export default Routes;
