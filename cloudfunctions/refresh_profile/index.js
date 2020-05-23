// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('sync-request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const tag = event.tag
  const url = 'https://statsroyale.com/profile/' + encodeURIComponent(tag) + '/refresh'
  try {
    request('GET', url, {})
  } catch (e) {
    console.log(e)
    return
  }
}