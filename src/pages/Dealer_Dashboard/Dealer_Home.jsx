import React, { useEffect, useState } from "react"
import {
  topCardDetails,
  Dealer_Activities,
} from "../../components/Constants/DealerDashHome"
import DealerTopCards from "../../components/DealerTopCards"
import "../../scss/Dealer_home.scss"
import { Button } from "antd"
import DealerActivities from "../../components/DealerActivities"
import Instance from "../../Api/Instance"
import { Base64 } from "js-base64"
import DealerLayout from "../../components/Layout/DealerLayout"
import { Link, navigateTo } from "gatsby"
import axios from "axios"
import AdminInstance from "../../Api/AdminInstance"

const Dealer_Home = () => {
  const [retailer, setRetailer] = useState([])
  const [user, setUser] = useState({})
  const [counter, setCounter] = useState("0")
  const [ussd, setUssd] = useState("0")
  const [ussdData, setUssdData] = useState([])
  const [data, setData] = useState("0")
  const [voucher, setVoucher] = useState("0")

  useEffect(() => {
    //gets user details
    let onLogged = sessionStorage.getItem("persist:root")
      ? JSON.parse(sessionStorage.getItem("persist:root"))
      : []
    const { userData } = onLogged
    let allData = JSON.parse(userData)
    const { user_id } = allData

    // get usaer type

    let UserData = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : []

    // gets tokens
    let data = sessionStorage.getItem("topup")
      ? JSON.parse(sessionStorage.getItem("topup"))
      : []
    let username = Base64.decode(data.TOKEN_ONE)
    let password = Base64.decode(data.TOKEN_TWO)

    // admin token
    let dataA = sessionStorage.getItem("topup2")
      ? JSON.parse(sessionStorage.getItem("topup2"))
      : []
    let usernameA = Base64.decode(dataA.TOKEN_ONE_ADMIN)
    let passwordA = Base64.decode(dataA.TOKEN_TWO_ADMIN)
    const req = { serviceCode: "RTL", username, password, user_id }

    // request for retailer list
    const request = new Promise(res => {
      res(Instance.post("", req))
    })
    request.then(({ data }) => {
      if (data.status === "200") {
        setRetailer(data.retailer)
      }
    })

    const reqs = { serviceCode: "SHP", username, password, user_id: "1" }
    const profile = new Promise(res => {
      res(Instance.post("", reqs))
    })
    profile.then(({ data }) => {
      let user = data.user
      console.log(user)
      if (user === undefined) {
        return false
      } else {
        setUser(user)
        setCounter(user.counter)
      }
    })

    if (UserData.type === "Admin") {
      // total USSD
      const ussdReqst = {
        serviceCode: "RTRA",
        username: usernameA,
        type: "USSD",
        password: passwordA,
      }

      const USSD = new Promise(res => {
        res(AdminInstance.post("", ussdReqst))
      })
      USSD.then(({ data }) => {
        let UssdAmount = data.totalamount
        setUssd(`₦ ${UssdAmount.toLocaleString()}`)
      })
      // total data
      const DataReqst = {
        serviceCode: "RTRA",
        username: usernameA,
        type: "DATA",
        password: passwordA,
      }
      const Data = new Promise(res => {
        res(AdminInstance.post("", DataReqst))
      })
      Data.then(({ data }) => {
        console.log(data)
        let DataAmount = data.totalamount
        setData(`₦ ${DataAmount.toLocaleString()}`)
      })
      // total voucher
      const VoucherReqst = {
        serviceCode: "RTRA",
        username: usernameA,
        type: "VOUCHER",
        password: passwordA,
      }
      const VOUCHER = new Promise(res => {
        res(AdminInstance.post("", VoucherReqst))
      })
      VOUCHER.then(({ data }) => {
        let VoucherData = data.totalamount
        setVoucher(`₦ ${VoucherData.toLocaleString()}`)
        setCounter(data.details.length)
      })
    } else {
      // total USSD
      const ussdReqst = {
        serviceCode: "RTRA",
        username,
        type: "USSD",
        password,
      }
      const USSD = new Promise(res => {
        res(Instance.post("", ussdReqst))
      })
      console.log(ussdReqst)
      USSD.then(({ data }) => {
        let UssdAmt = data.totalamount
        setUssd(`₦ ${UssdAmt.toLocaleString()}`)
      })
      // total data
      const DataReqst = {
        serviceCode: "RTRA",
        username,
        type: "DATA",
        password,
      }
      const Data = new Promise(res => {
        res(Instance.post("", DataReqst))
      })
      Data.then(({ data }) => {
        let DataAmt = data.totalamount

        setData(`₦ ${DataAmt.toLocaleString()}`)
      })
      // total voucher
      const VoucherReqst = {
        serviceCode: "RTRA",
        username,
        type: "VOUCHER",
        password,
      }
      const VOUCHER = new Promise(res => {
        res(Instance.post("", VoucherReqst))
      })
      VOUCHER.then(({ data }) => {
        let VoucherAmt = data.totalamount
        setCounter(data.details.length)
        setVoucher(`₦ ${VoucherAmt.toLocaleString()}`)
      })
      // something....
      const RetailerReqst = {
        serviceCode: "TRAL",
        username,
        type: "VOUCHER",
        password,
      }
      const rtail = new Promise(res => {
        res(Instance.post("", RetailerReqst))
      })
      rtail.then(({ data }) => {
        console.log(data)
        return
        let VoucherArry = data.details
        let sum = VoucherArry.reduce(function(total, currentValue) {
          let newValue = parseInt(currentValue.amount)
          return total + newValue
        }, 0)
        setVoucher(`₦ ${sum.toLocaleString()}`)
      })
    }
  }, [])

  const Dealer_Activity = [
    { title: "Total VTU Transactions", price: "N37,360" },
    { title: "Total voucher transaction", price: voucher },
    { title: "Total USSD transaction", price: ussd },
    { title: "Total data transaction", price: data },
    { title: "Total bills payment transaction", price: "N0" },
    { title: "This month transaction", price: "N37,360" },
  ]

  return (
    <>
      <div className="dealer_home_container">
        <div className="dealer_home_group">
          <div className="dash_dealer_top">
            {topCardDetails.map(data => {
              return (
                <DealerTopCards
                  number={retailer.length}
                  description={data.desc}
                  voucher={counter}
                />
              )
            })}
          </div>
          <div className="activity_container">
            <div className="top_activity_container">
              <h4>Activities</h4>
              {/* <Button>Add Retailer</Button> */}
            </div>
            <div className="all_activities_container">
              <div className="allActivityGroup">
                {Dealer_Activity.map(data => {
                  return (
                    <DealerActivities
                      title={data.title}
                      price={data.price}
                      viewClicked={() => {
                        navigateTo("/Dealer_Dashboard/ViewDetails")
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dealer_Home
