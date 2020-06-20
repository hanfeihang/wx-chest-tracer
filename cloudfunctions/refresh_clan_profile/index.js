// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('sync-request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const clanId = event.clanId
  console.log('clanId', clanId)
  const url = 'https://statsroyale.com/clan/' + clanId + '/refresh'
  try {
    const resp = request('GET', url, {})
    console.log('resp:', resp)
    return {
      code: 'success'
    }
  } catch (e) {
    console.log('refresh_clan_profile error', e)
    return {
      code: 'error'
    }
  }
}