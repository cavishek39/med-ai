'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import Chat from '@/components/chat'
import { ModeToggle } from '@/components/toggle-theme'
import { useToast } from '@/hooks/use-toast'
import { compressImage } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'

export default function Home() {
  const { toast } = useToast()

  const [base64FileData, setBase64Data] = useState<File | string>()
  const [summary, setSummary] = useState('')

  const handleFileUpload = (event: any) => {
    const uploadedFile = event?.target?.files[0]

    if (!uploadedFile) return

    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/heic',
    ]
    const validFileTypes = ['application/pdf']

    let isValidImage = validImageTypes.includes(uploadedFile.type)

    let isValidDocument = validFileTypes.includes(uploadedFile.type)

    if (!isValidImage && !isValidDocument) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid image or PDF file.',
        variant: 'destructive',
      })
      return
    }

    if (isValidDocument) {
      const reader = new FileReader()
      // Process the file and generate summary from it as a base64 string
      reader.onload = (e) => {
        const text = reader.result as string
        // console.log(text)
        setBase64Data(text)
      }
      reader.readAsDataURL(uploadedFile)
    }

    if (isValidImage) {
      compressImage(uploadedFile, (compressedFile) => {
        // Process the file and generate summary
        const reader = new FileReader()

        reader.onload = () => {
          const text = reader.result as string
          // console.log(text)
          setBase64Data(text)
        }

        reader.readAsDataURL(compressedFile)
      })
    }
  }

  const extractDetails = async () => {
    if (!base64FileData) {
      toast({
        title: 'No file uploaded',
        description: 'Please upload a file to extract details.',
        variant: 'destructive',
      })
      return
    }

    console.log({ base64FileData })

    setSummary('Extracting details...')
    // Call the API to extract details from the file
    const response = await fetch('/api/extract-report', {
      method: 'POST',
      body: JSON.stringify({ data: base64FileData }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      toast({
        title: 'Error',
        description: 'An error occurred while processing the file.',
        variant: 'destructive',
      })
      return
    }

    const data = await response.text()
    // console.log(JSON.stringify(data, null, 2))
    setSummary(data)
  }

  return (
    <>
      <header className='w-full p-4 flex justify-between items-center shadow-md'>
        <h1 className='text-2xl font-bold'>Med_AI</h1>
        <div className='flex items-center space-x-4'>
          <ModeToggle />
        </div>
      </header>
      <div className='grid h-[calc(100vh-64px)] w-full grid-cols-1 md:grid-cols-5'>
        <div className='col-span-2 p-6 overflow-y-auto'>
          <div className='flex flex-col space-y-4'>
            <Input type='file' onChange={handleFileUpload} />
            <Button onClick={extractDetails}>Upload File</Button>
            <div className='border p-4 rounded-md bg-white dark:bg-gray-800'>
              <h2 className='text-xl font-bold'>Report Summary</h2>
              <MDEditor.Markdown
                source={summary}
                style={{
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'inherit',
                  color: 'inherit',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 15,
                  fontOpticalSizing: 'auto',
                }}
                rehypePlugins={[rehypeSanitize]}
              />
            </div>
          </div>
        </div>
        <div className='col-span-3 p-6'>
          <Chat reportData={summary} />
        </div>
      </div>
    </>
  )
}
