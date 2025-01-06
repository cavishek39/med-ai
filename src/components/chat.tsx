'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from './ui/card'
import { Message, useChat } from 'ai/react'
import MDEditor from '@uiw/react-md-editor'

const Chat = ({ reportData }: { reportData: string }) => {
  const { messages, handleSubmit, handleInputChange, isLoading } = useChat({
    api: '/api/chat',
    body: {
      data: {
        reportData,
      },
    },
  })

  const [input, setInput] = useState('')

  const isSendByMe = (message: Message) => {
    return message.role === 'user'
  }

  return (
    <Card className='w-full h-full flex flex-col'>
      <CardContent className='flex-1 flex flex-col space-y-4 p-4'>
        <div className='flex-1 overflow-y-auto px-4 py-6 space-y-6'>
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                isSendByMe(message) ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`p-2 rounded-2xl max-w-lg ${
                  isSendByMe(message)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                } shadow-md`}>
                {isSendByMe(message) ? (
                  <>{message.content}</>
                ) : (
                  <MDEditor.Markdown
                    source={message.content}
                    style={{
                      whiteSpace: 'pre-wrap',
                      backgroundColor: 'inherit',
                      color: 'inherit',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: '1.6',
                      fontSize: 14,
                      fontOpticalSizing: 'auto',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb', // Light border for structure
                    }}
                    className='prose prose-blue max-w-none'
                  />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='p-2 rounded-2xl max-w-lg bg-gray-100 text-gray-800 flex items-center shadow-md'>
                <span className='flex space-x-1'>
                  <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce'></span>
                  <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-10'></span>
                  <span className='w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-20'></span>
                </span>
              </div>
            </div>
          )}
        </div>
        <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-center w-full'>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              handleInputChange(e)
            }}
            placeholder='Ask your question...'
            className='flex-1 border border-gray-300 rounded-lg p-4 h-12 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out w-full sm:w-auto'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault() // Prevent newline on Enter
                handleSubmit() // Replace with your message send logic
                setInput('')
              }
            }}
          />
          <Button
            onClick={() => {
              handleSubmit()
              setInput('')
            }}
            className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 w-full sm:w-auto'>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Chat
