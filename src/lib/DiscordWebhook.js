//@ts-check

class DiscordWebhook {
  /** @readonly @type {string} */ url

  /**
   * @param {string} url 
   */
  constructor (url) {
    this.url = url
  }

  /**
   * @param {Message} msg 
   * @returns 
   */
  send(msg) {
    const req = Request.create(this.url)
    req.addHeader('Content-Type', 'application/json')
    req.addHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    return req.post(JSON.stringify(msg))
  }

}

module.exports = DiscordWebhook

/**
 * @typedef {object} Message
 * @prop {string} username
 * @prop {string} content
 */
