import { PermissionsAndroid } from "react-native";

export const requestCameraPermission = async () => {
  return new Promise((resolve, reject) => {
    var permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ];
    PermissionsAndroid.requestMultiple(permissions)
      .then(granted => {
        resolve(granted);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
