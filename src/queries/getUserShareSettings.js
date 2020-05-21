export const getUserShareSettings = `query getUserShareSettings($appId: String!){
    getUserShareSettings(appId:$appId){
      id
      therapistId
      therapistName
      meta {
        diaryCard
        meditation
        emotion
        journal
        exercise
        sleep
        practiceidea
        actMeasure
      }
      shareWithOrg
    }
  }`;
