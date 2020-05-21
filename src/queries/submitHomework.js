export const submitHomeworkMutation = `mutation 
    submitHomework($homeworkId:String!, $appId :String!, $input: UserHomeworkReferenceInput!){
        submitHomework(homeworkId:$homeworkId, appId : $appId, input : $input){
            homeworkId
            userId
        }
    }
`;
