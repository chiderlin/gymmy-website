let count = 3
//controller
orderInfo()


function orderInfo(){
    const url = '/api/payment';
    fetch(url).then((res)=>{
        return res.json()
    }).then((api_data)=>{
        const data = api_data.data;
        if(data === null) {
            window.location.href = '/';
        } else {
            if(data.payment.type === 'paypal'){
                const number = data.payment.subscriptionId
                renderOrder(number);
                countDownProcess()

            } else if(data.payment.type === 'tappay') {
                const number = data.payment.bank_transaction_id;
                renderOrder(number);
                countDownProcess()
            }
        }
    });
};

function logOut() {
    const url = '/api/user';
    fetch(url, {
        method: "DELETE",
        // credentials: 'include',
        // headers: {
        //     'Authorization': `Bearer ${token}`
        // }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        window.location.href = '/';
    })
};



//view
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

function countDownProcess(){
    const logout_count_down = document.getElementById('logout-count-down');
    logout_count_down.innerHTML = ''
    logout_count_down.appendChild(document.createTextNode(`請重新登入，將於${count}秒後自動登出`))
    count--;
    if(count === 0) {
        logOut();
        
    } else {
        setTimeout(countDownProcess, 1000);
    }
}


