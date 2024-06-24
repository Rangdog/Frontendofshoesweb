import AxiosInstance from "./AxiosInstante";
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, IconButton, Box  } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Add, Remove } from '@mui/icons-material';
import Order from "./Order";
const Cart = ()=>{
    const [cartItems, setCartItems] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const getCartItem = async() =>{
        try {
            const res = await AxiosInstance.get("api/listcartitem/");
            setCartItems(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }
    const handleOrder = () => {
        enqueueSnackbar('Đặt hàng thành công', {
            variant: 'success',
            autoHideDuration: 3000,
        });

    }
    const handleDecreaseQuantity = (id) =>{
        AxiosInstance.patch(`api/cartitemdecreasequantity/${id}/`,{}).then((res)=>{
            if(res.status === 200){
                enqueueSnackbar('Giảm số lượng sản phẩm thành công',  {
                    variant: 'success', // Đặt thành dạng success
                    autoHideDuration: 3000, // 3000ms = 3 giây
                })
                getCartItem();
            }
        }
        ).catch(()=>{       
            enqueueSnackbar('Không thể giảm số lượng sản phẩm',  {
                variant: 'error', // Đặt thành dạng success
                autoHideDuration: 3000, // 3000ms = 3 giây
            })
        })
    }
    const handleIncreaseQuantity = (id) =>{
        AxiosInstance.patch(`api/cartitemincreasequantity/${id}/`,{}).then(()=>{
            enqueueSnackbar('Tăng số lượng sản phẩm thành công',  {
                variant: 'success', // Đặt thành dạng success
                autoHideDuration: 3000, // 3000ms = 3 giây
            })
            getCartItem();
        }
        )
    }
    const handleBtnDelete = (id) =>{
        AxiosInstance.delete(`api/cartitem/${id}/`,{}).then(()=>{
            enqueueSnackbar('Xóa thành công',  {
                variant: 'success', // Đặt thành dạng success
                autoHideDuration: 3000, // 3000ms = 3 giây
            })
            getCartItem();
        }
        )
    }
    useEffect(()=>{
        getCartItem();
    },[])
    return(
        <>
            <Container>
                <Typography variant="h3" align="center" gutterBottom paddingTop="20px">
                    Giỏ hàng của bạn
                </Typography>
                <Grid container spacing={4} direction="row">
                    {cartItems.length > 0? (
                        cartItems.map((item) => (
                            <Grid item key = {item.id} xs={12}>
                                <Card sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <CardMedia component="img" alt={item.product.productName} image={item.product.imgURL} sx={{ width: 300, height: 200 }}/>
                                    <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                                        <Typography variant="h5" component="div" sx = {{padding: '20px'}}>
                                            {item.product.productName}
                                        </Typography>
                                        <Typography variant="body2" component="text.secondary">
                                            <IconButton onClick={() => handleDecreaseQuantity(item.id)} size="small">
                                                    <Remove />
                                            </IconButton>
                                            Quantity: {item.quantity}
                                            <IconButton onClick={() => handleIncreaseQuantity(item.id)} size="small">
                                                <Add />
                                            </IconButton>
                                        </Typography>
                                        <Typography variant="body2" component="text.secondary">
                                            Price: {item.product.price}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                                        <Button variant="contained"
                                            sx={{
                                                backgroundColor: '#FF5733',
                                                color: '#FFFFFF',
                                                padding: '4px 8px', // Giảm kích thước button
                                                minWidth: '50',
                                                '&:hover': {
                                                    backgroundColor: '#C70039',
                                                    color: '#000000',
                                                },
                                            }}
                                            fullWidth
                                            onClick={() => handleBtnDelete(item.id)}>
                                            Xóa
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ): (
                        <Typography variant="h6" align="center" gutterBottom>
                            Your cart is empty
                        </Typography>
                    )}
                </Grid>
                {cartItems.length > 0 && (
                    <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">
                            Tổng tiền: {calculateTotalPrice()} VND
                        </Typography>
                    </Box>
                )}
            </Container>
            <Order/>
        </>
    )
}
export default Cart