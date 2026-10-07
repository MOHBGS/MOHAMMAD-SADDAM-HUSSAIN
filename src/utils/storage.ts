/**
 * College Crush Object Storage & Media Utility
 * Handles persistent client-side object storage, validation, thumbnailing, and progress simulation.
 */

const DB_NAME = 'CollegeCrushStorage';
const DB_VERSION = 1;
const STORE_NAME = 'media_blobs';

// Initialize IndexedDB for resilient client-side media storage
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Persist a media blob or data URL to IndexedDB
 */
export async function saveMediaObject(key: string, data: { blob?: Blob; dataUrl?: string; mimeType: string }): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = { key, ...data, timestamp: Date.now() };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback: store in memory / sessionStorage if indexedDB fails
    try {
      if (data.dataUrl) {
        sessionStorage.setItem(`cc_obj_${key}`, data.dataUrl);
      }
    } catch {}
  }
}

/**
 * Retrieve a stored media object
 */
export async function getMediaObject(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const result = req.result;
        if (result?.dataUrl) {
          resolve(result.dataUrl);
        } else if (result?.blob) {
          resolve(URL.createObjectURL(result.blob));
        } else {
          resolve(sessionStorage.getItem(`cc_obj_${key}`));
        }
      };
      req.onerror = () => resolve(sessionStorage.getItem(`cc_obj_${key}`));
    });
  } catch {
    return sessionStorage.getItem(`cc_obj_${key}`);
  }
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileSizeFormatted?: string;
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Format raw bytes into human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Validate an image file before upload
 */
export function validateImageFile(file: File, maxSizeBytes = MAX_IMAGE_SIZE_BYTES): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Type check
  const fileType = file.type.toLowerCase();
  const isValidType =
    ACCEPTED_IMAGE_TYPES.includes(fileType) ||
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);

  if (!isValidType) {
    return {
      valid: false,
      error: 'Unsupported image format. Please select a JPG, PNG, WebP, or GIF image.',
    };
  }

  // Size check
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image is too large (${formatFileSize(file.size)}). Please select an image under 10 MB.`,
    };
  }

  return {
    valid: true,
    fileSizeFormatted: formatFileSize(file.size),
  };
}

/**
 * Create a thumbnail from a file using HTML Canvas
 */
export async function createThumbnail(file: File, maxDimension = 400): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Convert file to base64 data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Simulate upload with progress updates
 */
export async function simulateUploadProgress(
  onProgress?: (percent: number) => void,
  totalDurationMs = 700
): Promise<void> {
  if (!onProgress) return;
  const steps = [15, 38, 62, 85, 100];
  const stepDelay = totalDurationMs / steps.length;
  for (const percent of steps) {
    onProgress(percent);
    await new Promise((r) => setTimeout(r, stepDelay));
  }
}

/**
 * Upload profile photo to storage
 */
export async function uploadProfilePhoto(
  file: File,
  userId: string,
  onProgress?: (percent: number) => void
): Promise<{ url: string; path: string }> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  await simulateUploadProgress(onProgress, 800);
  const dataUrl = await fileToDataUrl(file);
  const storagePath = `profile-images/${userId}/avatar_${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;

  // Persist to indexedDB / fallback
  await saveMediaObject(storagePath, { dataUrl, mimeType: file.type });

  return {
    url: dataUrl,
    path: storagePath,
  };
}

/**
 * Upload chat image to storage
 */
export async function uploadChatImage(
  file: File,
  conversationId: string,
  messageId: string,
  onProgress?: (percent: number) => void
): Promise<{
  url: string;
  thumbnailUrl: string;
  path: string;
  fileName: string;
  fileSize: number;
}> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  await simulateUploadProgress(onProgress, 900);
  const [dataUrl, thumbnail] = await Promise.all([
    fileToDataUrl(file),
    createThumbnail(file, 400),
  ]);

  const storagePath = `chat-images/${conversationId}/${messageId}/img_${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;
  await saveMediaObject(storagePath, { dataUrl, mimeType: file.type });

  return {
    url: dataUrl,
    thumbnailUrl: thumbnail || dataUrl,
    path: storagePath,
    fileName: file.name,
    fileSize: file.size,
  };
}
