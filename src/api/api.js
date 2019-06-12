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

// 首页最新动态数据
export const latestNews = () => get(`${baseUrl}/HomePages`)
// 列表页树状列表测试数据
export const getTestData = () => get('searchList1.json')
// 列表页搜索结果数据
export const getListData = (params) => post(`${baseUrl}/SearchResults`, params)
// 列表页头像数据
export const getPhotoData = () => get('searchList3.json')
// 人物信息页左边栏数据
export const getbasicInfo = (params) => get(`${baseUrl}/PersonLabels`, params)
// 人物信息页数据
export const getPeopleInfo = (params) => get(`${baseUrl}/PersonInformations`, params)
// 测试数据
export const getTest = () => get('test.json')
// 人物动态页数据
export const getDynamic = (params) => post(`${baseUrl}/PersonActivities`, params)
// 中文提示
export const tipsCN = (params) => get(`${baseUrl}/SuggestTips`, params)
// 英文提示
export const tipsEN = (params) => get(`${baseUrl}/SuggestTips`, params)
