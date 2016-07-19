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
  let allTotal = 0;
  let allSaved = 0;
  for(let receiptItem of receiptItems) {
     allTotal = allTotal + receiptItem.subTotal;
     allSaved = allSaved + receiptItem.saved;

  }
   let receipts = { receiptItems:receiptItems , allTotal : allTotal, allSaved: allSaved };

  return receipts;
}

let printReceipt = (receipts) => {
  let allReceipt = '';

  for(let receipt of receipts.receiptItems){
    let name = receipt.cartItem.item.name;
    let count = receipt.cartItem.count;
    let unit = receipt.cartItem.item.unit;
    let price = receipt.cartItem.item.price;
    let subTotal = receipt.subTotal;
    allReceipt = allReceipt + '名称：' + name + '，' + '数量：' + count + unit + '，' + '单价：' + price.toFixed(2)
                 + '(元)' + '，' + '小计：' + subTotal.toFixed(2) + '(元)' + '\n' ;
  }

  allReceipt = '***<没钱赚商店>收据***' + '\n' + allReceipt + '----------------------' + '\n' +
      '总计：' + receipts.allTotal.toFixed(2) + '(元)' + '\n' +'节省：' + receipts.allSaved.toFixed(2) + '(元)' + '\n'
      + '**********************';

  return allReceipt;
};
