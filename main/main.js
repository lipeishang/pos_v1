'use strict';

function buildCartItems(inputs,allItems) {
  let  cartItems = [];

  for(let input of inputs){
    let spliteddInput = input.split('-');
    let barcode = spliteddInput[0];
    let count = parseFloat(spliteddInput[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if(cartItem){
      cartItem.count++;
    }else{
      let item = allItems.find(item => item.barcode === barcode);

      cartItems.push({item:item,count:count});
    }
  }

  return cartItems;
}

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

  return { subTotal, saved }
};

let buildReceipts = (receiptItems) => {
  var allTotal = 0;
  var allSaved = 0;
  for(let receiptItem of receiptItems) {
     allTotal = allTotal + receiptItem.subTotal;
     allSaved = allSaved + receiptItem.saved;

  }

   let receipts = { receiptItems:receiptItems , allTotal : allTotal, allSaved: allSaved };

  return receipts;
}
