/**
 * @description - A helper for converting data into a file blob w/ a custom mimetype.
 * @param {Blob|Response Object} data - Any transformable data type that can be converted to a blob. Typically a response object or blob.
 * @param {String} mimeType - A custom mimetype used to set the new Blob instance to.
 * @returns {Blob} - returns a file blob, w/ a custom mimetype.
 */
const createBlob = (
	data: BlobPart,
	mimeType: string = "application/octet-stream"
): Blob => {
	return new Blob([data], { type: mimeType });
};

/**
 * @description - Utility that accepts a file blob and creates an object URL.
 * @param {Blob} blob - A file blob to be used for an object URL.
 */
const createURL = (blob: Blob | MediaSource) => {
	const fileURL = window.URL.createObjectURL(blob);
	return fileURL;
};

/**
 * @description - A utility for creating an object URI to trigger a file download to a user's machine.
 * @param {Blob} blob - A file blob, typically transformed from the HTTP response object
 * @param {String} filename - A custom filename used for saving the file to a user's machine.
 * @returns {Blob} - Returns a fileblob that's immediately downloaded to a user's machine.
 */
const saveFile = (blob: Blob | MediaSource, filename: string) => {
	const fileURL = window.URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = fileURL;
	link.download = filename;
	link.click();
	return window.URL.revokeObjectURL(fileURL);
};

export { createBlob, createURL, saveFile };
