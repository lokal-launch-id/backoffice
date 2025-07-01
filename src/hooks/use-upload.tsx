import { API_ENDPOINTS, apiClient } from '@/lib/api'
import { ProductImage } from '@/features/product/data/schema'

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

export interface UploadUrl {
  url: string
}

export function useUpload() {
  const uploadImages = async ({
    images,
    type = 'general',
  }: {
    images: Partial<ProductImage>[]
    type: 'avatar' | 'general' | 'product'
  }): Promise<UploadUrl[]> => {
    const results = await Promise.all(
      images.map(async (image) => {
        // Convert blob URL to File object
        const response = await fetch(image.image_url!)
        const blob = await response.blob()

        const file = new File([blob], `image-${Date.now()}.jpg`, {
          type: blob.type || 'image/jpeg',
        })

        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', type)

        const { data } = await apiClient.postFormData<UploadResponse>(
          API_ENDPOINTS.upload.s3URL,
          formData
        )
        return data
      })
    )
    return results.map((result) => ({ url: result.url }))
  }

  return { uploadImages }
}
