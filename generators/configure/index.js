const path = require('path')
const Generator = require('yeoman-generator')
const hostile = require('hostile')
const config = require('config')
const chalk = require('chalk')

const loopbackAlias = config.get('loopbackAlias')

module.exports = class extends Generator {
  static Remove (sudoOverride = false) {
    if (!sudoOverride && process.getuid() !== 0) {
      throw new Error('Generator needs root access to write hosts file')
    }

    const lines = hostile.getFile(path.join(__dirname, 'templates/hosts'), false)
    lines.forEach(line => {
      console.log('Removing host %s %s from hosts file', line[0], line[1])
      hostile.remove(line[0], line[1])
    })
  }
  initializing () {
    this.sourceRoot(path.join(__dirname, 'templates'))
    if (!this.options.hostile) {
      this.hostile = hostile
    } else {
      // Passing hostile as an argument allows us to stub it's api for unit tests
      this.hostile = this.options.hostile
    }
    if (!this.options.sudoOverride && process.getuid() !== 0) {
      this.env.error(chalk.bold.red('I need root access to write hosts file!'))
    }
  }

  configuring () {
    try {
      const lines = this.hostile.getFile(this.templatePath('hosts'), false)
      const setLines = this.hostile.get() // Parse current hosts file
      const missingLines = lines.filter(line => {
        // Determine if hostname is already set for this line
        return setLines.findIndex(l => l[1] === line[1]) === -1
      })
      if (missingLines.length) {
        missingLines.forEach(line => {
          this.log(`Adding host ${line[1]} to your hosts file.`)
          this.hostile.set(line[0], line[1])
        })
      } else {
        this.log('Looks like your hosts file is setup properly. 💪')
      }
    } catch (e) {
      this.env.error(chalk.bold.red(`Uh oh, I couldn't read your hosts file. Try Googling 'Sprucebot platform hosts'`))
    }
  }

  writingLoopbackAlias () {
    this.log('Writing loopback alias...')
    this.fs.copyTpl(
      this.templatePath('./loopbackAlias'),
      this.destinationPath('./loopbackAlias'),
      { loopbackAlias }
    )
  }

  loopbackAlias () {
    this.log('Checking if Loopback Alias is setup properly...')
    // Determine if our Loopback alias is already configured
    const cmd = this.spawnCommandSync('bash', [this.destinationPath('./loopbackAlias/setupLoopbackAlias.sh')])
    if (!cmd.error) {
      this.log(chalk.green('Looks like your Loopback Alias is setup properly'))
    } else {
      this.log(chalk.bold.red(`Uh oh, looks like there was an error setting up the loopback address: ${cmd.stderr.toString()}`))
    }
  }

  end () {
    this.log(chalk.green('Heck yeah! Everything looks good.'))
    this.log(chalk.yellow('Run `sprucebot platform start`  🌲🤖'))
  }
}
