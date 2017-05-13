const configuration = require('../configuration/configuration.json')

const compileCommands = (api) => {
  const commands = {
    private: [],
    public: [],
  }

  configuration.commands.forEach(command => {
    if (command.api.includes(api)) {
      const commandToAdd = {
        name: command.name,
        re: new RegExp(command.pattern, command.flags),
        isRegistered: command.isRegistered,
        isAdmin: command.isAdmin
      }
      if (command.isPrivate) {
        commands.private.push(commandToAdd)
      } else {
        commands.public.push(commandToAdd)
      }
    }
  })

  return commands
}

module.exports = {
  compileCommands: compileCommands,
}
