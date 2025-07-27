import { getLocalGraphql } from '@/utils/fetch'
import _ from 'lodash'

export const getFriendService = (page = 0, pageSize = 10) => {
  const getFriendQuery = `query ($page: Int, $pageSize: Int) { friend(page: $page, pageSize: $pageSize) { 
        totalCounts items { 
          id name phone wechat city occupation
        } 
      } 
    }`

  return getLocalGraphql(getFriendQuery, {
    page,
    pageSize
  })
}

export const searchFriendByIdService = (id: number) => {

  const searchFriendByIdQuery = `query ($id: Int) { friendGet(id: $id){
      id name phone wechat city occupation
    }
  }`

  return getLocalGraphql(searchFriendByIdQuery, {
    id
  })
}

export const searchFriendService = (page = 0, pageSize = 10, data: any) => {
  const { keyword } = data

  const searchFriendQuery = `query ($page: Int, $pageSize: Int, $data: FriendSearchInput) { 
    friendSearch(page: $page, pageSize: $pageSize, data: $data) {
      totalCounts items { 
        id name phone wechat city occupation
      } 
    }
  }`

  return getLocalGraphql(searchFriendQuery, {
    page,
    pageSize,
    data: {
      keyword
    }
  })
}

export const addFriendService = (data: any) => {
  const { name, phone, wechat, city, occupation } = data

  const addFriendQuery = `mutation ($data: FriendAddInput) { friendAdd(data: $data) }`

  return getLocalGraphql(addFriendQuery, {
    data: {
      name,
      phone,
      wechat,
      city,
      occupation
    }
  })
}

export const updateFriendService = (id: number, data: any) => {
  const { name, phone, wechat, city, occupation } = data

  const updateFriendQuery = `mutation ($id: Int, $data: FriendAddInput) { friendUpdate(id: $id, data: $data) }`

  return getLocalGraphql(updateFriendQuery, {
    id,
    data: {
      name,
      phone,
      wechat,
      city,
      occupation
    }
  })
}

export const deleteFriendService = (id: number) => {
  const deleteFriendQuery = `mutation ($id: Int) { friendDelete(id: $id) }`

  return getLocalGraphql(deleteFriendQuery, {
    id
  })
}

export const batchAddFriendService = (datas: any) => {
  const batchAddFriendQuery = `mutation ($datas: [FriendAddInput]) { friendBatchAdd(datas: $datas) }`

  return getLocalGraphql(batchAddFriendQuery, {
    datas
  })
}

export const batchDeleteFriendService = (ids: any) => {
  const batchDeleteFriendQuery = `mutation ($ids: [Int]) { friendBatchDelete(ids: $ids) }`

  return getLocalGraphql(batchDeleteFriendQuery, {
    ids
  })
}