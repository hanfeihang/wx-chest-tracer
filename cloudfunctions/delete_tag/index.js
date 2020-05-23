// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const user_tag_rel_db = db.collection('user_tag_rel')
  
  try {
    return await user_tag_rel_db.where({
      user_id: wxContext.OPENID
    }).remove()
  } catch(e) {
    console.error(e)
  }
}