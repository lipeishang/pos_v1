'use strict';

let buildReceiptItems = (cartItems,promotions) => {
  return cartItems.map(cartItem => {
    let promotionType = getPromotionType(cartItem.item.barcode,promotions);
    let { subTotal, saved } = discount(cartItem,promotionType);
    return { cartItem, subTotal, saved };
  });
};

let getPromotionType = (barcode,promotions) => {
  let promotion = promotions.find(promotion => promotion.barcodes.includes(barcode));
  
  return promotion ? promotion.type : '';
};

let discount = (cartItem,promotionType) => {
  let freeItemCount = 0;
  
  if(promotionType === 'BUY_TWO_GET_ONE_FREE'){
    freeItemCount = parseInt(cartItem.count / 3);
  }
  
  let saved = cartItem.item.price * freeItemCount;
  let subTotal = cartItem.item.price * cartItem.count - saved;
  
  return { subTotal, saved };
}

