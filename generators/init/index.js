const path = require('path')
const config = require('config')
const hostile = require('hostile')
const chalk = require('chalk')

const Generator = require('../base')

const {
  directoryExists,
  fileExists
} = require('../../utils/dir')

module.exports = class extends Generator {
  async initializing () {
    this.sourceRoot(path.join(__dirname, 'templates'))
    this.promptValues = await this.getPromptValues()
    this.destinationRoot(this.promptValues.path)
  }

  writingRepos () {
    if (this.options['skip-install'] !== true) {
      this.log('Cloning platform repositories...')

      const pathApi = path.resolve(this.promptValues.path, 'api')
      const pathWeb = path.resolve(this.promptValues.path, 'web')
      const gitBase = `git@github.com:${this.promptValues.gitUser}`

      this._cloneRepo(`${gitBase}/${config.get('repositories.api')}`, pathApi)
      this._cloneRepo(`${gitBase}/${config.get('repositories.web')}`, pathWeb)

      this.log('Writing .env files...')
      fileExists(this.destinationPath('./api/app/.env.example')) && this.fs.copy(
        this.destinationPath('./api/app/.env.example'),
        this.destinationPath('./api/app/.env')
      )
      fileExists(this.destinationPath('./web/.env.example')) && this.fs.copy(
        this.destinationPath('./web/.env.example'),
        this.destinationPath('./web/.env')
      )
    }
  }

  writingTemplates () {
    this.log('Populating and copying templates...')
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('./package.json'),
      this.promptValues
    )
    this.fs.copyTpl(
      this.templatePath('docker-compose.yml'),
      this.destinationPath('./docker-compose.yml'),
      this.promptValues
    )
    this.fs.copyTpl(
      this.templatePath('hosts'),
      this.destinationPath('./hosts'),
      this.promptValues
    )
    this.fs.copy(
      this.templatePath('docker'),
      this.destinationPath('./docker')
    )
  }

  end () {
    hostile.get(false, (err, lines) => {
      if (err) {
        this.env.error(chalk.bold.red('Oh sh**, I had an issue reading your hosts file. Google `Sprucebot hosts file` for help.'))
      }

      const configured = lines.reduce((memo, line) => {
        if (/sprucebot.com/.test(line[1])) {
          memo[line[1]] = true
        }
        return memo
      }, {})

      if (!configured['local-api.sprucebot.com'] || !configured['local.sprucebot.com'] || !configured['local-devtools.sprucebot.com']) {
        this.log(chalk.green(`Sweet! We're almost done! Last step is configuring your host file.`))
        this.log(chalk.yellow('Don\'t sweat it though, just run `sudo sprucebot platform configure`'))
      } else {
        this.log(chalk.green('Heck yeah! I double checked and everything looks good.'))
        this.log(chalk.yellow('Run `sprucebot platform start`  🌲 🤖'))
      }
    })
  }

  _cloneRepo (repo, path) {
    const exists = directoryExists(path)
    if (exists) {
      this.log(`Oh snap, looks like you already installed something at ${path}! Skipping for now.`)
    } else {
      // TODO - Make sure this halts when github public key is missing
      const cmd = this.spawnCommandSync('git', ['clone', repo, path])
      if (!cmd.error) {
        this.log(chalk.green(`Finished cloning ${repo} to ${path}.`))
      } else {
        this.log(chalk.bold.red(`CRAP, looks like there was a problem cloning ${repo}.`))
      }
    }
  }
}