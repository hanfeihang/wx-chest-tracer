// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const user_tag_rel_db = db.collection('user_tag_rel')
  try {
    let ret = await user_tag_rel_db.where({
      user_id: wxContext.OPENID
    }).get()
    let hTags = []
    for (var i = 0; i < ret.data.length; i++) {
      hTags.push(ret.data[i].tag)
    }
    return {
      user_id: wxContext.OPENID,
      tags: hTags
    }
  } catch (e) {
  }
}