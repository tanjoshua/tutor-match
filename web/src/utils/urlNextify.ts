// This function helps to convert a url into a next parameter for a url
const urlNextify = (url) => {
  if (!url) {
    return "";
  } else {
    return `?next=${url}`;
  }
};

export default urlNextify;
