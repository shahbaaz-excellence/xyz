import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button, Form, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { GetDataRequest } from "../Redux/actions";
import { CSVLink } from "react-csv";
import { CSVReader } from 'react-papaparse'

const DownloadCSV = () => {

    const dispatch = useDispatch();
    const [list, setlist] = useState([]);
    const [itemList, setitemList] = useState([]);
    const [emptyCogs, setemptyCogs] = useState([]);
    const [filledCogs, setfilledCogs] = useState([]);
    const [cogValue, setcogValue] = useState()


    useEffect(() => {
        dispatch(GetDataRequest())
    }, [])


    const dataitemList = useSelector((state) =>
        state.getDataStatus.dataList.response
    )

    useEffect(() => {
        setlist(dataitemList)
    }, [dataitemList])


    let keys = [];
    let values = [];


    const handleOnDrop = (dataArrays) => {
        keys = dataArrays[0]
        values = dataArrays.splice(1, dataArrays.length)

        // console.log(dataArrays);

        let newArray = [];

        values.forEach((item) => {
            let dataObject = {}
            item.data.forEach((val, valIndex) => {
                keys.data.forEach((key, keyIndex) => {
                    if (keyIndex == valIndex)
                        dataObject[key] = val;
                })
            })
            newArray.push(dataObject)
        })
        console.log(newArray, "yyyyyyyy")
        setitemList(newArray);

        setfilledCogs(newArray.filter((item) => {
            if (item.cogs) {
                return item
            }
        }))

        setemptyCogs(newArray.filter((item) => {
            if (!item.cogs) {
                return item
            }
        }))
    }

    // console.log(emptyCogs, "2222222");
    // console.log(filledCogs, "333333");

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }





    const submitCog =async (e, itemID) => {
        e.preventDefault()
     const  newData=  itemList.map((value) => {
     
            if (value.id === itemID) {
                return{
                    ...value,cogs:cogValue
                }
            }
                else{
                return value
                }
        })
      await  setitemList(newData)
      setcogValue('')

    }

    useEffect(() => {
        console.log(itemList,'YYYYYYYYYYYYYYY')
        setfilledCogs(itemList.filter((item) => {
            if (item.cogs) {
                return item
            }
        }))

        setemptyCogs(itemList.filter((item) => {
            if (!item.cogs) {
                return item
            }
        }))

    }, [itemList])


    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">COGS MANAGER</Navbar.Brand>
                <Nav className="mr-auto">
                </Nav>
            </Navbar>
            <Container>

                {list && list.length > 0 ? <CSVLink
                    data={list}>
                    <Button variant="success"
                    >Download CSV File</Button>
                </CSVLink> : null}

                <CSVReader
                    onDrop={handleOnDrop}
                    onError={handleOnError}
                    noDrag
                    addRemoveButton
                >
                    <span>Click to upload.</span>
                </CSVReader>
            </Container>

            <Container>
                <h2>Non-Empty Cogs : {filledCogs.length}</h2>

                {filledCogs.map((item, index) => {

                    return (
                        <div key={index}>
                            <div style={{ border: "1px solid black", height: "100px", width: "75%", display: "inline-block" }}>
                                <p style={{}}>{item.title}</p>
                                <p style={{ display: "inline-flex" }}>Sku: {item.sku} </p>
                                <p style={{ display: "inline-flex" }}>Price : {item.price}</p>
                            </div>
                            <div style={{ border: "1px solid black", height: "100px", width: "25%", float: "right" }}>
                                <p>COGS :  {item.cogs}</p>
                            </div>
                        </div>
                    )
                })}

            </Container>

            <Container>
                <h2>Non-Empty Cogs : {emptyCogs.length}</h2>

                {emptyCogs.map((item, index) => {

                    return (
                        <div key={index}>
                            <div style={{ border: "1px solid black", height: "100px", width: "75%", display: "inline-block" }}>
                                <p style={{}}>{item.title}</p>
                                <p style={{ display: "inline-flex" }}>Sku: {item.sku} </p>
                                <p style={{ display: "inline-flex" }}>Price : {item.price}</p>
                            </div>
                            <div style={{ border: "1px solid black", height: "100px", width: "25%", float: "right" }}>
                                <p>COGS :  <form onSubmit={(e) => submitCog(e, item.id)}><input type="text"  onChange={e => setcogValue(e.target.value)} /></form></p>
                            </div>
                        </div>
                    )
                })}

            </Container>
        </div>
    )
}

export default DownloadCSV;
