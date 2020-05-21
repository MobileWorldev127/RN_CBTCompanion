export const addShareMutation = `mutation addShareSetting($shareSetting: addShareSettingInput!){
    addShareSetting(shareSetting: $shareSetting) {
        id
    }
}`;
