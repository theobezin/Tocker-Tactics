const Discord = require("discord.js")
const client = new Discord.Client()
const keepAlive = require("./server")
const Twisted = require("twisted")
const LeagueJS = require("leaguejs")
const leagueJs = new LeagueJS(process.env.LEAGUE_API_KEY)
const prefix = ":"
const tftapi = new Twisted.TftApi({ key: `${process.env.LEAGUE_API_KEY}` })

process.env.LEAGUE_API_PLATFORM_ID = 'euw1'

client.on("ready", () => {
  client.user.setActivity(':help', { type: 'PLAYING' });
  console.log(`Logged in as ${client.user.tag}!`)
  console.log(client.user.displayAvatarURL())
})

client.on("message", async (message) => {

  const [command, ...args] = message.content.split(' ')

  if (!message.content.startsWith(prefix)) return;

  if (message.content.startsWith(`${prefix}help`)) {
    const embed = new Discord.MessageEmbed();
    embed.setColor("#216e00")
    embed.setTitle("Commands list")
    embed.addFields(
      { name: 'help', value: 'Display the list of commands' },
      { name: 'player', value: ':player player_name | Get global informations about a player' })
    embed.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
    message.channel.send(embed)
  }

  if (message.content.startsWith(`${prefix}player`)) {

    var name = ""
    console.log(name)

    for (var n in args) {
      name = name + " " + args[n]
      console.log(name)
    }

    console.log(name)

    leagueJs.Summoner
      .gettingByName(name)
      .then(data => {
        'use strict';
        console.log(data)

        tftapi.League.get(data.id, process.env.LEAGUE_API_PLATFORM_ID)
          .then(league => {

            console.log(league.response[0])
            var rank = "NC"
            var wins = "/"
            if (typeof league.response[0] !== "undefined") {
              console.log("oui")
              if (typeof league.response[0].tier !== "undefined") {
                rank = league.response[0].tier + ' ' + league.response[0].rank + ' - ' + league.response[0].leaguePoints + ' LP'
              }


              wins = league.response[0].wins
            }

            if (typeof data !== "undefined") {
              const embed = new Discord.MessageEmbed();
              embed.setColor("#216e00")
              embed.setTitle(data.name)
              embed.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.15.1/img/profileicon/${data.profileIconId}.png`)
              embed.addFields(
                { name: 'Level', value: data.summonerLevel },
                { name: 'Rank', value: rank },
                { name: '\u200B', value: '\u200B' },
                { name: 'Wins', value: wins, inline: true },
                { name: '% of top 1', value: 'Soon...', inline: true })
              embed.addField('% of top 4', 'Soon...', true)
              embed.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
              message.channel.send(embed)
            } else {

            }

          })







      })
      .catch(err => {
        'use strict';
        console.log(err);
        message.channel.send("Joueur non trouvé.")
      });
  }

})


keepAlive()

client.login(process.env.TOKEN)