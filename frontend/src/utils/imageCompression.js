import imageCompression from 'browser-image-compression';

/**
 * Compress and resize an image file to max 1MB and max dimension 2048px.
 * @param {File} file
 * @returns {Promise<File>} compressed image file with correct name and extension
 */
export async function compressImage(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
  };

  try {
    const compressedBlob = await imageCompression(file, options);

    // Получаем расширение файла (по умолчанию original)
    const extension = file.name.split('.').pop();
    const newFileName = file.name;

    // Создаём новый File с нужным именем и расширением
    const compressedFile = new File([compressedBlob], newFileName, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });

    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
}
