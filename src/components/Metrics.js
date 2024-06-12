import React, { useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,PieChart,Pie,Cell} from 'recharts';
// import { Bar } from 'react-chartjs-2';

// Total Revenue Component
export const TotalRevenue = ({ data }) => {
    
    const totalRevenue = data.reduce((sum, order) => sum + order.Items.reduce((itemSum, item) => itemSum + item.Total_Price, 0), 0);

    return (
        <div className="metric bgcolor">
            <h2>Total Revenue</h2>
            <p>${totalRevenue.toFixed(2)}</p>
        </div>
    );
};

// Order Volume Component
export const OrderVolume = ({ data }) => {
    const orderVolume = data.length;

    return (
        <div className="metric bgcolor" >
            <h2>Order Volume</h2>
            <p>{orderVolume} orders</p>
        </div>
    );
};

export const CustomersCount = ({ data }) => {
    const customerCount = data.length;

    return (
        <div className="metric bgcolor">
            <h2>Customers</h2>
            <p>{customerCount}</p>
        </div>
    );
};
export const Menus = ({ data }) => {
    const uniqueMenuItems = new Set();
    data.forEach(order => {
        order.Items.forEach(item => {
            uniqueMenuItems.add(item.Item_Name);
        });
    });
    const menusToday = uniqueMenuItems.size;

    return (
        <div className="metric bgcolor">
            <h2>Menus</h2>
            <p>{menusToday}</p>
        </div>
    );
};
// Top Selling Items Component
export const TopSellingItems = ({ data }) => {
    const itemSales = {};

    data.forEach(order => {
        order.Items.forEach(item => {
            if (itemSales[item.Item_Name]) {
                itemSales[item.Item_Name] += item.Quantity;
            } else {
                itemSales[item.Item_Name] = item.Quantity;
            }
        });
    });

    const topItems = Object.entries(itemSales).map(([name, quantity]) => ({ name, quantity })).slice(0,10);
    

    return (
        <div className="metric bg2">
            <h2>Top Selling Items</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topItems}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="lightgreen" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const LowSellingItems = ({ data }) => {
    const itemSales = {};

    data.forEach(order => {
        order.Items.forEach(item => {
            if (itemSales[item.Item_Name]) {
                itemSales[item.Item_Name] += item.Quantity;
            } else {
                itemSales[item.Item_Name] = item.Quantity;
            }
        });
    });

    const lowSellingItems = Object.entries(itemSales)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);
    

    return (
        <div className="metric bg3">
            <h2>Low Selling Items</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lowSellingItems}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};  

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const OrderStatus = ({ data }) => {
    const statusCount = data.reduce((acc, order) => {
        acc[order.Order_Status] = (acc[order.Order_Status] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

    return ( 
        <div className="metric bg4" style={{width:"50%"}}>
            <h2>Orders Status</h2>
            <ResponsiveContainer  height={300}>
                <PieChart>
                    <Pie dataKey="value" data={pieData} outerRadius={100} label>
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
        if (k === 'inventory' || k === 'Items') {
            return acc; // Skip these fields
        }
        const pre = prefix.length ? `${prefix}.` : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else if (Array.isArray(obj[k])) {
            acc[pre + k] = JSON.stringify(obj[k]);
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
};
export const CustomerDetails = ({ data }) => {
    const flattenedData = useMemo(() => data.map(order => flattenObject(order)), [data]);

    const keys = useMemo(() => {
        return flattenedData.length > 0 ? Object.keys(flattenedData[0]) : [];
    }, [flattenedData]);

    return (
        <>
        <h2 className='del'>Delivery Details</h2>
        <TableContainer component={Paper} className='tablecontainer'>
            <Table aria-label="customer details table">
                <TableHead className='stickyHeader '>
                    <TableRow>
                        {keys.map(key => (
                            <TableCell className='stickyHeader tablehead' key={key}>{key.replace(/_/g, ' ')}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {flattenedData.map((order, index) => (
                        <TableRow key={index}>
                            {keys.map(key => (
                                <TableCell key={key} className='tablebody'>
                                    {typeof order[key] === 'object' ? JSON.stringify(order[key]) : order[key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
};

 

 
export const InventoryStatusChart = ({ data }) => {
    // Extracting inventory data
    const items = data.map(item => ({
      name: item.name,
      quantity: item.quantity,
      reorderThreshold: item.reorder_threshold
    }));
  
    // Setting up data for the chart
    const inventoryData = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        backgroundColor: item.quantity < item.reorderThreshold ? 'red' : (item.quantity < 20 ? 'yellow' : 'green')
    })).slice(0,5);
  
    return (
      <div className='metric bg5' style={{width:"50%"}}>
        <h2>Inventory Status</h2>
        <ResponsiveContainer  height={300}>
            <BarChart data={inventoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
      </div>
    );
};

  
 