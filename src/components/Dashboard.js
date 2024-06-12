import React, { useEffect, useState } from 'react';
import { TotalRevenue,
     OrderVolume, 
     TopSellingItems,
     OrderStatus,
     CustomerDetails,
     CustomersCount,
     Menus,
     LowSellingItems,
     InventoryStatusChart
    } from './Metrics';
import '../App.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';



import {json} from './Orders'

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    useEffect(() => {
    setData(json);
     console.log(json[0].inventory)
   
    }, []);
    
    // const filterDataByDate = (data, startDate, endDate) => {
    //     if (!startDate || !endDate) return data;
    //     const start = new Date(startDate);
    //     const end = new Date(endDate);

    //     return data.filter(order => {
    //         const result =  order.Order_Date === start
    //         console.log(order.Order_Date,"order.Order_Date")
    //         const orderDate = new Date(order.Order_Date);
          
    //     });
    //     setData(data)
           
    // };


   

  


  
   
    return (
        <div className="dashboard" >    
            <div className="date">
            <h2>Restaurant Dashboard</h2>
     {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}  >
        <DatePicker label="From Date"  value={startDate}
          onChange={(newValue) => setStartDate(newValue)}/>
        <DatePicker label="To Date"  value={endDate}
          onChange={(newValue) => setEndDate(newValue)}/>
        <Button onClick={() => filterDataByDate(data, startDate, endDate)} variant="contained">Apply</Button>
        </DemoContainer>
    </LocalizationProvider> */}     
    </div>
  <div className="metrics">
            <TotalRevenue data={data} />
            <OrderVolume data={data} />
            <CustomersCount data={data}/>
            <Menus data={data}/>
           </div>
           <div  className="metrics">
           <TopSellingItems data={data} />
           <LowSellingItems data = {data}/> 
           </div>
            <div className="metrics1">
                <OrderStatus data={data} />
                 <InventoryStatusChart data={json[0].inventory}/>
                
            </div>
            
                <CustomerDetails data={data}/>
             
        </div>
    );
};

export default Dashboard;
