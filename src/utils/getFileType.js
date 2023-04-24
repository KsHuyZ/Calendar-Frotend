function get_url_extension(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}
export default get_url_extension;
