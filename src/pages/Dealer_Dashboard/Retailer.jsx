import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import {
  Table,
  Icon,
  Input,
  Select,
  Pagination,
  Button,
  Tabs,
  Popover,
  Form,
  Tooltip,
} from "antd"
import "../../scss/Table.scss"
import { TableTwo } from "../../components/Constants/Tableone"
import "../../scss/Retailer.scss"
import Green from "../../../assets/green.svg"
import Red from "../../../assets/red.svg"
import { Base64 } from "js-base64"
import { CSVLink, CSVDownload } from "react-csv"
import { openTokenForm } from "../../Actions/ActionsType"
import Instance from "../../Api/Instance"
// import { useSelector, useDispatch } from "react-redux"
import DealerLayout from "../../components/Layout/DealerLayout"
import { RetailIcon } from "../../components/CustomIcons"
import { Link, navigateTo } from "gatsby"
import { retailerDetails } from "../../Actions/Actions"
import { array } from "prop-types"
import AdminInstance from "../../Api/AdminInstance"
const Dash_retail_icon = props => <Icon component={RetailIcon} {...props} />

const { TabPane } = Tabs

const { Option } = Select

const RetailerList = () => {
  const [openToken, setOpenToken] = useState(false)
  const [retailer, setRetailer] = useState([])
  const [message, setMessage] = useState("")
  const [messageAct, setMessageAct] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState([])
  const [name, setName] = useState("")
  const [sorted, setSorted] = useState([])
  const [filterText, setFilterText] = useState("")
  const [type, setType] = useState("")
  const [activateRetailer, setActivateRetailer] = useState({
    serviceCode: "ACT",
  })
  const [deactivateRetailer, setDeactivateRetailer] = useState({
    serviceCode: "DEA",
  })
  const [fund, setFund] = useState({
    serviceCode: "FUD",
  })
  const [inputChange, setInput] = useState({ serviceCode: "ACR" })
  const [inputRetailChange, setInputRetail] = useState({ serviceCode: "ADR" })

  const dispatch = useDispatch()

  useEffect(() => {
    //gets user details
    let onLogged = sessionStorage.getItem("persist:root")
      ? JSON.parse(sessionStorage.getItem("persist:root"))
      : []
    const { userData } = onLogged
    let allData = JSON.parse(userData)
    const { user_id } = allData

    // gets tokens
    let data = sessionStorage.getItem("topup")
      ? JSON.parse(sessionStorage.getItem("topup"))
      : []
    const username = Base64.decode(data.TOKEN_ONE)
    const password = Base64.decode(data.TOKEN_TWO)

    let data2 = sessionStorage.getItem("topup2")
      ? JSON.parse(sessionStorage.getItem("topup2"))
      : []
    const usernameA = Base64.decode(data2.TOKEN_ONE_ADMIN)
    const passwordA = Base64.decode(data2.TOKEN_TWO_ADMIN)
    const req = { serviceCode: "RTL", username, password, user_id }
    const req2 = {
      serviceCode: "RTL",
      username: usernameA,
      password: passwordA,
      user_id: 1,
    }

    let UserData = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : []

    console.log(UserData)

    // inputs for adding vtu line
    setInput({
      ...inputChange,
      username,
      password,
      user_id,
    })
    // inputs for adding retailers
    setInputRetail({
      ...inputRetailChange,
      username,
      password,
      user_id,
    })
    // inputs for Activating retailers
    setActivateRetailer({
      ...activateRetailer,
      username,
      password,
    })
    // inputs for Activating retailers
    setDeactivateRetailer({
      ...deactivateRetailer,
      username,
      password,
    })
    // inputs for funding retailers
    setFund({
      ...fund,
      username,
      password,
      user_id,
    })

    if (UserData.type === "Admin") {
      setType("Admin")
      // request for retailer list
      const request = new Promise(res => {
        res(AdminInstance.post("", req2))
      })
      console.log(request)
      request.then(({ data }) => {
        if (data.status === "200") {
          setRetailer(data.retailer)
        }
      })
    } else {
      // request for retailer list
      const request = new Promise(res => {
        res(Instance.post("", req))
      })
      request.then(({ data }) => {
        if (data.status === "200") {
          setRetailer(data.retailer)
        }
      })
    }
  }, [])
  const ColumnsTwo = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",

      // render: text => <a>{text}</a>,
    },
    {
      title: "Full name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",

      // render: text => <a>{text}</a>,
    },

    {
      title: "Retailer number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Wallet ballance",
      dataIndex: "balance",
      key: "balance",
      render: (text, record) => (
        <div>{`₦ ${parseInt(record.balance).toLocaleString()}`}</div>
      ),
    },

    {
      title: "USSD Code",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <div>
          {record.tp_no}
          {record.code}
        </div>
      ),

      // align: "right",
    },
    {
      title: "POS Status",
      dataIndex: "status",
      key: "status",

      render: text =>
        text === 1 ? (
          <p className="enabled">
            <Green className="dotPosition" />
            Enable
          </p>
        ) : (
          <p className="disabled">
            <Red className="dotPosition" />
            Disabled
          </p>
        ),
    },
    {
      title: "USSD Status",
      dataIndex: "ussd_status",
      key: "ussd_status",

      render: text =>
        text === 1 ? (
          <p className="enabled">
            <Green className="dotPosition" />
            Active
          </p>
        ) : (
          <p className="disabled">
            <Red className="dotPosition" />
            Inactive
          </p>
        ),
    },
    // {
    //   title: "Dealer",
    //   dataIndex: "d_id",
    //   key: "d_id",
    //   // align: "right",
    // },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",

      // align: "right",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popover
          content={
            <div className="pop_content">
              <p
                id={record.username}
                title={record.name}
                onClick={e => {
                  let id = e.target.id
                  setOpenToken(!openToken)
                  setFund({ ...fund, id })
                  setName(e.currentTarget.title)
                }}
              >
                Send Fund
              </p>
              {/* <p>Edit</p> */}
              <p id={record.id} title={record.type} onClick={ActivateRetailer}>
                {record.status === 1 ? "Deactivate POS" : "Activate POS"}
              </p>
              <p
                id={record.id}
                title={record.tp_id}
                onClick={ActivateUSSD}
                style={
                  record.code === null
                    ? { display: "none" }
                    : { display: "block" }
                }
              >
                {record.ussd_status === 1 ? "Deactivate USSD" : "Activate USSD"}
              </p>
              <p
                id={record.id}
                title={record.name}
                onClick={e => {
                  let details = {
                    user_id: e.currentTarget.id,
                    name: e.currentTarget.title,
                  }
                  dispatch(retailerDetails(details))
                  navigateTo(`/Dealer_Dashboard/RetailerHistory`)
                }}
              >
                Retailer's history
              </p>
            </div>
          }
          placement="bottom"
          trigger="click"
        >
          <span className="popover">...</span>
        </Popover>
      ),
    },
  ]

  // handle retail tab click{}
  const handleRetailTab = () => {
    setOpenToken(false)
  }

  // select user type
  function handleType(value) {
    setInput({
      ...inputChange,
      type: value,
    })
  }
  const handleChange = e => {
    setInput({
      ...inputChange,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  // handle ussd activation Submit
  const handleVTUSubmit = () => {
    setLoading(true)
    const submitRequest = new Promise(res => {
      res(Instance.post("", inputChange))
    })
    submitRequest.then(({ data }) => {
      let fields = data.required_fields
      let m = data.message
      if (data.status === "301") {
        setLoading(false)
        setError(fields)
        setTimeout(() => {
          setError([])
        }, 3000)
      } else if (data.status === "200") {
        setLoading(false)
        setMessageAct(m)
        // setTimeout(() => {
        //   setMessage("")
        // }, 3000)
      } else if (data.status === "300") {
        setLoading(false)
        setMessageAct(m)
        setTimeout(() => {
          setMessageAct("")
        }, 3000)
      }
    })
  }
  //////////////////////////////////////////////add retailer//////////////////////////////////////////////////////////////////////////////////////////
  const handleRetailChange = e => {
    setInputRetail({
      ...inputRetailChange,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  function handleRetailer(value) {
    setInputRetail({
      ...inputRetailChange,
      type: value,
    })
  }
  // submit retailer request
  const handleRetailerSubmit = () => {
    setLoading(true)
    const submitRequest = new Promise(res => {
      res(Instance.post("", inputRetailChange))
    })
    submitRequest.then(({ data }) => {
      let fields = data.required_fields
      let m = data.message
      if (data.status === "301") {
        setLoading(false)
        setError(fields)
        setTimeout(() => {
          setError([])
        }, 3000)
      } else if (data.status === "200") {
        setLoading(false)
        setMessage(m)
        setTimeout(() => {
          window.location.reload(false)
          setMessage("")
        }, 3000)
      } else {
        setLoading(false)
        setMessage(m)
        setTimeout(() => {
          setMessage("")
        }, 3000)
      }
    })
  }
  //////////////////////////////add retailer end/////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////ACTIVTE RETAILER//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const ActivateRetailer = async e => {
    let type = e.currentTarget.title
    let user_id = e.target.id
    let status = e.target.innerHTML
    let { serviceCode } = activateRetailer
    let { username } = activateRetailer
    let { password } = activateRetailer
    const Data = { serviceCode, username, password, type, user_id }
    const DataTwo = { serviceCode: "DEA", username, password, type, user_id }
    if (status === "Activate POS") {
      e.target.innerHTML = "Activating..."
      const submitRequest = new Promise(res => {
        res(Instance.post("", Data))
      })
      submitRequest.then(({ data }) => {
        let fields = data.required_fields
        let m = data.message
        if (data.status === "301") {
          setLoading(false)
          setError(fields)
          e.target.innerHTML = "Activate"
          setTimeout(() => {
            setError([])
          }, 3000)
        } else if (data.status === "200") {
          setLoading(false)
          setMessage(m)
          setTimeout(() => {
            setMessage("")
            window.location.reload(false)
          }, 3000)
        } else {
          setLoading(false)
          setMessage(m)
          e.target.innerHTML = "Activate"
          setTimeout(() => {
            setMessage("")
          }, 3000)
        }
      })
    } else if (status === "Deactivate POS") {
      e.target.innerHTML = "Deactivating..."
      const submitRequest = new Promise(res => {
        res(Instance.post("", DataTwo))
      })
      submitRequest.then(({ data }) => {
        let fields = data.required_fields
        let m = data.message
        if (data.status === "301") {
          setLoading(false)
          setError(fields)
          e.target.innerHTML = "Deactivate"
          setTimeout(() => {
            setError([])
          }, 3000)
        } else if (data.status === "200") {
          setLoading(false)
          setMessage(m)
          setTimeout(() => {
            setMessage("")
            window.location.reload(false)
          }, 3000)
        } else {
          setLoading(false)
          setMessage(m)
          e.target.innerHTML = "Deactivate"
          setTimeout(() => {
            setMessage("")
          }, 3000)
        }
      })
    }
  }
  ////////////////////ACTIVTE RETAILER END////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////ACTIVTE USSD//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const ActivateUSSD = async e => {
    let tp_id = e.currentTarget.title
    let rt_id = e.target.id
    let status = e.target.innerHTML
    let { username } = activateRetailer
    let { password } = activateRetailer
    const Data = {
      serviceCode: "RTAD",
      username,
      password,
      rt_id,
      type: "ACTIVATE",
    }
    const DataTwo = {
      serviceCode: "RTAD",
      username,
      password,
      rt_id,
      type: "DEACTIVATE",
    }
    if (status === "Activate USSD") {
      e.target.innerHTML = "Activating..."
      const submitRequest = new Promise(res => {
        res(Instance.post("", Data))
      })
      submitRequest.then(({ data }) => {
        let m = data.message
        if (data.status === "301") {
          setLoading(false)
          e.target.innerHTML = "Activate"
          setTimeout(() => {
            setError([])
          }, 3000)
        } else if (data.status === "200") {
          setLoading(false)
          setMessage(m)
          setTimeout(() => {
            setMessage("")
            window.location.reload(false)
          }, 3000)
        } else {
          setLoading(false)
          setMessage(m)
          e.target.innerHTML = "Activate"
          setTimeout(() => {
            setMessage("")
          }, 3000)
        }
      })
    } else if (status === "Deactivate USSD") {
      e.target.innerHTML = "Deactivating..."
      const submitRequest = new Promise(res => {
        res(Instance.post("", DataTwo))
      })
      submitRequest.then(({ data }) => {
        let fields = data.required_fields
        let m = data.message
        if (data.status === "301") {
          setLoading(false)
          setError(fields)
          e.target.innerHTML = "Deactivate"
          setTimeout(() => {
            setError([])
          }, 3000)
        } else if (data.status === "200") {
          setLoading(false)
          setMessage(m)
          setTimeout(() => {
            setMessage("")
            window.location.reload(false)
          }, 3000)
        } else {
          setLoading(false)
          setMessage(m)
          e.target.innerHTML = "Deactivate"
          setTimeout(() => {
            setMessage("")
          }, 3000)
        }
      })
    }
  }
  ////////////////////ACTIVTE USSD END////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////SEND FUNDS TO RETAILER//////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleFund = e => {
    setFund({ ...fund, [e.currentTarget.name]: e.currentTarget.value })
  }

  const handleFundTransfer = () => {
    setLoading(true)
    const sendRequest = new Promise(res => {
      res(Instance.post("", fund))
    })
    sendRequest.then(({ data }) => {
      let fields = data.required_fields
      let m = data.message
      if (data.status === "301") {
        setLoading(false)
        setError(fields)
        setTimeout(() => {
          setError([])
        }, 3000)
      } else if (data.status === "200") {
        setLoading(false)
        setMessage(m)
        setTimeout(() => {
          setMessage("")
        }, 3000)
      } else {
        setLoading(false)
        setMessage(m)
        setTimeout(() => {
          setMessage("")
        }, 3000)
      }
    })
  }
  ////////////////////retailer search////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const filteredItems = retailer.filter(
    item =>
      item.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase()) ||
      item.username.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())
  )

  const title = (
    <h4>
      <Dash_retail_icon style={{ marginRight: "10px" }} />
      Retailer List
    </h4>
  )
  ///////////export to csv///////////////////////////////////////////////////
  const headers = [
    { label: "Username", key: "username" },
    { label: "Full Name", key: "name" },
    { label: "Type", key: "type" },
    { label: "Retailer Number", key: "phone" },
    { label: "USSD Code", key: "code" },
    { label: "Status", key: "status" },
    { label: "Created at", key: "created_at" },
  ]

  return (
    <DealerLayout title={title} position={["2"]}>
      <div>
        <Tabs defaultActiveKey="1" onTabClick={handleRetailTab}>
          <TabPane tab="Retailer List" key="1">
            <div
              className={openToken ? "hide" : "table_container"}
              style={
                TableTwo.length <= 9 ? { height: "100vh" } : { height: "auto" }
              }
            >
              <div className="table_Group">
                <div className="table_header">
                  <div className="rowShow">
                    <Button>
                      <CSVLink
                        data={retailer}
                        filename={"Retailers.csv"}
                        headers={headers}
                        style={{ color: "white" }}
                      >
                        Export to CSV
                      </CSVLink>
                    </Button>
                  </div>
                  <div className="msg">{message}</div>
                  <div className="searchTable">
                    <Input
                      placeholder="Search Retailer…"
                      value={filterText}
                      onChange={e => {
                        setFilterText(e.target.value)
                      }}
                      prefix={
                        <Icon type="search" style={{ color: "#D8D8D8" }} />
                      }
                    />
                  </div>
                </div>
                <Table
                  columns={ColumnsTwo}
                  dataSource={filteredItems}
                  bordered
                  size="small"
                />
              </div>
            </div>
            <div className={openToken ? "sendTokenContainer" : "hide"}>
              <div className="sendTokenGroup">
                <div className="tokenTitle">
                  <h4>
                    Send Funds to{" "}
                    <span
                      style={{
                        color: "Green",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {name}
                    </span>
                  </h4>
                </div>
                <div className="tokenForm">
                  <Form layout="vertical">
                    {error.map(data => (
                      <div key={data} className="errors">
                        {data}
                      </div>
                    ))}
                    <div
                      className={
                        message === "Invalid Secret Key...Try again later!"
                          ? "errors"
                          : "msg"
                      }
                    >
                      {message}
                    </div>
                    <Form.Item label="AMOUNT">
                      <Input
                        name="amount"
                        type="number"
                        placeholder="N 1000"
                        onChange={handleFund}
                      />
                    </Form.Item>
                    <Form.Item label="Dealer Pin">
                      <Input
                        name="pin"
                        type="password"
                        placeholder="****"
                        onChange={handleFund}
                      />
                    </Form.Item>
                  </Form>
                </div>
                <div className="btnTokenGroup"></div>
                <div className="tokenBtn">
                  <Button
                    onClick={handleFundTransfer}
                    loading={!loading ? false : true}
                  >
                    Send Fund
                  </Button>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            tab="Add Retailer"
            key="2"
            disabled={type === "Admin" ? true : false}
          >
            <div className="formContainer">
              <div className="formTitle">
                <p>Add Retailer</p>
              </div>
              <div className="formGroup">
                <div className="adminForm">
                  {error.map(data => (
                    <div key={data} className="errors">
                      {data}
                    </div>
                  ))}
                  <div
                    className={
                      message === "Invalid Secret Key...Try again later!"
                        ? "errors"
                        : "msg"
                    }
                  >
                    {message}
                  </div>
                  <div className="formInput VTUInput">
                    <label htmlFor="name">Name</label>
                    <Input
                      placeholder="Enter Full Name"
                      name="name"
                      onChange={handleRetailChange}
                    />
                  </div>
                  <div className="formInput VTUInput">
                    <label htmlFor="type">Type</label>
                    <Select
                      style={{ width: "100%" }}
                      defaultValue="Select Type"
                      onChange={handleRetailer}
                    >
                      <Option value="REGULAR">RETAILER</Option>
                      <Option value="SUB DEALER">SUB DEALER</Option>
                    </Select>
                  </div>

                  <div className="formInput VTUInput">
                    <label htmlFor="name">Dealer Pin</label>
                    <Input
                      type="password"
                      placeholder="****"
                      name="pin"
                      onChange={handleRetailChange}
                    />
                  </div>
                </div>
              </div>
              <div className="adminFormBtn">
                <div className="btngroup">
                  <Button
                    onClick={handleRetailerSubmit}
                    loading={!loading ? false : true}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            tab="Activate USSD"
            key="3"
            disabled={type === "Admin" ? true : false}
          >
            <div className="formContainer">
              <div className="formTitle">
                <p>Activate USSD</p>
              </div>
              <div className="formGroup">
                <div className="adminForm">
                  {error.map(data => (
                    <div key={data} className="errors">
                      {data}
                    </div>
                  ))}
                  <div
                    className={
                      messageAct === "Invalid Secret Key...Try again later!"
                        ? "errors"
                        : "msg"
                    }
                  >
                    {messageAct}
                  </div>
                  <div className="formInput VTUInput">
                    <label htmlFor="name">Username</label>
                    <Input
                      placeholder="Enter Username e.g. 123434"
                      name="username"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="formInput VTUInput">
                    <label htmlFor="name">Number</label>
                    <Tooltip placement="topLeft" title="please start with 234">
                      <Input
                        maxLength={13}
                        minLength={13}
                        placeholder="23480********"
                        name="phone"
                        onChange={handleChange}
                        type="tel"
                      />
                    </Tooltip>
                  </div>
                  <div className="formInput VTUInput">
                    <label htmlFor="name">Name</label>
                    <Input
                      placeholder="Enter User's Name"
                      name="name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formInput VTUInput">
                    <label htmlFor="name">Type</label>
                    <Select
                      style={{ width: "100%" }}
                      defaultValue="Select Type"
                      onChange={handleType}
                    >
                      <Option value="REGULAR">RETAILER</Option>
                      <Option value="SUB DEALER">SUB DEALER</Option>
                    </Select>
                  </div>
                  <div className="formInput VTUInput">
                    <label htmlFor="pin">Dealer Pin</label>
                    <Input
                      placeholder="****"
                      type="password"
                      name="pin"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="adminFormBtn">
                <div className="btngroup">
                  <Button
                    onClick={handleVTUSubmit}
                    loading={!loading ? false : true}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </DealerLayout>
  )
}

export default RetailerList
