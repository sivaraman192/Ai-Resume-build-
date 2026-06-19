/**
 * Exports resume data as a JSON file and triggers a browser download.
 * @param {Object} resumeData 
 */
export const exportResumeJSON = (resumeData) => {
  if (!resumeData) return;

  // Clean data to make it portable (remove database specific keys)
  const cleanData = JSON.parse(JSON.stringify(resumeData));
  
  // Clean DB keys to ensure it imports as a new/clean structure if needed
  delete cleanData._id;
  delete cleanData.userId;
  delete cleanData.createdAt;
  delete cleanData.updatedAt;
  delete cleanData.__v;
  delete cleanData.versions;

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(cleanData, null, 2)
  )}`;
  
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  
  const name = cleanData.personalInfo?.fullName || cleanData.title || 'resume';
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('download', `${cleanName}_backup.json`);
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Reads a JSON file uploaded by the user and parses it.
 * @param {File} file 
 * @returns {Promise<Object>}
 */
export const importResumeJSON = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('Invalid file type. Please select a .json file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (err) {
        reject(new Error('Failed to parse JSON file. The file may be corrupted.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading the backup file.'));
    };
    reader.readAsText(file);
  });
};
