import React , {useState , useEffect} from "react";
import './Admin.css'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Admin() {
  const [inwardData, setinwardData] = useState([])
  const [outwardData, setoutwardData] = useState([])
  const [CompleteData, setCompleteData] = useState([])
  const [Value, setValue] = React.useState('');
    const handleChange = (event) => {
      setValue(event.target.value);
    };


  useEffect(() => {
    fetch("https://wingrowmain.herokuapp.com/inward")
    .then((res)=>res.json())
    .then(res=>{
      setinwardData(res);
    })
  }, [])


  useEffect(() => {
    fetch("https://wingrowmain.herokuapp.com/outward")
    .then((res)=>res.json())
    .then(res=>{
      setoutwardData(res);
    })
  }, [])

  useEffect(() => {
    if(inwardData&&outwardData){
      let res = {}
      res.inward = inwardData;
      res.outward = outwardData;
      setCompleteData(res);
    }
  }, [inwardData , outwardData])

  
  const farmerMarkets = []
  const farmers = []
  let TotalPurchaseQty = 0
  let TotalPurchaseAmount = 0


  inwardData.forEach((e)=>{
    const {data} = e
    farmerMarkets.push(e.farmers_market)
    farmers.push(e.farmer_name)
    TotalPurchaseAmount+=e.total_cummulative_purchase
    data.forEach((e)=>{
      TotalPurchaseQty+=e.purchase_quantity
    })
  })

  let totalSalesQty = 0
  let totalSalesAmount = 0

  outwardData.forEach((e)=>{
    totalSalesAmount+=e.total_cummulative_sales
    const {data} = e
    data.forEach((e)=>{
      totalSalesQty+=e.sales_quantity
    })
  })


  const finalMarketsArr = [...new Set(farmerMarkets)]
  const finalNamesArr = [...new Set(farmers)]
  let totalFarmersProfit = Math.abs(totalSalesAmount-TotalPurchaseAmount)


  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  
  const exportToJson = e => {
    e.preventDefault()
    downloadFile({
      data: JSON.stringify(CompleteData),
      fileName: 'data.json',
      fileType: 'text/json',
    })
  }
  return (
    <div className="admin">
      {
        (inwardData&&outwardData)?
        <div className="admin_data">
              <span>Total Farmers Market : {finalMarketsArr.length}</span>
              <span>Total No. of Farmers : {finalNamesArr.length}</span>
              <span>Total quantity purchased : {TotalPurchaseQty}</span>
              <span>Total purchase amount : {TotalPurchaseAmount}</span>
              <span>Total sales quantity : {totalSalesQty}</span>
              <span>Total sales amount : {totalSalesAmount}</span>
              <span>Total farmers profit : {totalFarmersProfit}</span>
              <br/>
            <button onClick={exportToJson}>download data</button>
        </div>:
        <h1>Loading...</h1>
      }
        <div className="farmers_drop_data">
          <Box sx={{width:"50%",margin:5,padding:2}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">choose market</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Value}
              label="Value"
              onChange={handleChange}
            >
              <MenuItem value="HADAPSAR">HADAPSAR</MenuItem>
              <MenuItem value="KARVE NAGAR">KARVE NAGAR</MenuItem>
              <MenuItem value="PUNE">PUNE</MenuItem>
            </Select>
          </FormControl>
        </Box>
          <div>
            {(inwardData)?inwardData.filter((e)=>e.farmers_market===Value).map((e , i)=>{
              const { data } = e;
              return(
              <div className="farmer_market" key={i}>
                <div>Farmers name : {e.farmer_name}</div>
                <div>Farmers market : {e.farmers_market}</div>
                <div>Farmers phone No : {e.mobile_num}</div>
                <div>
                Commodities : 
                  {data.map((e,i)=>{
                    return(<div>
                      <div>{e.commodity}</div>
                    </div>)
                  })}
                </div>
              </div>)
            }):<h2>Data Loading....</h2>}
          </div>
          </div>
    </div>
  );
}

export default Admin;
