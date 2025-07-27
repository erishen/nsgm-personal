module.exports = {
    query: `
        friend(page: Int, pageSize: Int): Friends
        friendGet(id: Int): Friend
        friendSearch(page: Int, pageSize: Int, data: FriendSearchInput): Friends
    `,
    mutation: `
        friendAdd(data: FriendAddInput): Int
        friendBatchAdd(datas: [FriendAddInput]): Int
        friendUpdate(id: Int, data: FriendAddInput): Boolean
        friendDelete(id: Int): Boolean
        friendBatchDelete(ids: [Int]): Boolean
    `,
    subscription: ``,
    type: `
        type Friend {
            id: Int
            name: String
            phone: String
            wechat: String
            city: String
            occupation: String
        }

        type Friends {
            totalCounts: Int
            items: [Friend]
        }

        input FriendAddInput {
            name: String
            phone: String
            wechat: String
            city: String
            occupation: String
        }

        input FriendSearchInput {
            keyword: String
        }
    `
} 