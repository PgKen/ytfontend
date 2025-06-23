import React, { useState } from 'react';

function InputPrice() {
    const [price, setPrice] = useState('');

    const handleChange = (e) => {
        setPrice(e.target.value);
    };

    return (
        <div>
            <label htmlFor="price-input">Price:</label>
            <input
                id="price-input"
                type="number"
                value={price}
                onChange={handleChange}
                placeholder="Enter price"
            />
        </div>
    );
}

export default InputPrice;