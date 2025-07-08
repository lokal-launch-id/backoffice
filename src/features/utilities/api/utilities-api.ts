import { apiClient, API_ENDPOINTS } from '@/lib/api'

export interface UploadResponse {
  data: {
    url: string
    public_id: string
    width: number
    height: number
    format: string
    size: number
    type: string
  }
  message: string
}

export type UploadType = 'avatar' | 'product' | 'file' | 'general'

export interface UploadConfig {
  maxFileSize: number // in bytes
  allowedTypes: string[]
  maxWidth?: number
  maxHeight?: number
}

// File size limits based on upload type
export const UPLOAD_CONFIGS: Record<UploadType, UploadConfig> = {
  avatar: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    maxWidth: 300,
    maxHeight: 300,
  },
  product: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    maxWidth: 1200,
    maxHeight: 800,
  },
  general: {
    maxFileSize: 15 * 1024 * 1024, // 15MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    maxWidth: 1920,
    maxHeight: 1080,
  },
  file: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ],
  },
}

export class UtilitiesApi {
  // Upload file to S3
  static async uploadFile(
    file: File,
    type: UploadType
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return apiClient.postFormData<UploadResponse>(
      API_ENDPOINTS.utilities.upload,
      formData
    )
  }

  // Validate file before upload
  static validateFile(
    file: File,
    type: UploadType
  ): { valid: boolean; error?: string } {
    const config = UPLOAD_CONFIGS[type]

    // Check file size
    if (file.size > config.maxFileSize) {
      const maxSizeMB = Math.round(config.maxFileSize / (1024 * 1024))
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`,
      }
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
      const allowedExtensions = config.allowedTypes
        .map((type) => type.split('/')[1])
        .join(', ')
      return {
        valid: false,
        error: `File type not supported. Allowed types: ${allowedExtensions}`,
      }
    }

    return { valid: true }
  }

  // Get human readable file size
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Export individual functions for convenience
export const { uploadFile, validateFile, formatFileSize } = UtilitiesApi
