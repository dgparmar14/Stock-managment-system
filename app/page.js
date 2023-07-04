"use client"
import Header from '@/components/Header';
import Image from 'next/image';
import { stringify } from 'postcss';
import { useState, useEffect } from 'react';
import React from 'react';


export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [newProducts, setnewProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dropdown, setDropdown] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {

      const response = await fetch('api/product');
      let rjson = await response.json();

      setProducts(rjson.allProducts);
    }
    fetchProducts()
  }, [])

  const onDropdownEdit = async (e) => {
    let value=e.target.value;
    setQuery(value)

    if (value.length>=2) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch(`api/search?query=${query}`);

      let rjson = await response.json();

      setDropdown(rjson.product);
      setLoading(false);
    }
    else if(value.length==0){
      setDropdown([])
    }
  }
  const addProduct = async (e) => {
   
    // Prepare data object
    try {

      // Send POST request to /api/product endpoint
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        // Product added successfully
        console.log('Product added successfully');
        setAlert("Product Added Successfully");
        setProductForm({});
      } else {
        // Error adding product
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
    //Fetch a;=ll the products again to sync back
    const response = await fetch('api/product');
    let rjson = await response.json();
    console.log(rjson.allProducts);
    setProducts(rjson.allProducts);
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const btnAction= async(action,slug,intitialquantity)=>{
    //on dropdown
    let indexDrop =  dropdown.findIndex((item)=>item.slug==slug)
    console.log(indexDrop);
    let newDropDown =  JSON.parse(JSON.stringify(dropdown))
    console.log(newDropDown);
    if(action=="add"){
      newDropDown[indexDrop].quantity=  parseInt(intitialquantity)+1;
    }
    else{
      newDropDown[indexDrop].quantity=parseInt(intitialquantity)-1;
    }
    setDropdown(newDropDown);
   
    // on  product table update
    let index =products.findIndex((item)=>item.slug==slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if(action=="add"){
      newProducts[index].quantity=parseInt(intitialquantity)+1;
    }
    else{
      newProducts[index].quantity=parseInt(intitialquantity)-1;
    }
    setProducts(newProducts)
    
    setActionLoading(true);
    try {

      // console.log( action, slug, intitialquantity );
      // Send POST request to /api/product endpoint
      const response = await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',},
        body: JSON.stringify({action,slug,intitialquantity})
      });
      setProducts(newProducts)
     
      setActionLoading(false)
  }catch (error) {
    console.error('Error action product:', error);
  }
  }
  // Get unique categories from stockData
  // const categories = Array.from(new Set(stockData.map((item) => item.price)));

  return (
    <div className="w-[90%] mx-auto">
      <Header />
      <div className='text-green-800 text-center'>{alert}</div>
      <div className="container bg-gray-100 p-6 rounded-lg shadow-md mb-5 " >
        <h1 className="text-2xl font-bold mt-2 mb-2">Search a Product</h1>

        {/* Search input with category-wise dropdown */}
        <div  className="flex flex-wrap -mx-2 mb-4">
          <div  className="w-full md:w-3/4 px-2 mb-4 md:mb-0">
            <input
              onChange={onDropdownEdit}
              type="text"
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
           
            />{
              loading && <div className='justify-center items-center flex mt-2'> <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 40 40" preserveAspectRatio="xMidYMid" className='bg-none flex justify-center items-center'>
                <path className='justify-center items-center' d="M20 2.5a17.5 17.5 0 0 1 17.5 17.5 17.5 17.5 0 0 1-17.5 17.5 17.5 17.5 0 0 1-17.5-17.5 17.5 17.5 0 0 1 17.5-17.5zm0 35a17.5 17.5 0 0 1-17.5-17.5 17.5 17.5 0 0 1 17.5-17.5 17.5 17.5 0 0 1 17.5 17.5 17.5 17.5 0 0 1-17.5 17.5z" fill="none" stroke="#000" strokeWidth="2"></path>
                <path className='justify-center items-center' d="M36.5 20a16.5 16.5 0 0 1-16.5 16.5 16.5 16.5 0 0 1-16.5-16.5" fill="none" stroke="#000" strokeWidth="2">
                  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 20 20;360 20 20"></animateTransform>
                </path>
              </svg>
              </div>
            }
            <div className=' mt-2  bg-purple-50 rounded-md' >
              {dropdown.map(item => {
                return <div key={item.slug} className='container flex justify-between  p-2 my-1  border-b-2'>
                  <span className='slug'>{item.slug}   ({item.quantity} availabel for ₹{`${item.price}`})</span>
                  <div className='mx-5'>
                  <button onClick={()=>btnAction("minus",item.slug,item.quantity)} disabled={actionLoading}  className='subtract inline-block px-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer  disabled:bg-purple-200'>-</button>
                  <span className='quantity mx-3 inline-block min-w-3'>{item.quantity} </span>
                  <button onClick={()=>btnAction("add",item.slug,item.quantity)} disabled={actionLoading}  className='subtract inline-block px-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200'>+</button>
                 
                  </div>
                </div>
              })} 
            </div>
          </div>
          <div className="w-full md:w-1/4 px-2">
            <div className="relative">
              <select className="border rounded-md appearance-none px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                {/* {stockData.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))} */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 12l-4-4h8l-4 4z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* current stock display */}
      <div className="container bg-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mt-4 mb-4">Add a Product</h1>

        {/* Add product form */}
        <form className="mt-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="productName"
            >
              Product Slug
            </label>
            <input
              value={productForm?.slug || ""}
              onChange={handleChange}
              name='slug'
              type="text"
              id="slug"
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="quantity"
            >
              Quantity
            </label>
            <input
              value={productForm?.quantity || ""}

              name='quantity'
              onChange={handleChange}
              type="number"
              id="quantity"
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="price"
            >
              Price
            </label>
            <input
              value={productForm?.price || ""}

              name='price'
              onChange={handleChange}
              type="number"
              id="price"
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Product
          </button>
        </form>
      </div>

      <div className="container bg-gray-100 p-6 rounded-lg shadow-md mt-5">
        <h1 className="text-2xl font-bold mt-4 mb-4">Display Current Stock</h1>

        {/* Stock table */}
        <table className="table-auto w-full">

          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-200">Product Name</th>
              <th className="px-4 py-2 bg-gray-200">Quantity</th>
              <th className="px-4 py-2 bg-gray-200">Price</th>
            </tr>
          </thead>

          <tbody>
            {products && products.map(product => {
              return (
                <tr key={product.slug}>
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">{product.price}</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
