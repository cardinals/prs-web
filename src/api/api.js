/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:19:23
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2019-05-09 17:29:34
 */
//  引入httpUtil
import { get, post } from '@/utils/httpUtil'
// 基本路径
const baseUrl = '/SearchCase'
// 接口示例
// 退出登录
// export const logout = (params) => get(`${baseUrl}/logout`, params)
// 机构排名接口
// export const organizationRankings = (params, responseType) => post(`${baseUrl}/institutionalRankings`, params, responseType)
// 机构详情接口 (司法局和司法所)
// export const organizationDetails = (params) => all([
//   {url: `${baseUrl}/organizationDetailsBaseTeamNumber`, params: params},
//   {url: `${baseUrl}/organizationDetailsSpecializationResource`, params: params},
//   {url: `${baseUrl}/organizationDetailsSuccessAmount`, params: params}
// ])

// 获取验证码
export const imgCheck = () => get(`${baseUrl}/user/imgCheck`, {})
// 登录接口
export const login = (params) => post(`${baseUrl}/user/login`, params)
// 注册接口
export const register = (params) => post(`${baseUrl}/user/register`, params)
// 首次登录用户推荐
export const focusType = (params) => post(`${baseUrl}/user/focusType`, params)
// 验证是否登录
export const loginStatus = () => get(`${baseUrl}/user/loginStatus`, {})
// 注销接口
export const logout = () => get(`${baseUrl}/user/logout`, {})
// 中文提示
export const tipsCN = (params) => get(`${baseUrl}/suggest/hanZi`, params)
// 英文提示
export const tipsEN = (params) => get(`${baseUrl}/suggest/pinYin`, params)
// 首页访问量统计
export const requestCount = (params) => get(`${baseUrl}/mediate/requestCount`, params)
// 推荐列表
export const recommend = () => get(`${baseUrl}/user/recommend`, {})
// 收藏列表
export const collectionList = (params) => get(`${baseUrl}/user/collectionList`, params)
// (取消)收藏
export const collection = (params) => post(`${baseUrl}/user/collection`, params)
// 案件详情
export const mediateCaseDetail = (params) => get(`${baseUrl}/detail/mediateCase`, params)
// 调解员详情
export const referee = (params) => get(`${baseUrl}/detail/referee`, params)
// 调解协议详情
export const protocol = (params) => get(`${baseUrl}/detail/protocol`, params)
// 调解协议金额分析
export const protocolAmount = (params) => get(`${baseUrl}/mediate/protocolAmount`, params)
// 裁判文书详情
export const judgement = (params) => get(`${baseUrl}/detail/judgement`, params)
// 法律条文详情
export const law = (params) => get(`${baseUrl}/detail/law`, params)
// 推荐各种接口
export const recommendList = (params) => get(`${baseUrl}/mediate/recommendList`, params)
// 搜索列表页
export const searchList = (params) => post(`${baseUrl}/mediate/list`, params)
// 搜索列表页日志记录接口
export const log = (params) => post(`${baseUrl}/mediate/log`, params)
