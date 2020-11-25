import S3 from "aws-s3";
import { BUCKET_OPTIONS } from "../../../consts/consts";

const fileUpload = (file, callback, folder = null) => {
  console.log("uploading file -----------", file);

  if (folder) {
    BUCKET_OPTIONS.dirName = folder;
  }

  const S3Client = new S3(BUCKET_OPTIONS);
  S3Client.uploadFile(file)
    .then(res => {
      callback(res);
    })
    .catch(err => console.error("err", err));
};

export { fileUpload };
