import { getAccessToken } from './firebase-auth.js';

/**
 * Firestore REST API Client using Google Service Account (*admin.json)
 */
export class FirestoreRestClient {
  constructor(projectId) {
    this.projectId = projectId;
    this.baseUrl = null;
    this.auth = null;
  }

  async init() {
    this.auth = await getAccessToken();
    this.projectId = this.projectId || this.auth.projectId;
    this.baseUrl = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents`;
  }

  async _request(endpoint, options = {}) {
    if (!this.auth) await this.init();

    const headers = {
      Authorization: `Bearer ${this.auth.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Firestore REST API Error (${res.status}): ${err}`);
    }

    return res.json();
  }

  /**
   * Helper to convert JS Object into Firestore REST document fields format
   */
  static toFirestoreFields(obj) {
    const fields = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val === null || val === undefined) {
        fields[key] = { nullValue: null };
      } else if (typeof val === 'string') {
        fields[key] = { stringValue: val };
      } else if (typeof val === 'boolean') {
        fields[key] = { booleanValue: val };
      } else if (typeof val === 'number') {
        if (Number.isInteger(val)) {
          fields[key] = { integerValue: val.toString() };
        } else {
          fields[key] = { doubleValue: val };
        }
      } else if (Array.isArray(val)) {
        fields[key] = {
          arrayValue: {
            values: val.map((item) => {
              if (typeof item === 'string') return { stringValue: item };
              if (typeof item === 'number') return { integerValue: item.toString() };
              return { stringValue: JSON.stringify(item) };
            }),
          },
        };
      } else if (typeof val === 'object') {
        fields[key] = { mapValue: { fields: FirestoreRestClient.toFirestoreFields(val) } };
      }
    }
    return fields;
  }

  /**
   * Helper to convert Firestore REST document fields back to JS Object
   */
  static fromFirestoreFields(fields = {}) {
    const obj = {};
    for (const [key, val] of Object.entries(fields)) {
      if ('stringValue' in val) obj[key] = val.stringValue;
      else if ('integerValue' in val) obj[key] = parseInt(val.integerValue, 10);
      else if ('doubleValue' in val) obj[key] = parseFloat(val.doubleValue);
      else if ('booleanValue' in val) obj[key] = val.booleanValue;
      else if ('nullValue' in val) obj[key] = null;
      else if ('arrayValue' in val) {
        obj[key] = (val.arrayValue.values || []).map((v) => {
          if ('stringValue' in v) return v.stringValue;
          if ('integerValue' in v) return parseInt(v.integerValue, 10);
          return v;
        });
      } else if ('mapValue' in val) {
        obj[key] = FirestoreRestClient.fromFirestoreFields(val.mapValue.fields);
      }
    }
    return obj;
  }

  /**
   * List all documents in a collection
   */
  async listDocuments(collection) {
    const data = await this._request(`/${collection}`);
    if (!data.documents) return [];
    return data.documents.map((doc) => ({
      id: doc.name.split('/').pop(),
      ...FirestoreRestClient.fromFirestoreFields(doc.fields),
    }));
  }

  /**
   * Get single document by ID
   */
  async getDocument(collection, docId) {
    const doc = await this._request(`/${collection}/${docId}`);
    return {
      id: doc.name.split('/').pop(),
      ...FirestoreRestClient.fromFirestoreFields(doc.fields),
    };
  }

  /**
   * Create or overwrite document
   */
  async setDocument(collection, docId, data) {
    const doc = await this._request(`/${collection}/${docId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: FirestoreRestClient.toFirestoreFields(data),
      }),
    });
    return {
      id: doc.name.split('/').pop(),
      ...FirestoreRestClient.fromFirestoreFields(doc.fields),
    };
  }

  /**
   * Delete a document
   */
  async deleteDocument(collection, docId) {
    return this._request(`/${collection}/${docId}`, {
      method: 'DELETE',
    });
  }
}
