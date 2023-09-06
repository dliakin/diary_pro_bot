import { Context } from 'telegraf'
import { Message } from 'telegraf/types'

export class Loader {
  ctx: Context
  icons = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']
  message: Message.TextMessage | undefined
  interval: NodeJS.Timeout | undefined
  constructor(ctx: Context) {
    this.ctx = ctx
  }
  async show() {
    let index = 0
    this.message = await this.ctx.reply(this.icons[index])
    this.interval = setInterval(() => {
      index = index < this.icons.length - 1 ? index + 1 : 0

      this.ctx.telegram.editMessageText(this.ctx.chat?.id, this.message?.message_id, undefined, this.icons[index])
    }, 500)
  }
  hide() {
    clearInterval(this.interval)
    if (this.ctx.chat && this.message) this.ctx.telegram.deleteMessage(this.ctx.chat.id, this.message.message_id)
  }
}
