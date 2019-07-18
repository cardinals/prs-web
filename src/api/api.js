/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:19:23
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2019-07-16 09:06:16
 */
//  引入httpUtil
import { get, post } from '@/utils/httpUtil'
// 基本路径
const baseUrl = '/SearchCase'

// 首页最新动态数据
export const latestNews = () => get(`${baseUrl}/HomePages`)
// 列表页搜索结果数据
export const getListData = (params) => post(`${baseUrl}/SearchResults`, params)
// 人物信息页左边栏数据
export const getbasicInfo = (params) => get(`${baseUrl}/PersonLabels`, params)
// 人物信息页数据
export const getPeopleInfo = (params) => get(`${baseUrl}/PersonInformations`, params)
// 人物动态页数据
export const getDynamic = (params) => post(`${baseUrl}/PersonActivities`, params)
// 中文提示
export const tipsCN = (params) => get(`${baseUrl}/SuggestTips`, params)
// 英文提示
export const tipsEN = (params) => get(`${baseUrl}/SuggestTips`, params)
// 人物关系
export const relation = (params) => get(`${baseUrl}/PersonRelationships`, params)
// 查询记录
export const queryLogs = (params) => post(`${baseUrl}/QueryLogs`, params)
// 人物轨迹
export const personTrajectory = (params) => post(`${baseUrl}/PersonTrajectory`, params)
// 随机验证码
export const imgCheck = () => get(`${baseUrl}/UserInfo/imgCheck`)
// 用户注册
export const register = (params) => post(`${baseUrl}/UserInfo/register`, params)
// 用户登陆
export const login = (params) => post(`${baseUrl}/UserInfo/login`, params)
// 用户登出
export const logout = () => get(`${baseUrl}/UserInfo/logout`)
// 登录状态检测
export const loginStatus = () => get(`${baseUrl}/UserInfo/loginStatus`)
