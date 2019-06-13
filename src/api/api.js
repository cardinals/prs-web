/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-09-18 10:19:23
 * @Last Modified by: wupeiwen javapeiwen2010@gmail.com
 * @Last Modified time: 2019-06-13 16:34:18
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
