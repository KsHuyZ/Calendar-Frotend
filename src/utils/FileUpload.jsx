export const fileUpload = async (image) => {
    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "o9wqtpvu");
    formData.append("cloud_name", "nopeee");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/nopeee/auto/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await res.json();
    return data
    // return data.secure_url;original_filename
};