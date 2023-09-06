import { Context, Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import config from 'config'
import { generateStory } from './modules/openai.js'
import { create } from './modules/notion.js'
import { getErrorMessage } from './modules/errors.js'
import { Loader } from './modules/loader.js'

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), { handlerTimeout: Infinity })

bot.command('start', (ctx: Context) => {
  ctx.reply('Добро пожаловать в бота. Отправьте текстово сообщение с тезисами про историю')
})

bot.on(message('text'), async (ctx: Context) => {
  try {
    if (ctx.has(message('text'))) {
      const text = ctx.message.text
      if (!text.trim()) ctx.reply('Текст не может быть пустым!')
      const loader = new Loader(ctx)
      loader.show()
      const answer = await generateStory(text)
      if (!answer) ctx.reply('Ошибка с API: ')
      const notionResponse = await create(text, answer)
      if ('properties' in notionResponse) {
        loader.hide()
        ctx.reply(`Ваша страница: ${notionResponse.url}`)
      } else {
        ctx.reply('Ошибка с API: ')
      }
    }
  } catch (error) {
    console.log('Error while proccessing bot: ', getErrorMessage(error))
  }
})

bot.launch()
