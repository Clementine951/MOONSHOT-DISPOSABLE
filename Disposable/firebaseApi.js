const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/disposablecamera-5c3fa/databases/(default)/documents`;
const API_KEY = "AIzaSyBWXnvNsQ7A5qAP0qMvVQx7YlD8htZU6LA";

/**
 * Generic Firestore API Request
 * @param {string} path - The Firestore path (e.g., 'collection/documentId').
 * @param {string} method - The HTTP method ('GET', 'POST', 'PATCH', 'DELETE').
 * @param {Object} [body] - The request payload (for POST or PATCH).
 * @returns {Promise<Object>} - The response from Firestore API.
 */
async function firestoreRequest(path, method = 'GET', body = null) {
  const url = `${FIRESTORE_BASE_URL}/${path}?key=${API_KEY}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || 'Firestore API error');
  }

  return response.json();
}

/**
 * Fetch data from Firestore
 * @param {string} path - The Firestore path (e.g., 'collection/documentId').
 * @returns {Promise<Object>} - The Firestore document data.
 */
export async function fetchFirestoreData(path) {
  return await firestoreRequest(path);
}

/**
 * Add a document to Firestore
 * @param {string} collectionPath - The collection path (e.g., 'collectionName').
 * @param {Object} data - The document data to add.
 * @returns {Promise<Object>} - The added Firestore document.
 */
export async function addFirestoreDocument(path, data) {
  // Ensure the path includes both collection and document ID
  if (!path.includes('/')) {
    throw new Error(`Invalid Firestore path: "${path}". Must include both collection and document ID.`);
  }

  return await firestoreRequest(path, 'PATCH', { fields: data }); // Use PATCH for creating/updating
}


/**
 * Update a document in Firestore
 * @param {string} documentPath - The document path (e.g., 'collectionName/documentId').
 * @param {Object} data - The document data to update.
 * @returns {Promise<Object>} - The updated Firestore document.
 */
export async function updateFirestoreDocument(documentPath, data) {
  return await firestoreRequest(documentPath, 'PATCH', { fields: data });
}

/**
 * Delete a document from Firestore
 * @param {string} documentPath - The document path (e.g., 'collectionName/documentId').
 * @returns {Promise<void>} - Resolves when the document is deleted.
 */
export async function deleteFirestoreDocument(documentPath) {
  await firestoreRequest(documentPath, 'DELETE');
}
