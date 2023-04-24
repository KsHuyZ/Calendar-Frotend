import get_url_extension from "./getFileType";

function downloadfile(dataurl, filename) {
  const fileType = get_url_extension(dataurl);
  fetch(dataurl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      // create a URL for the downloaded file
      const url = URL.createObjectURL(blob);

      // create a link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.${fileType}`;

      // append the link to the DOM and trigger the download
      document.body.appendChild(link);
      link.click();

      // clean up the URL object
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

export default downloadfile;
