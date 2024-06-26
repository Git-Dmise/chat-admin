import request from '@/utils/request'

export function indexList() {
  return request({
    url: '/api/v1/promotion_admin/index',
    method: 'get'
  })
}

export function incomeList(query) {
  return request({
    url: '/api/v1/promotion_admin/income_list',
    method: 'get',
    params: query
  })
}

export function updateIncome(data) {
  return request({
    url: '/api/v1/promotion_admin/update',
    method: 'post',
    data
  })
}

export function welfareConfigIndex() {
  return request({
    url: '/api/v1/promotion_admin/welfare_config',
    method: 'get'
  })
}

export function updateWelfareConfig(data) {
  return request({
    url: '/api/v1/promotion_admin/welfare_config',
    method: 'post',
    data
  })
}

export function withdrawalList(query) {
  return request({
    url: '/api/v1/promotion_admin/welfare_list',
    method: 'get',
    params: query
  })
}

export function welfareExamine(data) {
  return request({
    url: '/api/v1/promotion_admin/welfare_examine',
    method: 'post',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
