import AxiosInstance from "./AxiosInstante";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, Box } from '@mui/material';
import { useSnackbar } from 'notistack';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const fetchOrderHistory = async () => {
        try {
            const res = await AxiosInstance.get("api/orderhistory/");
            setOrders(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching order history:', error);
            enqueueSnackbar('Lỗi khi tải lịch sử đơn hàng', {
                variant: 'error',
                autoHideDuration: 3000,
            });
        }
    }

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    return (
        <Container>
            <Typography variant="h3" align="center" gutterBottom paddingTop="20px">
                Lịch sử đơn hàng
            </Typography>
            <Grid container spacing={4} direction="column">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <Grid item key={order.id} xs={12}>
                            <Card sx={{ padding: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                                        Order ID: {order.id}
                                    </Typography>
                                    <Typography variant="body2" component="div" sx={{ marginBottom: 2 }}>
                                        Date: {new Date(order.date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" component="div" sx={{ marginBottom: 2 }}>
                                        Total Amount: {order.total} VND
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        Items:
                                    </Typography>
                                    <List>
                                        {order.items.map((item) => (
                                            <ListItem key={item.id} sx={{ paddingLeft: 0 }}>
                                                <ListItemText
                                                    primary={item.productName}
                                                    secondary={`Quantity: ${item.quantity}, Price: ${item.price} VND`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center" gutterBottom>
                        You have no order history
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}

export default OrderHistory;
