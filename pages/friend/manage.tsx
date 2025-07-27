import React, { useEffect, useState } from 'react'
import { ConfigProvider, Table, Modal, Button, Input, Space, Upload, message } from 'antd'
import { Container, SearchRow, ModalContainer } from '@/styled/friend/manage'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { getFriend, addFriend, modFriend, delFriend, updateSSRFriend, searchFriend, batchDelFriend } from '@/redux/friend/manage/actions'
import { getFriendService } from '@/service/friend/manage'
import { RootState } from '@/redux/store'
import _ from 'lodash'
import dayjs from 'dayjs'
import locale from 'antd/lib/locale/zh_CN'
import { handleXSS, checkModalObj } from '@/utils/common'
import { UploadOutlined } from '@ant-design/icons'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const pageSize = 100
const dateFormat = 'YYYY-MM-DD'
const currentDate = dayjs().format(dateFormat)

const keyTitles = {
  name: '名称',
  phone: '电话',
  wechat: '微信',
  city: '城市',
  occupation: '职业'
}

// styled-components
const StyledButton = styled(Button) <{ $primary?: boolean; $export?: boolean; $import?: boolean; $danger?: boolean }>`
    display: flex;
    align-items: center;
    border-radius: 6px;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    ${props => props.$export && `
      background-color: #f6ffed;
      color: #52c41a;
      border-color: #b7eb8f;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    `}
    ${props => props.$import && `
      background-color: #e6f7ff;
      color: #1890ff;
      border-color: #91d5ff;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    `}
    ${props => props.$danger && `
      background-color: #fff1f0;
      border-color: #ffa39e;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
      transition: all 0.3s ease;
    `}
  `
const StyledInput = styled(Input)`
    width: 200px;
    border-radius: 6px;
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  `
const StyledTable = styled(Table)`
    margin-top: 16px;
    border-radius: 8px;
    overflow: hidden;
    
    .styled-pagination {
      margin-top: 16px;
      margin-bottom: 16px;
    }
  `
const ModalTitle = styled.div`
    color: #1890ff;
    font-weight: 500;
  `
const ModalInput = styled(Input)`
    border-radius: 4px;
  `
const IconWrapper = styled.i`
    margin-right: 5px;
  `
const StyledPagination = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
  `
const RoundedButton = styled(Button)`
    border-radius: 4px;
  `
const GlobalStyle = styled.div`
    .rounded-button {
      border-radius: 4px;
    }
  `

const Page = ({ friend }) => {
  const dispatch = useDispatch()
  const [isModalVisiable, setIsModalVisible] = useState(false)
  const [modalId, setModalId] = useState(0)
  const [modalName, setModalName] = useState('')
  const [modalPhone, setModalPhone] = useState('')
  const [modalWechat, setModalWechat] = useState('')
  const [modalCity, setModalCity] = useState('')
  const [modalOccupation, setModalOccupation] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [batchDelIds, setBatchDelIds] = useState([])

  useEffect(() => {
    dispatch(updateSSRFriend(friend))
  }, [dispatch])

  const state = useSelector((state: RootState) => state)
  const { friendManage }: any = state

  if (!friendManage.firstLoadFlag) {
    friend = friendManage.friend
  }

  const { totalCounts, items: friendItems } = _.cloneDeep(friend)

  _.each(friendItems, (item, index) => {
    const { id } = item
    item.key = id
  })

  const dataSource = friendItems
  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      width: '10%',
      align: 'center'
    },
    {
      title: keyTitles.name,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      width: '20%',
      ellipsis: true
    },
    {
      title: keyTitles.phone,
      dataIndex: 'phone',
      key: 'phone',
      width: '15%',
      ellipsis: true
    },
    {
      title: keyTitles.wechat,
      dataIndex: 'wechat',
      key: 'wechat',
      width: '15%',
      ellipsis: true
    },
    {
      title: keyTitles.city,
      dataIndex: 'city',
      key: 'city',
      width: '15%',
      ellipsis: true
    },
    {
      title: keyTitles.occupation,
      dataIndex: 'occupation',
      key: 'occupation',
      width: '15%',
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: '',
      width: '15%',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <RoundedButton type="primary" size="small" onClick={() => {
              updateFriend(record)
            }}>修改</RoundedButton>
            <RoundedButton danger size="small" onClick={() => {
              const { id } = record
              deleteFriend(id)
            }}>删除</RoundedButton>
          </Space>
        )
      }
    }
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      //
      setBatchDelIds(selectedRowKeys)
    }
  }

  const createFriend = () => {
    setModalId(0)
    setModalName('')
    showModal()
  }

  const updateFriend = (record: any) => {
    let { id, name, phone, wechat, city, occupation } = record

    setModalId(id)
    setModalName(name)
    setModalPhone(phone)
    setModalWechat(wechat)
    setModalCity(city)
    setModalOccupation(occupation)
    showModal()
  }

  const deleteFriend = (id: number) => {
    Modal.confirm({
      title: '提示',
      content: '确认删除吗',
      okText: '确认',
      cancelText: '取消',
      onOk: (e) => {
        dispatch(delFriend(id))
        Modal.destroyAll()
      }
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const getMessageTitle = (key: string) => {
    let result = keyTitles[key]
    if (result == undefined)
      result = key
    return result
  }

  const handleOk = () => {
    const modalObj = {
      name: handleXSS(modalName),
      phone: handleXSS(modalPhone),
      wechat: handleXSS(modalWechat),
      city: handleXSS(modalCity),
      occupation: handleXSS(modalOccupation)
    }
    //

    const checkResult = checkModalObj(modalObj)

    if (!checkResult) {
      if (modalId == 0) {  // 新增
        dispatch(addFriend(modalObj))
      } else {
        dispatch(modFriend(modalId, modalObj))
      }

      setIsModalVisible(false)
    } else {
      message.info(getMessageTitle(checkResult.key) + checkResult.reason)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const doSearch = () => {
    dispatch(searchFriend(0, pageSize, { 
      keyword: handleXSS(searchKeyword)
    }))
  }

  const exportFriend = () => {
    if (friendItems.length > 0) {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Friend")
      const jsonData = _.map(friendItems, (item) => _.omit(item, ['key']))

      // 提取表头
      const headers = Object.keys(jsonData[0]);

      // 将 JSON 数据转换为二维数组
      const data = [headers, ...jsonData.map(item => headers.map(header => item[header]))];

      // 将数据写入工作表 
      ws.addRows(data)

      // 设置表头样式加粗
      ws.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      // 设置列宽
      ws.columns = [
        { header: 'ID', key: 'header1', width: 10 },
        { header: 'NAME', key: 'header2', width: 20 },
        { header: 'PHONE', key: 'header3', width: 15 },
        { header: 'WECHAT', key: 'header4', width: 15 },
        { header: 'CITY', key: 'header5', width: 15 },
        { header: 'OCCUPATION', key: 'header6', width: 15 },
      ];

      wb.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "Friend.xlsx")
      }).catch(() => {
        // 导出失败
      })
    } else {
      message.info("没有数据无需导出")
    }
  }

  const uploadProps = {
    name: 'file',
    action: '/rest/friend/import',
    onChange(info: any) {
      //

      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`)
        window.location.reload()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`)
      }
    }
  }

  const batchDeleteFriend = () => {
    if (batchDelIds.length > 0) {
      Modal.confirm({
        title: '提示',
        content: '确认批量删除吗',
        okText: '确认',
        cancelText: '取消',
        onOk: (e) => {
          dispatch(batchDelFriend(batchDelIds))
          Modal.destroyAll()
        }
      })
    } else {
      message.info("没有数据不能批量删除")
    }
  }

  return (
    <Container>
      <GlobalStyle />
      <div className="page-title">Friend 管理</div>
      <ConfigProvider locale={locale}>
        <SearchRow>
          <Space size="middle" wrap>
            <Space size="small">
              <StyledButton type="primary" onClick={createFriend} $primary>
                <IconWrapper className="fa fa-plus"></IconWrapper>
                新增
              </StyledButton>
              <StyledInput
                value={searchKeyword}
                placeholder="请输入名称/电话/微信/城市/职业搜索"
                allowClear
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={doSearch}
                style={{ width: '300px' }}
              />
              <StyledButton type="primary" onClick={doSearch} $primary>
                <IconWrapper className="fa fa-search"></IconWrapper>
                搜索
              </StyledButton>
            </Space>
            <Space size="small">
              <StyledButton onClick={exportFriend} icon={<UploadOutlined rev={undefined} rotate={180} />} $export>
                导出
              </StyledButton>
              <Upload {...uploadProps}>
                <StyledButton icon={<UploadOutlined rev={undefined} />} $import>
                  导入
                </StyledButton>
              </Upload>
              <StyledButton danger onClick={batchDeleteFriend} $danger>
                批量删除
              </StyledButton>
            </Space>
          </Space>
        </SearchRow>
        <StyledTable
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          dataSource={dataSource}
          columns={columns}
          bordered
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
          pagination={{
            total: totalCounts,
            pageSize: pageSize,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              dispatch(searchFriend(page - 1, pageSize, { name: handleXSS(searchName) }))
            },
            className: "styled-pagination"
          }}
        />
        <Modal
          title={<ModalTitle>{(modalId == 0 ? "新增" : "修改") + " Friend"}</ModalTitle>}
          open={isModalVisiable}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确认"
          cancelText="取消"
          centered
          maskClosable={false}
          destroyOnClose
          okButtonProps={{ className: 'rounded-button' }}
          cancelButtonProps={{ className: 'rounded-button' }}
        >
          <ModalContainer>
            <div className="line">
              <label>{keyTitles.name}：</label>
              <ModalInput
                value={modalName}
                placeholder="请输入名称"
                allowClear
                autoFocus
                onChange={(e) => setModalName(e.target.value)}
              />
            </div>
            <div className="line">
              <label>{keyTitles.phone}：</label>
              <ModalInput
                value={modalPhone}
                placeholder="请输入电话"
                allowClear
                onChange={(e) => setModalPhone(e.target.value)}
              />
            </div>
            <div className="line">
              <label>{keyTitles.wechat}：</label>
              <ModalInput
                value={modalWechat}
                placeholder="请输入微信"
                allowClear
                onChange={(e) => setModalWechat(e.target.value)}
              />
            </div>
            <div className="line">
              <label>{keyTitles.city}：</label>
              <ModalInput
                value={modalCity}
                placeholder="请输入城市"
                allowClear
                onChange={(e) => setModalCity(e.target.value)}
              />
            </div>
            <div className="line">
              <label>{keyTitles.occupation}：</label>
              <ModalInput
                value={modalOccupation}
                placeholder="请输入职业"
                allowClear
                onChange={(e) => setModalOccupation(e.target.value)}
              />
            </div>
          </ModalContainer>
        </Modal>
      </ConfigProvider>
    </Container>
  )
}

Page.getInitialProps = async () => {
  let friend = null

  await getFriendService(0, pageSize).then((res: any) => {
    const { data } = res
    friend = data.friend
  })

  return {
    friend
  }
}

export default Page