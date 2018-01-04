const chalk = require('chalk')
const log = require('../../utils/log')
const readline = require('readline')
const skillUtil = require('../../utils/skill')
const configUtil = require('../../utils/config')
const requestUtil = require('../../utils/request')
const inquirer = require('inquirer')

let controller

class Controller {
	constructor({ endpoint, location, user, skill }) {
		this.endpoint = endpoint
		this.location = location
		this.user = user
		this.skill = skill
		this.listeningToKeyPress = true

		requestUtil.auth(user)
	}

	start() {
		readline.emitKeypressEvents(process.stdin)
		process.stdin.on('keypress', this.onKeyPress.bind(this))
		process.stdin.setRawMode(true)
		process.stdin.resume()

		log.success('Simulator running...')
		log.line('enter: ⬆️')
		log.line('leave: ⬇️')
		log.line('send message: ➡️')
		log.line('receive message: ⬅️')
	}

	onKeyPress(ch, key) {
		if (key && this.listeningToKeyPress) {
			if (key.ctrl && key.name === 'c') {
				console.log(chalk.green('Killing simulator...'))
				process.exit()
			} else if (key.name === 'up') {
				this.didEnter()
			} else if (key.name === 'down') {
				this.didLeave()
			} else if (key.name === 'right') {
				this.sendMessage()
			} else if (key.name == 'left') {
				this.receiveMessage()
			}
		}
	}

	async didEnter() {
		try {
			await this._emit('did-enter')
		} catch (err) {
			log.error(err.friendlyMessage || err.message)
		}
	}

	async didSignup() {
		try {
			await this._emit('did-signup')
		} catch (err) {
			log.error(err.friendlyMessage || err.message)
		}
	}

	async didAddDevice() {
		try {
			await this._emit('did-add-device')
		} catch (err) {
			log.error(err.friendlyMessage || err.message)
		}
	}

	async didLeave() {
		try {
			await this._emit('did-leave')
		} catch (err) {
			log.error(err.friendlyMessage || err.message)
		}
	}

	async sendMessage() {
		this.listeningToKeyPress = false
		const answer = await inquirer.prompt({
			type: 'input',
			message: 'Message to send',
			name: 'message'
		})
		console.log(answer)
		this.listeningToKeyPress = true
	}

	async _emit(eventName) {
		await requestUtil.post(
			`/dev/${this.location.id}/skill/${this.skill.id}/emit/${eventName}`
		)
	}
}

module.exports = async function init() {
	controller = new Controller({
		endpoint: skillUtil.readEnv('API_HOST'),
		location: configUtil.location(),
		user: configUtil.user(),
		skill: skillUtil.skill()
	})
	controller.start()
}
