export const editShareMutation = `mutation editShareSetting($id: String!, $meta: MetaInput!, $shareWithOrg: Boolean!){
  editShareSetting(
      id: $id,
      meta: $meta,
      shareWithOrg: $shareWithOrg
    ) {
      id
      meta {
        activity
        journal
        target
        skill
      }
      therapistId
      shareWithOrg
    }
  }`;
