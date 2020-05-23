// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

saveToHistoryTags = async (tag, user_id) => {
  const db = cloud.database()
  const user_tag_rel_db = db.collection('user_tag_rel')
  console.log('saveToHistoryTags:', tag, user_id)
  let res = await user_tag_rel_db.where({
    user_id: user_id,
    tag: tag
  }).get()

  console.log('db get:', res)
  if (res == null || res.data == null || res.data.length == 0) {
    // 记录不存在，则写入
    user_tag_rel_db.add({
      data: {
        user_id: user_id,
        tag: tag
      },
      success: function (res) {
        console.log('add tag success', tag)
      }
    })
  } else {
    console.log('tag already existed')
  }
  console.log('saveToHistoryTags end')
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // saveToHistoryTags(event.tag, wxContext.OPENID)
  const user_id =  wxContext.OPENID
  const tag = event.tag
  const db = cloud.database()
  const user_tag_rel_db = db.collection('user_tag_rel')
  console.log('saveToHistoryTags123:', tag, user_id)
  let res = await user_tag_rel_db.where({
    user_id: user_id,
    tag: tag
  }).get()

  console.log('db get:', res)
  if (res == null || res.data == null || res.data.length == 0) {
    // 记录不存在，则写入
    await user_tag_rel_db.add({
      data: {
        user_id: user_id,
        tag: tag
      },
      success: function (res) {
        console.log('add tag success', tag)
      }
    })
  } else {
    console.log('tag already existed')
  }
  console.log('saveToHistoryTags end')

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}