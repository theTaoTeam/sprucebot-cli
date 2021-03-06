const path = require('path')
const { version, description } = require('../package.json')

const TEMP = path.join(__dirname, '../__TEST__')

module.exports = {
	version,
	description,
	TEMP,
	appname: 'sprucebot',
	gitUser: 'sprucelabsai',
	skillKitPackage: '@sprucelabs/spruce-skill', // npm module name
	registry: 'https://registry.npmjs.org/',
	platforms: {
		api: {
			repo: {
				name: 'com-sprucebot-api',
				env: './src',
				path: './api',
				coredev: true
			},
			pm2: {
				name: 'SB API'
			}
		},
		web: {
			repo: {
				name: 'com-sprucebot-web',
				env: './',
				path: './web',
				coredev: true
			},
			pm2: {
				name: 'SB Web'
			}
		},
		dev: {
			repo: {
				name: 'sprucebot-dev-services',
				path: './dev-services',
				env: false,
				coredev: true
			},
			pm2: {
				name: 'SB Dev Services'
			}
		},
		relay: {
			repo: {
				name: 'sprucebot-relay',
				path: './relay',
				env: false,
				coredev: false
			},
			pm2: {
				name: 'SB Relay'
			}
		},
		'@sprucelabs/sprucebot-skills-kit': {
			repo: {
				name: 'workspace.sprucebot-skills-kit',
				path: './workspace.sprucebot-skills-kit',
				env: './packages/sprucebot-skills-kit',
				coredev: false
			},
			pm2: null
		},
		'sprucebot-cli': {
			repo: {
				name: 'sprucebot-cli',
				path: './sprucebot-cli',
				env: false,
				coredev: false
			},
			pm2: null
		},
		'teammate-app': {
			repo: {
				name: 'sprucebot-teammate-app',
				path: './teammate-app',
				env: false,
				coredev: false
			},
			pm2: null
		}
	},
	skillRemotes: [
		{
			label: 'hello.sprucebot.com',
			name: 'prod',
			web: 'https://hello.sprucebot.com',
			url: 'https://api.sprucebot.com'
		},
		{
			label: 'alpha-hello.sprucebot.com',
			name: 'alpha',
			web: 'https://hello-alpha.sprucebot.com',
			url: 'https://alpha-api.sprucebot.com'
		},
		{
			label: 'staging-hello.sprucebot.com',
			name: 'staging',
			web: 'https://hello-staging.sprucebot.com',
			url: 'https://staging-api.sprucebot.com'
		},
		{
			label: 'qa-hello.sprucebot.com',
			name: 'qa',
			web: 'https://hello-qa.sprucebot.com',
			url: 'https://qa-api.sprucebot.com'
		},
		{
			label: 'dev-hello.sprucebot.com',
			name: 'dev',
			web: 'https://hello-dev.sprucebot.com',
			url: 'https://dev-api.sprucebot.com'
		},
		{
			label: 'local.sprucebot.com',
			name: 'local',
			web: 'https://local.sprucebot.com',
			url: 'https://local-api.sprucebot.com',
			allowSelfSignedCerts: true
		}
	],
	skillProps: [
		{
			key: 'NAME',
			name: "Skill's name"
		},
		{
			key: 'SLUG',
			name: "Skill's slug"
		},
		{
			key: 'DESCRIPTION',
			name: 'Describe your skill in 144 characters'
		}
	]
}
