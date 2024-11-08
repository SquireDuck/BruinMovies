{
    /* cropImageHelper.js */
}

export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject("Canvas is empty");
                    return;
                }
                blob.name = "cropped.jpg";
                const fileUrl = URL.createObjectURL(blob);
                resolve(fileUrl);
            }, "image/jpeg");
        };
        image.onerror = (error) => reject(error);
    });
};
