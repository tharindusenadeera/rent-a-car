export const getExtension = path => {
  var basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
    // (supports `\\` and `/` separators)
    pos = basename.lastIndexOf("."); // get last position of `.`

  if (basename === "" || pos < 1)
    // if file name is empty or ...
    return ""; //  `.` not found (-1) or comes first (0)
  return basename.slice(pos + 1); // extract extension ignoring `.`
};

export const getDocumentIcon = type => {
  switch (type) {
    case "pdf":
      return "/images/document-icons/pdf.svg";

    case "doc":
      return "/images/document-icons/doc.svg";

    case "docx":
      return "/images/document-icons/doc.svg";

    case "xls":
      return "/images/document-icons/xls.svg";

    case "xlsx":
      return "/images/document-icons/xls.svg";

    default:
      return "/images/document-icons/other.svg";
  }
};
