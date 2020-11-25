/**
 *
 * @param {file} file
 * @param {function} callback
 */
const getOrientation = (file, nameFile, callback) => {
  var reader = new FileReader();
  reader.onload = e => {
    var view = new DataView(e.target.result);
    if (view.getUint16(0, false) !== 0xffd8) {
      return callback(-2);
    }
    var length = view.byteLength,
      offset = 2;
    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        if (view.getUint32((offset += 2), false) !== 0x45786966) {
          return callback(-1);
        }

        var little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) === 0x0112) {
            return callback(view.getUint16(offset + i * 12 + 8, little));
          }
        }
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
};

/**
 * Function to generate File Name
 */
const generateFileName = () => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

const trimFileExtension = filename => {
  return filename
    .split(".")
    .slice(0, -1)
    .join(".");
};

/**
 *
 * @param {Base64 String} dataurl
 * @param {File Name} filename
 * @param {Settings} settings
 */
const dataURLtoFile = (dataurl, filename, mimetype) => {
  var arr = dataurl.split(","),
    //mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const fileObj = new File([u8arr], filename, { type: mimetype });
  return fileObj;
};

/**
 *
 * @param {DataUrl} dataurl
 * @param {Image Orientation} orientation
 * @param {Settings} settings
 * @param {Callback function} callback
 */
const fixImageRotation = (dataurl, orientation, settings, callback) => {
  const img = new Image();

  img.src = dataurl;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // canvas.width = img.width;
    // canvas.height = img.height;
    let width = img.width;
    let height = img.height;

    ctx.save();
    //var width = canvas.width;
    //var styleWidth = canvas.style.width;
    //var height = canvas.height;
    // var styleHeight = canvas.style.height;
    // if (imgOrientation) {
    //   if (imgOrientation > 4) {
    //     canvas.width = height;
    //     canvas.style.width = styleHeight;
    //     canvas.height = width;
    //     canvas.style.height = styleWidth;
    //   }
    //   switch (imgOrientation) {
    //     case 2:
    //       ctx.translate(width, 0);
    //       ctx.scale(-1, 1);
    //       break;
    //     case 3:
    //       ctx.translate(width, height);
    //       ctx.rotate(Math.PI);
    //       break;
    //     case 4:
    //       ctx.translate(0, height);
    //       ctx.scale(1, -1);
    //       break;
    //     case 5:
    //       ctx.rotate(0.5 * Math.PI);
    //       ctx.scale(1, -1);
    //       break;
    //     case 6:
    //       ctx.rotate(0.5 * Math.PI);
    //       ctx.translate(0, -height);
    //       break;
    //     case 7:
    //       ctx.rotate(0.5 * Math.PI);
    //       ctx.translate(width, -height);
    //       ctx.scale(-1, 1);
    //       break;
    //     case 8:
    //       ctx.rotate(-0.5 * Math.PI);
    //       ctx.translate(-width, 0);
    //       break;
    //     default:
    //       break;
    //   }
    // }
    if (4 < orientation && orientation < 9) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        break;
    }
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    const dataURL = ctx.canvas.toDataURL(settings.mimeType, settings.quality);
    callback(dataURL);
  };
};

/**
 *
 * @param {file} file
 */
const compress = (file, nameFile, settings, callback) => {
  const COMPRESS_DEFAULT = {
    width: settings.width ? settings.width : null,
    height: settings.height ? settings.height : null,
    quality: settings.quality ? settings.quality : 1,
    //mimeType: settings.mimeType ? settings.mimeType : file.type
    mimeType: "image/jpeg"
  };
  getOrientation(file, nameFile, orientation => {
    // let fileName = trimFileExtension(file.name);
    let fileName = "Ryde";
    fileName = `${fileName}.jpeg`;
    const generatedText = generateFileName();
    fileName = `${generatedText}${fileName}`;
    if (nameFile) {
      fileName = nameFile;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (COMPRESS_DEFAULT.height && COMPRESS_DEFAULT.width) {
          if (
            img.height > COMPRESS_DEFAULT.height &&
            img.width > COMPRESS_DEFAULT.width
          ) {
            // portrait
            if (img.height > img.width) {
              width = COMPRESS_DEFAULT.height;
              height = COMPRESS_DEFAULT.width;
            }
            // landscape
            if (img.width > img.height) {
              width = COMPRESS_DEFAULT.width;
              height = COMPRESS_DEFAULT.height;
            }
            // square
            if (COMPRESS_DEFAULT.height === COMPRESS_DEFAULT.width) {
              width = COMPRESS_DEFAULT.width;
              height = COMPRESS_DEFAULT.height;
            }
          }
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        let compressed_file = ctx.canvas.toDataURL(
          COMPRESS_DEFAULT.mimeType,
          COMPRESS_DEFAULT.quality
        );

        fixImageRotation(
          compressed_file,
          orientation,
          COMPRESS_DEFAULT,
          rotatedFile => {
            let fileObj = dataURLtoFile(
              rotatedFile,
              fileName,
              COMPRESS_DEFAULT.mimeType
            );
            callback(fileObj);
          }
        );
      };
    };
    reader.onerror = error => {
      console.log("file reader error", error);
    };
  });
};

export {
  compress,
  fixImageRotation,
  dataURLtoFile,
  getOrientation,
  trimFileExtension
};
