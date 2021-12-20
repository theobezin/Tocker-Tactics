const Discord = require("discord.js")
const client = new Discord.Client()
const keepAlive = require("./server")
const fetch = require("node-fetch")
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
      { name: 'player', value: ':player player_name | Get global informations about a player' },
      {name: 'traits', value: 'Display the list of all traits available in TFT Set 6'},
      {name: 'champions', value: 'Display the list of all champions available in TFT Set 6'},)
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
            console.log(league.response[1])
            var rankClassic = "No data found"
            var winsClassic = "/"
            var rankHyperroll = "No data found"
            var winsHyperroll = "/"
            if (typeof league.response[0] !== "undefined") {
              console.log("oui")
              if (typeof league.response[0].tier !== "undefined") {
                rankClassic = league.response[0].tier + ' ' + league.response[0].rank + ' - ' + league.response[0].leaguePoints + ' LP'
                winsClassic = league.response[0].wins
              }

              if (typeof league.response[1] !== "undefined") {
                rankHyperroll = league.response[1].ratedTier + ' ' + league.response[1].ratedRating + ' points'
                winsHyperroll = league.response[1].wins
              }



            }

            if (typeof data !== "undefined") {
              const embed = new Discord.MessageEmbed();
              embed.setColor("#216e00")
              embed.setTitle(data.name)
              embed.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.15.1/img/profileicon/${data.profileIconId}.png`)
              embed.addFields(
                { name: 'Level', value: data.summonerLevel },
                { name: '\u200B', value: '\u200B' },
                { name: 'RANKED', value: "** **" },
                { name: 'Rank', value: rankClassic },
                { name: 'Wins', value: winsClassic, inline: true },
                { name: '% of top 1', value: 'Soon...', inline: true },
                { name: '% of top 4', value: 'Soon...', inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'HYPERROLL', value: "** **" },
                { name: 'Rank', value: rankHyperroll },
                { name: 'Wins', value: winsHyperroll, inline: true }
              )

              embed.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
              message.channel.send(embed)
            } else {

            }

          })







      })
      .catch(err => {
        'use strict';
        console.log(err);
        message.channel.send("Player not found.")
      });
  }

  if (message.content.startsWith(`${prefix}champions`)) {
    const url = "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json";
    const response = await fetch(url);
    const result = await response.json();
    const champions = result.sets[6].champions

    const embed = new Discord.MessageEmbed();
    embed.setColor("#216e00")
    embed.setTitle("TFT Set 6 Champions")

    const embed2 = new Discord.MessageEmbed();
    embed2.setColor("#216e00")
    embed2.setTitle("TFT Set 6 Champions (2/3")

    const embed3 = new Discord.MessageEmbed();
    embed3.setColor("#216e00")
    embed3.setTitle("TFT Set 6 Champions (3/3")

    for (var champion in champions) {
      console.log(champions[champion].name)
      if (champion <= 25) {
        embed.addField(champions[champion].name, '** **')
      } else if (25 < champion && champion <= 50) {
        embed2.addField(champions[champion].name, '** **')
      } else {
        embed3.addField(champions[champion].name, '** **')
      }

    }

    embed.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
    message.channel.send(embed)
    embed2.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
    message.channel.send(embed2)
    embed3.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
    message.channel.send(embed3)
    

  }

  if (message.content.startsWith(`${prefix}traits`)) {
    const url = "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json";
    const response = await fetch(url);
    const result = await response.json();
    const traits = result.sets[6].traits

    const embed = new Discord.MessageEmbed();
    embed.setColor("#216e00")
    embed.setTitle("TFT Set 6 Traits")

    const embed2 = new Discord.MessageEmbed();
    embed2.setColor("#216e00")
    embed2.setTitle("TFT Set 6 Traits (following...")

    for (var t in traits) {
      if (t <= 25) {
        embed.addField(traits[t].name, '** **')
      } else {
        embed2.addField(traits[t].name, '** **')
      }

    }

    embed.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
    message.channel.send(embed)
    embed2.setFooter(`${client.user.username} by Sadeuh`, client.user.displayAvatarURL());
    message.channel.send(embed2)

  }

})


keepAlive()

client.login(process.env.TOKEN)