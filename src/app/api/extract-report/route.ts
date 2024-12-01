import model from '@/app/gemini'
import { fileToGenerativePart } from '@/lib/utils'

const prompt = `Analyze the attached clinical report. Provide a summary of the patient's condition, including any relevant diagnoses, symptoms, and treatment plans.
The response should be written in a professional tone and should be easy to understand for a non-medical audience. The summary should be concise and informative. Not more that 200 words.
And return the result as a markdown text response. 
`

export async function POST(req: Request, res: Response) {
  try {
    const { data: base64 } = await req.json()
    // console.log('base64 => ', base64)

    if (!base64) {
      throw new Error('base64 is null or undefined')
    }

    const filePart = fileToGenerativePart(base64)

    // console.log('filePart => ', filePart)

    const generatedContent = await model.generateContent([prompt, filePart])

    // console.log(generatedContent.response.text())

    const text = generatedContent.response.text()

    return new Response(text, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
      statusText: 'OK',
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
      statusText: 'Internal Server Error',
    })
  }
}
