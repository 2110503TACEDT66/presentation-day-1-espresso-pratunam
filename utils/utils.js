//extract username from MONGO_URI
exports.getUsernameFromURI = (uri) => {
  const regex = /\/\/(.*):/;
  const match = uri.match(regex);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}

//extract Cluster name from MONGO_URI
exports.getAppNameFromURI = (uri) => {
  const regex = /appName=(\w+)/;
  const match = uri.match(regex);

  if (match) {
    return match[1];
  }else {
    return null;
  }
}
