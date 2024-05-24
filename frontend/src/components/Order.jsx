
import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { debounce } from 'lodash';
const Order = ()=>{
    const [address, setAddress] = useState('');
    const [results, setResults] = useState([]);
    
    const handleDebouncedSearch = debounce((address) => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}&countrycodes=VN`)
          .then(response => response.json())
          .then(data => setResults(data));
      }, 300); // // Thời gian chờ là 300ms
      
    const handleAddressChange = (event) => {
        const newAddress = event.target.value;
        setAddress(newAddress);
        handleDebouncedSearch(newAddress);
    };

    const handleSelectAddress = () => {
        // Gửi yêu cầu tìm kiếm địa chỉ đến API và xử lý kết quả trả về
        handleDebouncedSearch(address);
    };
    return (
        <div>
            <h2>Chọn Địa Chỉ</h2>
            <TextField
                label="Nhập địa chỉ"
                variant="outlined"
                value={address}
                onChange={handleAddressChange}
            />
            <Button variant="contained" onClick={handleSelectAddress}>Chọn</Button>
    
            <List>
                {results.map((result, index) => (
                    <ListItem key={index}>
                    <ListItemText primary={result.display_name} />
                    </ListItem>
                ))}
            </List>
        </div>
      );
}

export default Order