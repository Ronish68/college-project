import React, { Fragment, useEffect } from 'react';
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../layout/MetaData.js";
import {clearErrors,getProduct} from "../../actions/productAction.js";
import {useSelector,useDispatch} from "react-redux"
import Loader from "../layout/Loader/Loader.js"




const product ={
    name:"Mens Tshirt",
    images:[{url:"https://i.ibb.co/DRST11n/1.webp"}],
    price:"Rs1500",
    id:"Ronish",
     
};

const Home = () => {
  const dispatch = useDispatch();
  const {loading,error,products,productsCount} = useSelector(
    (state)=>state.products
  );


  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  },[dispatch,error,alert]);

  return (
   <Fragment>
    {loading ? (
      <Loader/>
      ):(
        <Fragment>

        <MetaData title="ECOMMERCE" />
  
          <div className="banner">
              <p>Welcome to Ecommerce</p>
              <h1>FIND AMAZING PRODUCTS BELOW</h1>
            </div>
  
            <h2 className="homeHeading">Featured Products</h2>
  
              <div className="container" id="container">
  
               {/* {products && products.map((product)=><Product product={product}/>)}                  */}

               <Product product={product} />
               <Product product={product} />
               <Product product={product} />
               <Product product={product} />
               <Product product={product} />
               <Product product={product} />
               <Product product={product} />
               <Product product={product} />

  
              
              </div>
  
      </Fragment>
      )}
   </Fragment>
  );
};

export default Home
