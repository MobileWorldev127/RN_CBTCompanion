import { Platform } from 'react-native';

//root directory of application
export const WebAppDomainRoot = 'http://35.154.173.197/api/';
export const WebRoot          = 'http://35.154.173.197/api/';
export const TimeOutMilliSeconds = 10000;

export function fetchGetObject()
{
    return({
      method: "GET",
      cache: 'no-cache',
      headers: {},
      redirect: 'error',
      follow: 0,
      timeout: TimeOutMilliSeconds,
      compress: false,
      size: 0,
    });
}

export function fetchPostObject(bodyData = null)
{
  return ({
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(bodyData),
    redirect: 'error',
    follow: 0,
    timeout: TimeOutMilliSeconds,
    compress: false,
    size: 0,
  });
}

export default LINKS =
{
  //////////////////////////services///////////////////////////////////
  webRoot                       : WebRoot,

  verifyNumberUrl               : WebAppDomainRoot + 'verifyNumber',
  //loginServiceUrl               : WebAppDomainRoot + '',
  updateProfileService          : WebAppDomainRoot + 'updateUserInfo',
  editProfileService            : WebAppDomainRoot + 'userProfile?_format=json',
  updateUserImageService        : WebAppDomainRoot + 'UserProfileImage?_format=json',
  getTopicSubjectsSuggestion    : WebAppDomainRoot + 'getTopicsSubjectsSuggestion?_format=json&search_string=a&type=1',
  getRecommendedNotes           : WebAppDomainRoot + 'getRecommendations?_format=json&topic=edbox',

};
