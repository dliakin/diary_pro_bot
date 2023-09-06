import { OpenAI } from 'openai'
import config from 'config'
import { ChatCompletionMessage } from 'openai/resources/chat/completions'

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY'), // defaults to process.env["OPENAI_API_KEY"]
})

const getMessage = (m: string) =>
  `Напиши на основе этих тезисов последовательную историю:${m}. 
  Это тезисы с описанием ключевых моментов дня. Необходимо в итоге получить такую историю, 
  что бы я запомнил этот день и смог в последствии рассказывать её друзьям. 
  Много текста не нужно, главное чтобы были правильная последовательность и учтение контекста. Текстне должен быть больше не больше 1500 символов, включая все символы.`

export async function generateStory(message: string = ''): Promise<string> {
  const messages: Array<ChatCompletionMessage> = [
    {
      role: 'assistant',
      content:
        'Ты опытный биограф, который пишет краткие очерки моих дней, основываясь на тезисах, которые я тебе прислаю. Ты пишешь их красивым, литературным языком. Без прекрас, как есть.',
    },
    {
      role: 'user',
      content: getMessage(message),
    },
  ]
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: config.get('CHATGPT_MODEL'),
    })
    return completion.choices[0].message.content === null ? '' : completion.choices[0].message.content
  } catch (error) {
    console.error('Error in openai', error)
    throw error
  }
}
