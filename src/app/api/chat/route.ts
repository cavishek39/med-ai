import { streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

// Allow streaming responses up to 30 seconds

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
})

const model = google('gemini-1.5-pro-latest', {
  safetySettings: [
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
})

// const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })

export async function POST(req: Request) {
  const { messages, data } = await req.json()

  const userQuestion = messages[messages.length - 1].content
  const reportData = data?.reportData

  console.log({ userQuestion, reportData })

  const searchQuery = `Patient medical report says: \n${userQuestion} \n\n ${reportData}`

  // TODO:  await queryPineconeVectorStore({
  //     client: pc,
  //     query: searchQuery,
  //     indexName: 'med-reports',
  //     searchQuery,
  //   })

  const result = await streamText({
    model,
    prompt: searchQuery,
  })

  return result.toDataStreamResponse()
}
