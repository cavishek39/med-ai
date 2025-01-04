import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Pinecone } from '@pinecone-database/pinecone'
import { HfInference } from '@huggingface/inference'
import { HUGGING_FACE_MODEL } from '@/constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HF_TOKEN = process.env.HUGGING_FACE_TOKEN

const inference = new HfInference(HF_TOKEN)

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
      ctx?.drawImage(img, 0, 0, width, img.height * scaleFactor)
      // Convert the canvas to a blob
      ctx?.canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            callback(compressedFile)
          } else {
            console.error('Blob is null')
          }
        },
        'image/jpeg',
        quality // Use the quality parameter
      )
    }
    img.src = e?.target?.result as string
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

export async function queryPineconeVectorStore({
  client,
  query,
  indexName,
  searchQuery,
  namespace,
}: {
  client: Pinecone
  query: string
  indexName: string
  searchQuery: string
  namespace: string
}): Promise<string> {
  const hfOutput = await inference.featureExtraction({
    model: HUGGING_FACE_MODEL,
    inputs: searchQuery,
  })

  // console.log({ hfOutput })

  const queryEmbeddings = Array.from(hfOutput)

  const index = client.index(indexName)

  const queryResponse = await index.namespace(namespace).query({
    vector: queryEmbeddings as number[],
    topK: 10,
    includeMetadata: true,
    includeValues: true,
  })

  console.log('queryResponse')

  if (queryResponse.matches.length > 0) {
    const concatRetrievals = queryResponse.matches
      .map((match, index) => {
        return `\n Clinical finding ${index + 1}: \n ${match.metadata?.chunk}`
      })
      .join('\n\n')

    // console.log({ concatRetrievals })

    return concatRetrievals
  } else {
    return 'No results found'
  }
}
