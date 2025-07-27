import * as types from './types'
import { getFriendService, addFriendService, updateFriendService, deleteFriendService, searchFriendService, batchDeleteFriendService } from '@/service/friend/manage'

export const getFriend = (page=0, pageSize=10) => (
  dispatch: (arg0: {
    type: string
    payload?: { friend: any }
  }) => void
) => {
  dispatch({
    type: types.GET_FRIEND
  })

  getFriendService(page, pageSize)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.GET_FRIEND_SUCCEEDED,
        payload: {
          friend: data.friend
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.GET_FRIEND_FAILED
      })
    })
}

export const searchFriend = (page=0, pageSize=10, data: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { friend: any }
  }) => void
) => {
  dispatch({
    type: types.SEARCH_FRIEND
  })

  searchFriendService(page, pageSize, data)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      dispatch({
        type: types.SEARCH_FRIEND_SUCCEEDED,
        payload: {
          friend: data.friendSearch
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.SEARCH_FRIEND_FAILED
      })
    })
}

export const updateSSRFriend = (friend: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { friend: any }
  }) => void
) => {
  dispatch({
    type: types.UPDATE_SSR_FRIEND,
    payload: {
      friend: friend
    }
  })
}

export const addFriend = (obj:any) => (
  dispatch: (arg0: {
    type: string
    payload?: { friend: any }
  }) => void
) => {
  dispatch({
    type: types.ADD_FRIEND
  })

  addFriendService(obj)
    .then((res: any) => {
      //console.log('action_res', res)
      const { data } = res
      const friend = {
        id: data.friendAdd,
        ...obj,
        phone: obj.phone,
        wechat: obj.wechat,
        city: obj.city,
        occupation: obj.occupation
      }
      dispatch({
        type: types.ADD_FRIEND_SUCCEEDED,
        payload: {
          friend
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.ADD_FRIEND_FAILED
      })
    })
}

export const modFriend = (id: number, obj: any) => (
  dispatch: (arg0: {
    type: string
    payload?: { friend: any }
  }) => void
) => {
  dispatch({
    type: types.MOD_FRIEND
  })

  updateFriendService(id, obj)
    .then((res: any) => {
      console.log('action_res', res)
      const friend = {
        id,
        ...obj,
        phone: obj.phone,
        wechat: obj.wechat,
        city: obj.city,
        occupation: obj.occupation
      }
      dispatch({
        type: types.MOD_FRIEND_SUCCEEDED,
        payload: {
          friend
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.MOD_FRIEND_FAILED
      })
    })
}

export const delFriend = (id: number) => (
  dispatch: (arg0: {
    type: string
    payload?: { id: number }
  }) => void
) => {
  dispatch({
    type: types.DEL_FRIEND
  })

  deleteFriendService(id)
    .then((res: any) => {
      console.log('action_res', res)

      dispatch({
        type: types.DEL_FRIEND_SUCCEEDED,
        payload: {
          id
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.DEL_FRIEND_FAILED
      })
    })
}

export const batchDelFriend = (ids:any) => (
  dispatch: (arg0: {
    type: string
    payload?: { ids: any }
  }) => void
) => {
  dispatch({
    type: types.BATCH_DEL_FRIEND
  })

  batchDeleteFriendService(ids)
    .then((res: any) => {
      console.log('action_res', res)

      dispatch({
        type: types.BATCH_DEL_FRIEND_SUCCEEDED,
        payload: {
          ids
        }
      })
    })
    .catch(() => {
      dispatch({
        type: types.BATCH_DEL_FRIEND_FAILED
      })
    })
}