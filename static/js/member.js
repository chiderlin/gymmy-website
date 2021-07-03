
init()
function init(){
    checkLogIn();
}

function checkLogIn(){
    const url = '/api/user';
    fetch(url).then((res)=>{
        return res.json();
    }).then((api_data)=>{
        if(api_data.data === null) {
            window.location.href = '/'
        }
    })
};