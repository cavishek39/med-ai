import { Message, StreamData, streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Pinecone } from '@pinecone-database/pinecone'
import { queryPineconeVectorStore } from '@/lib/utils'
import {
  GEMINI_BASE_URL,
  GOOGLE_GENERATIVE_AI_MODEL,
  PINECONE_INDEX_NAME,
} from '@/constants'

// Allow streaming responses up to 30 seconds

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  baseURL: GEMINI_BASE_URL,
})

const model = google(GOOGLE_GENERATIVE_AI_MODEL, {
  safetySettings: [
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
})

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' })

export async function POST(req: Request) {
  const { messages, data } = await req.json()

  const messagesData: Message[] = [...messages]

  const userQuestion = messagesData[messagesData.length - 1].content
  const reportData = data?.reportData

  console.log({ userQuestion, reportData })

  const searchQuery = `Represent this sentence for searching relevant passages: Patient medical report says: \n${userQuestion} \n\n ${reportData}`

  const retrievals = await queryPineconeVectorStore({
    client: pc,
    query: searchQuery,
    indexName: PINECONE_INDEX_NAME,
    searchQuery,
    namespace: 'final-test',
  })

  // final prompt to Gemini
  const finalPrompt = `Here is a summary of a patient's clinical report, and a user query. Some generic clinical findings are also provided that may or may not be relevant for the report.
  Go through the clinical report and answer the user query.
  Ensure the response is factually accurate, and demonstrates a thorough understanding of the query topic and the clinical report.
  Before answering you may enrich your knowledge by going through the provided clinical findings. 
  The clinical findings are generic insights and not part of the patient's medical report. Do not include any clinical finding if it is not relevant for the patient's case.

  \n\n**Patient's Clinical report summary:** \n${reportData}. 
  \n**end of patient's clinical report** 

  \n\n**User Query:**\n${userQuestion}?
  \n**end of user query** 

  \n\n**Generic Clinical findings:**
  \n\n${retrievals}. 
  \n\n**end of generic clinical findings** 

  \n\nProvide thorough justification for your answer.
  \n\n**Answer:**
  `

  // stream the response from the model

  const streamData = new StreamData()

  streamData.append({
    retrievals: retrievals,
  })

  const result = streamText({
    model,
    prompt: finalPrompt,
    onFinish: () => {
      streamData.close()
    },
  })

  return result.toDataStreamResponse()
}
