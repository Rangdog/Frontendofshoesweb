
import {React, useEffect, useMemo, useState} from 'react'
import { Box } from "@mui/material"
import Navbar from './Navbar'
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
import AxiosInstance from './AxiosInstante';
import {useSnackbar } from 'notistack';
const Home = ()=>{
    const { enqueueSnackbar } = useSnackbar();
    const handleBuyClick = ()=>{
        const token = localStorage.getItem('Token')  
        if(token){
            enqueueSnackbar('Bạn đã thêm sản phẩm vào giỏ hàng',  {
                variant: 'success', // Đặt thành dạng success
                autoHideDuration: 3000, // 3000ms = 3 giây
              });
        }
        else{
            enqueueSnackbar('Vui lòng đăng nhập',  {
                variant: 'warning', 
                autoHideDuration: 3000,
              });
        }
    }
    const [products, setProducts] = useState([])
    const getProduct = async()=>{
        try {
            const res = await AxiosInstance.get("api/products/");
            setProducts(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    useEffect(()=>{
        getProduct();
    },[])
    return(
        <>
            <Navbar/>
            <Box mt={12}>
                <Container>
                    <Typography variant="h3" align="center" gutterBottom>
                    Welcome to the Shoe Store
                    </Typography>
                    <Grid container spacing={4}>
                    {products.length > 0 ? (
                            products.map((product) => (
                                <Grid item key={product.id} xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            alt={product.productName}
                                            height="150"
                                            image={product.imgURL}
                                        />
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {product.productName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product.price}
                                            </Typography>
                                        </CardContent>
                                        <Button variant="contained"  
                                                sx={{
                                                backgroundColor: '#FF5733', // Màu nền tùy chỉnh
                                                color: '#FFFFFF', // Màu chữ tùy chỉnh
                                                '&:hover': {
                                                    backgroundColor: '#C70039', // Màu nền khi hover tùy chỉnh
                                                    color: '#000000', // Màu chữ khi hover tùy chỉnh
                                                },
                                                }} fullWidth
                                                onClick={handleBuyClick}>
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" align="center" gutterBottom>
                                Loading product
                            </Typography>
                        )}
                    </Grid>
                </Container>
            </Box>
        </>
    )
}

export default Home