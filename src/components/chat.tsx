'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from './ui/card'
import { Message, useChat } from 'ai/react'

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

  const handleSend = () => {}

  const isSendByMe = (message: Message) => {
    return message.role === 'user'
  }

  return (
    <Card className='w-full h-full flex flex-col'>
      <CardContent className='flex-1 flex flex-col space-y-4 p-4'>
        <div className='flex-1 overflow-y-auto'>
          {isLoading ? (
            <div className='flex justify-center items-center h-full'>
              <div className='loader'>Loading...</div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  isSendByMe(message) ? 'justify-end' : 'justify-start'
                } mb-2`}>
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    isSendByMe(message)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}>
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>
        <div className='flex space-x-2'>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              handleInputChange(e)
            }}
            placeholder='Type your message...'
            className='flex-1 border rounded p-2'
          />
          <Button
            onClick={() => {
              handleSend()
              handleSubmit()
              setInput('')
            }}
            className='bg-blue-500 text-white p-2 rounded'>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Chat
