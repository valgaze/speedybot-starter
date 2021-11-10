import { BotHandler, $ } from 'speedybot'
import Namegamehandler from './namegame'

/**
 * Add a "handler" below to control your bot's responses to a user-- just add to the list
 * 
 * At minimum a handler must have
 * keyword: a word, RegEx, or a list of words and/or regex's to trigger the handler
 * handler: a function with access to the bot instance and "trigger" data 
 * helpText: Simple explanation for how to use (this gets displayed by default if the user tells your bot "help")
 * 
 * If you can make it fit in this list, you can make it do whatever you want
 * Special keyword phrases:
 * 1) "<@submit>": will be triggered whenever the user subits data from a form
 * 2) "<@catchall>": will be triggered on every message received
 * 3) "<@help>": override the built-in help handler
 * 4) "<@fileupload>": Handle file-upload event
 * 
 */
const handlers: BotHandler[] = [
	{
		keyword: ['hi', 'hello', 'hey', 'yo', 'watsup', 'hola'],
		handler(bot, trigger) {
			const utterances = [`Heya how's it going $[name]?`,
								`Hi there, $[name]!`,
								`Hiya $[name]`]
			const template = {name: trigger.person.displayName}
			$(bot).sendTemplate(utterances, template)
		},
		helpText: `A handler that greets the user`
	},
	{
		keyword: ['sendfile'],
		handler(bot, trigger) {
			const $bot = $(bot)
			// Send a publically accessible URL file
			// Supported filetypes: ['doc', 'docx' , 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'bmp', 'gif', 'png']
			const pdf = 'https://speedybot.valgaze.com'

			$bot.sendDataFromUrl(pdf)

		},
		helpText: `A handler that attaches a file in a direct message`
	},
	{
		keyword: ['ping', 'pong'],
		handler(bot, trigger) {
			const normalized = trigger.text.toLowerCase()
			if (normalized === 'ping') {
				bot.say('pong')
			} else {
				bot.say('ping')
			}
		},
		helpText: `A handler that says ping when the user says pong and vice versa`
	},
	{
		keyword: '<@submit>',
		handler(bot, trigger) {
			// Ex. From here data could be transmitted to another service or a 3rd-party integrationn
			bot.say(`Submission received! You sent us ${JSON.stringify(trigger.attachmentAction.inputs)}`)

		},
		helpText: `A special handler that fires anytime a user submits data (you can only trigger this handler by tapping Submit in a card)`
	},
	{
		keyword: '<@fileupload>',
		async handler(bot, trigger) {
			const supportedFiles = ['json', 'txt', 'csv']

            // take 1st file uploaded, note this is just a URL & not authenticated
            const [file] = trigger.message.files

            // Retrieve file data
			const fileData = await $(bot).getFile(file)
			const { extension, type } = fileData

            if (supportedFiles.includes(extension)) {
                const {data} = fileData
                // bot.snippet will format json or text data into markdown format
                bot.say({markdown: $(bot).snippet(data)})
            } else {
                bot.say(`Sorry, somebody needs to add support to handle *.${extension} (${type}) files`)
            }
		},
		helpText: 'A special handler that will activate whenever a file is uploaded'
	},
	Namegamehandler, // You can also include single-file handlers in your list,
]

export default handlers;