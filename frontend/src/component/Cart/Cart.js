import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard.js";
// import { withRouter } from 'react-router-dom';


const Cart = ({history}) => {
    const item ={
        product:"productID",
        price:200,
        name:"Customer",
        quantity:1,
        image:"https://i.ibb.co/DRST11n/1.webp",
    };

    // const checkoutHandler = () =>{
    //   history.push("/login?redirect=shipping");
    // };
    
  return (
    <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

                <div className="cartContainer">
                  <CartItemCard item={item}/>
                   <div className="cartInput">
                   <button>-</button>
                    <input type="number" value={item.quantity} readOnly/>
                    <button>+</button>
                   </div>
                   <p className="cartSubtotal">{`rs${item.price*item.quantity}`}</p>
                  </div>
                  <div className="cartContainer">
                  <CartItemCard item={item}/>
                   <div className="cartInput">
                   <button>-</button>
                    <input type="number" value={item.quantity} readOnly/>
                    <button>+</button>
                   </div>
                   <p className="cartSubtotal">{`rs${item.price*item.quantity}`}</p>
                  </div>
                  <div className="cartContainer">
                  <CartItemCard item={item}/>
                   <div className="cartInput">
                   <button>-</button>
                    <input type="number" value={item.quantity} readOnly/>
                    <button>+</button>
                   </div>
                   <p className="cartSubtotal">{`rs${item.price*item.quantity}`}</p>
                  </div>

                  <div className="cartGrossProfit">
                    <div></div>
                    <div className="cartGrossProfitBox">
                        <p>Gross Total</p>
                        <p>{`rs600`}</p>
                    </div>
                    <div></div>
                    <div className="checkOutBtn">
                        <button >Check Out</button>
                    </div>
                    </div>
                </div>
            </Fragment>
  );
};

export default Cart;