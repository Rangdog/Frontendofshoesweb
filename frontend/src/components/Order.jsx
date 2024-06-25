import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TextField, Container, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import AxiosInstance from './AxiosInstante';
import {useSnackbar} from 'notistack'

// Thiết lập icon cho marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const Order = ( props ) => {

  const [address, setAddress] = useState('');
  const [openMap, setOpenMap] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [tempAddress, setTempAddress] = useState('');
  const [userPosition, setUserPosition] = useState([21.028511, 105.804817]); // Default to Hanoi
  const { enqueueSnackbar } = useSnackbar()

  const listProduct = props.cartItems
  const total = props.total
  const getCartItems = props.getCratItem
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error fetching user location:', error);
        }
      );
    }
  }, []);

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();

      console.log('API Data:', data); // Kiểm tra dữ liệu trả về từ API

      if (data) {
        setAddress(data.display_name); // Đặt giá trị đầu tiên vào state address
        setTempAddress(data.display_name); // Cập nhật địa chỉ tạm thời khi chọn trên bản đồ
      } else {
        setAddress('Không tìm thấy địa chỉ.');
        setTempAddress('Không tìm thấy địa chỉ.');
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
      setAddress('Lỗi khi tìm địa chỉ.');
      setTempAddress('Lỗi khi tìm địa chỉ.');
    }
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}&countrycodes=VN`);
      const data = await response.json();

      if (data.length > 0) {
        return [data[0].lat, data[0].lon];
      } else {
        return userPosition; // return default user position if address is not found
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return userPosition; // return default user position in case of error
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      fetchAddressByInput();
    }
  };

  const handleClick = () => {
    fetchAddressByInput();
  };

  const fetchAddressByInput = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${getValues('address')}&countrycodes=VN`);
      const data = await response.json();

      console.log('API Data:', data); // Kiểm tra dữ liệu trả về từ API

      if (data.length > 0) {
        setAddress(data[0].display_name); // Đặt giá trị đầu tiên vào state address
      } else {
        setAddress('Không tìm thấy địa chỉ.');
      }
    } catch (error) {
      console.error('Error fetching address data:', error);
      setAddress('Lỗi khi tìm địa chỉ.');
    }
  };

  const handleOpenMap = async () => {
    if (address) {
      const [lat, lon] = await fetchCoordinates(address);
      setUserPosition([lat, lon]);
    }
    setOpenMap(true);
  };

  const handleCloseMap = () => {
    setOpenMap(false);
    setTempAddress('');
  };

  const handleConfirmAddress = () => {
    if (selectedPosition) {
      setAddress(tempAddress);
      setValue('address', tempAddress); // Update the form value for address
      setOpenMap(false);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setSelectedPosition(e.latlng);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      }
    });

    return selectedPosition === null ? null : (
      <Marker position={selectedPosition}></Marker>
    );
  };

  const schema = yup.object({
    address: yup.string().required('Address is required'),
    phoneNumber: yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Phone number is not valid'),
  });


  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
  });

  const submission = async (data) => {
    try{
      const res = await AxiosInstance.post(`api/createorder/`,{
        address:data.address,
        number: data.number,
        total: total,
        product: listProduct,
        paymentMethod: data.paymentMethod,
      })
      if(res.status === 200){
        enqueueSnackbar("Thành công", {variant : 'success', autoHideduration : 3000});
        getCartItems()
      }
      else{
        enqueueSnackbar("Thất bại", {variant : 'error', autoHideduration : 3000});
      }
    }
    catch(e){
      console.log(e)
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(submission)}>
        <Typography variant="h4" gutterBottom>
          Địa Chỉ
        </Typography>
        <Box display="flex" alignItems="center">
          <TextField
            label="Nhập địa chỉ"
            variant="outlined"
            fullWidth
            focused
            onKeyDown={handleKeyDown}
            {...register('address')}
            error={!!errors.address}
            helperText={errors.address ? errors.address.message : ''}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            sx={{ marginLeft: 2 }}
          >
            Chọn
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenMap}
            sx={{ marginLeft: 2 }}
          >
            Chọn địa chỉ trên bản đồ
          </Button>
        </Box>
        <Typography variant="h6" gutterBottom>
          Kết quả: {address}
        </Typography>

        <Dialog open={openMap} onClose={handleCloseMap} maxWidth="md" fullWidth>
          <DialogTitle>Chọn địa chỉ trên bản đồ</DialogTitle>
          <DialogContent>
            <MapContainer center={userPosition} zoom={13} style={{ height: '400px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
            </MapContainer>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              Địa chỉ tạm thời: {tempAddress}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMap} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={handleConfirmAddress} color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="h4" gutterBottom>
          Số điện thoại
        </Typography>
        <Box display="flex" alignItems="center" sx={{ width: '75%' }}>
          <TextField
            label="Nhập số điện thoại"
            variant="outlined"
            fullWidth
            {...register('phoneNumber')}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
          />
        </Box>
        <Typography variant="h4" gutterBotton>
          Phương thức thanh toán
        </Typography>
        <Box display="flex" alignItems="center" sx= {{width: '75%' , marginTop: '10px'}}>
          <TextField
            select
            label = "Chọn phương thức thanh toán"
            variant = "outlined"
            fullWidth
            {...register('paymentMethod')}
          >
            <MenuItem key = {1} value = {1}>Thanh toán bằng tiền mặt</MenuItem>
          </TextField>
        </Box>
        <Button
          disabled = {listProduct.length == 0}
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            margin: '10px 0px',
            backgroundColor: '#28a745',
            '&:hover': {
              backgroundColor: '#218838',
            },
          }}
        >
          Đặt hàng
        </Button>
      </form>
    </Container>
  );
}

export default Order;
