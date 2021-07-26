
order_info();

function order_info(){
    const url = '/api/payment';
    fetch(url).then((res)=>{
        return res.json()
    }).then((api_data)=>{
        console.log(api_data);
        const data = api_data.data;
        if(api_data.error === true && api_data.message === '尚未登入系統') {
            window.location.href = '/';
        } else {
            if(data.payment.type === 'paypal'){
                const number = data.payment.subscriptionId
                renderOrder(number);
                setTimeout(() => {
                    logOut()
                }, 3000);

            } else if(data.payment.type === 'tappay') {
                const number = data.payment.bank_transaction_id;
                renderOrder(number);
                setTimeout(() => {
                    logOut()
                }, 3000);
            }
        }
    });
}
function renderOrder(number){
    const title = document.querySelector('.title-name');
    const trade_num = document.querySelector('.trade-num');
    const img = document.createElement('img');
    const img_box = document.querySelector('.img-box');
    img.className = 'img-fluid';
    title.appendChild(document.createTextNode('付款成功'));
    trade_num.appendChild(document.createTextNode(number));
    img.setAttribute('src', '/png/icon/checked.png');
    img_box.appendChild(img);
};


function logOut() {
    const url = '/api/user';
    fetch(url, {
        method: "DELETE",
    }).then((res) => {
        return res.json();
    }).then((data) => {
        window.location.href = '/';
    })
};