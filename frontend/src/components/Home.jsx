
import {React, useEffect, useMemo, useState} from 'react'
import { Box } from "@mui/material"
import Navbar from './Navbar'
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardMedia, CardContent, Button } from '@mui/material';
const products = [
    { id: 1, name: 'Shoe 1', price: '$100', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Shoe 2', price: '$120', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Shoe 3', price: '$150', image: 'https://via.placeholder.com/150' },
    // Add more products as needed
  ];
const Home = ()=>{
    return(
        <>
            <Navbar/>
            <Container>
                <Typography variant="h3" align="center" gutterBottom>
                Welcome to the Shoe Store
                </Typography>
                <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                    <Card>
                        <CardMedia
                        component="img"
                        alt={product.name}
                        height="150"
                        image={product.image}
                        />
                        <CardContent>
                        <Typography variant="h5" component="div">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {product.price}
                        </Typography>
                        </CardContent>
                        <Button variant="contained" color="primary" fullWidth>
                        Buy Now
                        </Button>
                    </Card>
                    </Grid>
                ))}
                </Grid>
            </Container>
        </>
    )
}

export default Home