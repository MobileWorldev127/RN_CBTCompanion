import { exerciseIcons, exerciseTypes } from "../constants";

export function removeEmptyData(exerciseData) {
  console.log("EXUERCISE DATA", exerciseData);
  let modifiedData = [];
  exerciseData.details.forEach(element => {
    if (element.type == "group" || element.type === exerciseTypes.FOLLOW) {
      let group = {
        type: element.type,
        title: element.title,
        icon: element.icon,
        details: []
      };
      element.details.forEach(detail => {
        if (containsValue(detail.value)) {
          group.details.push(detail);
        }
        if (detail.type == exerciseTypes.GROUPED_ITEMS) {
          let groupedItems = {
            ...detail,
            details: []
          };
          detail.details.forEach(groupedItem => {
            if (containsValue(groupedItem.value)) {
              groupedItems.details.push(groupedItem);
            }
          });
          if (groupedItems.details.length) {
            group.details.push(groupedItems);
          }
        }
      });
      if (group.details.length > 0) {
        group.icon = group.icon ? exerciseIcons[group.icon] : undefined;
        modifiedData.push(group);
      }
    } else {
      if (containsValue(element.value)) {
        modifiedData.push({
          ...element,
          icon: element.icon ? exerciseIcons[element.icon] : undefined
        });
      }
    }
  });
  console.log("MODIFIED DATA", modifiedData);
  return modifiedData;
}

const containsValue = value => {
  if (!value) {
    return false;
  }
  if (value.intValues && value.intValues.length) return true;
  if (value.stringValues && value.stringValues.length) return true;
  if (value.booleanValues && value.booleanValues.length) return true;
  if (value.keyValues && value.keyValues.length) return true;
  return false;
};

export function omitDeep(obj, key) {
  if (Array.isArray(obj)) return omitDeepArrayWalk(obj, key);
  const keys = Object.keys(obj);
  const newObj = {};
  keys.forEach(i => {
    if (i !== key) {
      const val = obj[i];
      if (Array.isArray(val)) newObj[i] = omitDeepArrayWalk(val, key);
      else if (typeof val === "object" && val !== null)
        newObj[i] = omitDeep(val, key);
      else newObj[i] = val;
    }
  });
  return newObj;
}

function omitDeepArrayWalk(arr, key) {
  return arr.map(val => {
    if (Array.isArray(val)) return omitDeepArrayWalk(val, key);
    else if (typeof val === "object") return omitDeep(val, key);
    return val;
  });
}

export function getAttachments(attachments) {
  let images = [];
  let audios = [];
  let videos = [];
  attachments.forEach(data => {
    switch (data.type) {
      case "image":
        images.push(data.media);
        break;
      case "audio":
        audios.push(data.media);
        break;
      case "video":
        videos.push(data.media);
        break;
    }
  });
  return {
    images,
    videos,
    audios
  };
}

export function convertAssetsToAttachments(assets) {
  let attachments = [];
  if (assets && assets.length) {
    assets[0].images.forEach(image => {
      attachments.push({
        type: "image",
        media: image
      });
    });
    assets[0].videos.forEach(image => {
      attachments.push({
        type: "video",
        media: image
      });
    });
    assets[0].audios.forEach(image => {
      attachments.push({
        type: "audio",
        media: image
      });
    });
  }
  return attachments;
}
