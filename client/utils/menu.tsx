import { BookOutlined, SolutionOutlined } from '@ant-design/icons'
import React from 'react'

let key = 1

export default [
  {
    key: key.toString(),
    text: '介绍',
    url: '/',
    icon: <BookOutlined rev={undefined} />,
    subMenus: null
  },
  {
    // friend_manage_start
    key: (++key).toString(),
    text: 'friend',
    url: '/friend/manage',
    icon: <SolutionOutlined rev={undefined} />,
    subMenus: [
      {
        key: key + '_1',
        text: 'manage',
        url: '/friend/manage'
      }
    ]
    // friend_manage_end
  },
  /*{
    key: (++key).toString(),
    text: '模板',
    url: '/template/manage',
    icon: <SolutionOutlined rev={undefined} />,
    subMenus: [
      {
        key: key + '_1',
        text: '模板1',
        url: '/template/manage'
      }
    ]
  },*/
]
