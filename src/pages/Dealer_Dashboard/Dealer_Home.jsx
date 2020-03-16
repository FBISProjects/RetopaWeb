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

    // gets tokens
    let data = sessionStorage.getItem("topup")
      ? JSON.parse(sessionStorage.getItem("topup"))
      : []
    const username = Base64.decode(data.TOKEN_ONE)
    const password = Base64.decode(data.TOKEN_TWO)
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
      setUser(user)
      setCounter(user.counter)
    })

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
    USSD.then(({ data }) => {
      let UssdArry = data.balance
      let sum = UssdArry.reduce(function(total, currentValue) {
        return total + currentValue.amount
      }, 0)
      setUssdData(UssdArry)
      setUssd(`₦ ${sum.toLocaleString()}`)
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
      console.log(data)
      let DataArry = data.details
      let sum = DataArry.reduce(function(total, currentValue) {
        let newValue = parseInt(currentValue.amount)
        return total + newValue
      }, 0)
      setData(`₦ ${sum.toLocaleString()}`)
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
      let VoucherArry = data.details
      let sum = VoucherArry.reduce(function(total, currentValue) {
        let newValue = parseInt(currentValue.amount)
        return total + newValue
      }, 0)
      setVoucher(`₦ ${sum.toLocaleString()}`)
    })
  }, [])

  const handleClicked = () => {
    navigateTo(`../Dealer_Dashboard/ViewDetails`)
  }

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
                      viewClicked={handleClicked}
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
