import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Pinecone } from '@pinecone-database/pinecone'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compressImage(
  file: File,
  callback: (compressedFile: File) => void,
  quality: number = 0.1 // Added quality parameter with default value
) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      // Create a canvas element
      const elem = document.createElement('canvas')
      // Set the canvas dimensions
      const width = 400
      const scaleFactor = width / img.width
      elem.width = width
      // Scale the image to the specified width
      elem.height = img.height * scaleFactor
      // Draw the image on the canvas
      const ctx = elem.getContext('2d')
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, width, img.height * scaleFactor)
      // Convert the canvas to a blob
      ctx.canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          callback(compressedFile)
        },
        'image/jpeg',
        quality // Use the quality parameter
      )
    }
    img.src = e.target.result as string
  }
  reader.readAsDataURL(file)
}

// Converts local file information to a GoogleGenerativeAI.Part object.
export function fileToGenerativePart(imageData: string) {
  if (!imageData) {
    return null
  }

  const data = imageData.split(',')[1]
  const mimeType = imageData.substring(
    imageData.indexOf(':') + 1,
    imageData.indexOf(';')
  )

  // console.log({ data, mimeType })

  return {
    inlineData: {
      data,
      mimeType,
    },
  }
}

export async function queryPineconeVectorStore({}: {
  client: Pinecone
  query: string
  indexName: string
  searchQuery: string
}): Promise<string> {
  return ''
}
