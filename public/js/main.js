function loginBtnFn(){
    layerPopup.classList.add('open')
}

function popupClose(event){
    if(event.target == this){
        this.classList.remove('open')
    }
}


async function localLoginFn(){
    const userid = document.querySelector('#userid')
    const userpw = document.querySelector('#userpw')

    if(userid.value == ""){
        alert('아이디를 입력해주세요')
        userid.focus()
        return
    }

    if(userpw.value == ""){
        alert('패스워드를 입력해주세요')
        userpw.focus()
        return
    }
    let url = 'http://localhost:3000/auth/local/login'
    // let options = {
    //     method:'POST',
    //     headers:{
    //         'content-type':'application/x-www-form-urlencoded'
    //     },
    //     body:`userid=${userid.value}&userpw=${userpw.value}`,
    // }

    let options = {
        method:'POST',
        headers:{
            'content-type' : 'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify({
            userid:userid.value,
            userpw:userpw.value,
        }),
    }
    let response = await fetch(url,options);
    let json = await response.json();
    let {result, msg} = json;
    alert(msg)
    if(result){
        layerPopup.classList.remove('open')
    }
    else{
        userid.value = '';
        userpw.value = ''
        userid.focus()
    }   
}

async function userinfoFn(){
    let url = 'http://localhost:3000/user/info'
    let options = {method:'GET'}
    let response = await fetch(url,options)
    let result = await response.text()
    try{
        let json = JSON.parse(result)
        alert(json.msg)
        return
    }catch(e){
        alert(`아이디 : ${result}`)
    }
}


function init(){
    const urlSearch = new URLSearchParams(location.search);
    const msg = urlSearch.get('msg')
    const userinfo = document.querySelector('#userinfo')
    const loginBtn = document.querySelector('#loginBtn')
    layerPopup = document.querySelector('.layerPopup')
    const localLogin = document.querySelector('#localLogin')
    loginBtn.addEventListener('click',loginBtnFn)
    layerPopup.addEventListener('click', popupClose)
    localLogin.addEventListener('click',localLoginFn)
    userinfo.addEventListener('click',userinfoFn)

    if(msg == '회원가입이 완료되었습니다'){
        loginBtnFn()
    }
}


document.addEventListener('DOMContentLoaded', init);

