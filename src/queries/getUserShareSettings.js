export const getUserShareSettings = `query getUserShareSettings($appId: String!){
    getUserShareSettings(appId:$appId){
      id
      therapistId
      therapistName
      meta {
        skill
        target
        activity
        diaryCard
        emotion
        journal
        exercise
        sleep
        practiceidea
        actMeasure
        meditation
        nutrition
        heartRate
      }
      shareWithOrg
    }
  }`;
