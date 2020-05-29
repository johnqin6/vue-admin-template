/**
 * 判断是否为空
 * @param {*} val
 */
export const isEmpty = (val) => {
  if (typeof val === 'boolean') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}

/**
 * 验证手机号
 * @param {*} phone
 */
export const isvalidatemobile = (phone) => {
  let result = true
  let msg = ''
  const isPhone = /^0\d{2, 3}-?\d{7,8}$/
  // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
  // const isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
  if (!isEmpty(phone)) {
    if (phone.length === 11) {
      if (isPhone.test(phone)) {
        msg = '手机号格式不正确'
      } else {
        result = false
      }
    } else {
      msg = '手机号码长度不为11位'
    }
  } else {
    msg = '手机号码不能为空'
  }
  return {
    result,
    msg
  }
}
