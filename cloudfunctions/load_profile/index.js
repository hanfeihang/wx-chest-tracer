// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('sync-request')

cloud.init()

loadProfile = (tag, user_id) => {
  let request_status = null
  let data = {}
  let url = 'https://statsroyale.com/profile/' + encodeURIComponent(tag)
  let res;
  try {
    res = request('GET', url, {})
  } catch (e) {
    request_status = 'Connection Error'
    return {
      request_status: request_status
    } 
  }
  if (res.statusCode > 300) {
    request_status = 'Server Error'
    return {
      request_status: request_status
    }
  }
  var html = res.getBody()
  var x = html.indexOf("Profile is currently missing")
  if (x > 0) {
    request_status = '档案缺失，请点击绿色感叹号刷新'
    return {
      request_status: request_status
    }
  }
  x = html.indexOf("Invalid Hashtag Provided")
  if (x > 0) {
    request_status = 'TAG含有非法字符'
    return {
      request_status: request_status
    }
  }
  request_status = 'Ready'
  let d1 = showUpcomingChests(html)
  let d2 = showUpcomingShopOffers(html)
  let d3 = showTimeLastUpdate(html);
  let d4 = showUsername(html);
  let d5 = showLevel(html);
  let d6 = showClan(html);
  data = Object.assign(d1, d2, d3, d4, d5, d6)
  return {
    request_status: request_status,
    data: data
  }
}

showUpcomingChests = (html) => {
  var reg = /<span class="chests__counter">(.*?)<\/span>\n.*?chests__tooltip">\n(.*?)\n/gm;
  var r;
  var chestdata = [];
  while (r = reg.exec(html)) {
    var chestNum = r[1].trim();
    if (r[2].trim().split(':').length == 2) {
      var chestType = r[2].split(':')[1].trim();
    } else {
      var chestType = r[2].trim();
    }
    chestdata.push({
      chestNum: chestNum,
      chestType: chestType.replace(new RegExp(/ /g), '')
    })
  }
  return {
    chests: chestdata
  }
}

showUpcomingShopOffers = (html) => {
  var reg = /<div class="offers__name">(.*?)<\/div>\n.*?<div>(.*?)<\/div>/gm;
  var r;
  var shopOffers = []
  while (r = reg.exec(html)) {
    shopOffers.push({
      offerName: r[1].trim(),
      offerPngName: r[1].trim().toLowerCase().replace(' ', '-') + '-offer',
      offerTime: r[2].trim()
    })
  }
  return {
    upcomingShopOffers: shopOffers
  }
}

showTimeLastUpdate = (html) => {
  var reg = /<div class="refresh__time">\n(.*?)<\/div>\n/gm;
  var r = reg.exec(html)
  var timeLastUpdate = r[1].trim()
  return {
    timeLastUpdate: timeLastUpdate
  }
}

showUsername = (html) => {
  let username = null
  try {
    var reg = /<span class="profileHeader__nameCaption">\n(.*?)<\/span/gm;
    var r = reg.exec(html)
    username = r[1].trim()
  } catch (err) {}
  return {
    username: username
  }
}

showLevel = (html) => {
  var reg = /<span class="profileHeader__userLevel">(.*?)<\/span>\n/gm;
  var r = reg.exec(html)
  var lvl = r[1].trim()
  return {
    level: lvl
  }
}

showClan = (html) => {
  let clanId = null
  let clanName = null
  try {
    var reg = /clan\/(.*?)" class="ui__link ui__mediumText ui__whiteText profileHeader__userClan"/gm;
    var r = reg.exec(html)
    clanId = r[1].trim()
    var reg2 = /class="profileHeader__clanBadge" \/>\n(.*?)\n/gm;
    var r2 = reg2.exec(html)
    clanName = r2[1].trim()
  } catch (e) {
    console.log('no clan information' + e)
  }
  return {
    clanName: clanName,
    clanId: clanId
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return loadProfile(event.tag, wxContext.OPENID)
}