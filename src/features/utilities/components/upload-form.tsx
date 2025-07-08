import { useState, useCallback, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Upload,
  Copy,
  CheckCircle,
  FileText,
  Image,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UtilitiesApi,
  UploadType,
  UPLOAD_CONFIGS,
  UploadResponse,
} from '../api/utilities-api'

const formSchema = z.object({
  uploadType: z.enum(['avatar', 'product', 'file', 'general'] as const, {
    required_error: 'Please select an upload type',
  }),
})

interface UploadFormProps {
  className?: string
}

export function UploadForm({ className }: UploadFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorDialog, setErrorDialog] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadType: 'general',
    },
  })

  const watchedUploadType = form.watch('uploadType')

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setSelectedFile(file)
      setUploadResult(null)
      setCopied(false)

      // Validate file immediately
      const validation = UtilitiesApi.validateFile(file, watchedUploadType)
      if (!validation.valid) {
        setErrorDialog(validation.error || 'File validation failed')
        setSelectedFile(null)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [watchedUploadType]
  )

  const handleUpload = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      if (!selectedFile) {
        toast.error('Please select a file to upload')
        return
      }

      // Validate file again before upload
      const validation = UtilitiesApi.validateFile(
        selectedFile,
        data.uploadType
      )
      if (!validation.valid) {
        setErrorDialog(validation.error || 'File validation failed')
        return
      }

      setIsUploading(true)
      try {
        const result = await UtilitiesApi.uploadFile(
          selectedFile,
          data.uploadType
        )
        setUploadResult(result)
        toast.success('File uploaded successfully!')

        // Reset form
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'
        setErrorDialog(errorMessage)
        toast.error('Upload failed: ' + errorMessage)
      } finally {
        setIsUploading(false)
      }
    },
    [selectedFile]
  )

  const copyToClipboard = useCallback(async () => {
    if (!uploadResult?.data.url) return

    try {
      await navigator.clipboard.writeText(uploadResult.data.url)
      setCopied(true)
      toast.success('URL copied to clipboard!')

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (_error) {
      toast.error('Failed to copy URL')
    }
  }, [uploadResult?.data.url])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className='h-4 w-4' />
    }
    return <FileText className='h-4 w-4' />
  }

  const getUploadConfig = (type: UploadType) => UPLOAD_CONFIGS[type]

  return (
    <>
      <div className={cn('mx-auto max-w-2xl space-y-6', className)}>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Upload className='h-5 w-5' />
              File Upload
            </CardTitle>
            <CardDescription>
              Upload files and images to get a shareable URL. Select the
              appropriate type for your use case.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpload)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='uploadType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select upload type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='avatar'>
                            Avatar (5MB max, 300x300px)
                          </SelectItem>
                          <SelectItem value='product'>
                            Product Image (10MB max, 1200x800px)
                          </SelectItem>
                          <SelectItem value='general'>
                            General Image (15MB max, 1920x1080px)
                          </SelectItem>
                          <SelectItem value='file'>
                            Document/File (5MB max, PDF, CSV, DOC, etc.)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {watchedUploadType && (
                        <div className='text-muted-foreground mt-2 text-sm'>
                          <strong>Limits:</strong>{' '}
                          {UtilitiesApi.formatFileSize(
                            getUploadConfig(watchedUploadType).maxFileSize
                          )}{' '}
                          max,{' '}
                          {getUploadConfig(watchedUploadType)
                            .allowedTypes.map((type) => type.split('/')[1])
                            .join(', ')}{' '}
                          files
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <div className='space-y-4'>
                  <Label>Select File</Label>
                  <div className='flex items-center gap-4'>
                    <Input
                      ref={fileInputRef}
                      type='file'
                      onChange={handleFileSelect}
                      accept={
                        watchedUploadType
                          ? getUploadConfig(
                              watchedUploadType
                            ).allowedTypes.join(',')
                          : undefined
                      }
                      disabled={isUploading}
                      className='file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-1 file:text-sm file:font-medium'
                    />
                  </div>

                  {selectedFile && (
                    <div className='bg-muted flex items-center gap-2 rounded-md p-3'>
                      {getFileIcon(selectedFile)}
                      <span className='text-sm font-medium'>
                        {selectedFile.name}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        ({UtilitiesApi.formatFileSize(selectedFile.size)})
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  type='submit'
                  disabled={!selectedFile || isUploading}
                  className='w-full'
                >
                  {isUploading ? (
                    <>
                      <div className='border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className='mr-2 h-4 w-4' />
                      Upload File
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-green-600'>
                <CheckCircle className='h-5 w-5' />
                Upload Successful
              </CardTitle>
              <CardDescription>
                Your file has been uploaded successfully. Copy the URL below to
                use it.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label>File URL</Label>
                <div className='mt-2 flex items-center gap-2'>
                  <Input
                    value={uploadResult.data.url}
                    readOnly
                    className='font-mono text-sm'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={copyToClipboard}
                    className={copied ? 'text-green-600' : ''}
                  >
                    {copied ? (
                      <CheckCircle className='h-4 w-4' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </div>

              <div className='text-muted-foreground grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <strong>File Size:</strong>{' '}
                  {UtilitiesApi.formatFileSize(uploadResult.data.size)}
                </div>
                <div>
                  <strong>Format:</strong>{' '}
                  {uploadResult.data.format.toUpperCase()}
                </div>
                {uploadResult.data.width > 0 && (
                  <>
                    <div>
                      <strong>Width:</strong> {uploadResult.data.width}px
                    </div>
                    <div>
                      <strong>Height:</strong> {uploadResult.data.height}px
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog
        open={!!errorDialog}
        onOpenChange={() => setErrorDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-destructive flex items-center gap-2'>
              <AlertCircle className='h-5 w-5' />
              Upload Error
            </AlertDialogTitle>
            <AlertDialogDescription>{errorDialog}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
