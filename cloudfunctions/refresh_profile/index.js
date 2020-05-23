// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const tag = event.tag
  const url = 'https://statsroyale.com/profile/' + tag + '/refresh'
  return await request(url, function (error, response, body) {
    if (error) {
      console.error('error:', error)
      return
    }
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
  })
}