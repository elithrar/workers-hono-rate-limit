// src/utils/filepath.ts
var getFilePath = (options) => {
  let filename = options.filename;
  if (/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(filename)) {
    return;
  }
  let root = options.root || "";
  const defaultDocument = options.defaultDocument || "index.html";
  if (filename.endsWith("/")) {
    filename = filename.concat(defaultDocument);
  } else if (!filename.match(/\.[a-zA-Z0-9]+$/)) {
    filename = filename.concat("/" + defaultDocument);
  }
  filename = filename.replace(/^\.?[\/\\]/, "");
  filename = filename.replace(/\\/, "/");
  root = root.replace(/\/$/, "");
  let path = root ? root + "/" + filename : filename;
  path = path.replace(/^\.?\//, "");
  return path;
};
export {
  getFilePath
};
