import"./index.1de03ae5.js";const r=document.querySelector("#loginForm"),c=document.querySelector("#userName"),d=document.querySelector("#userPwd"),I=document.querySelector("#signin-submit"),l=document.querySelector("#reset-pw"),i=document.querySelector("#newPwd"),u=document.querySelector("#newPwdCheck"),q=document.querySelector("#reset-password-submit"),h=document.querySelector("#userUI"),S=document.querySelectorAll(".decrypt-text-sm"),y=document.querySelectorAll(".decrypt-text-md"),o=document.querySelector("#loadingUI");let w="";window.addEventListener("DOMContentLoaded",async function(){try{w=await f()}catch(t){console.log(t),alert(`\u6293\u53D6 ip \u904E\u7A0B\u4E2D\u767C\u751F\u554F\u984C
\u8ACB\u806F\u7E6B\u7CFB\u7D71\u7BA1\u7406\u54E1`)}});I.addEventListener("click",async function(t){if(t.preventDefault(),c.value==""||d.value==""){alert("\u8ACB\u8F38\u5165\u5E33\u865F\u5BC6\u78BC!");return}try{let s={account:c.value,password:d.value,ip:w},a="SignIn";d.value="",r.classList.add("hidden"),o.classList.remove("hidden");const n=await m(a,s);if(await p(n.status))c.value="",await v("token",n.token),await v("account",n.account),await g("isFirstSignIn",n.isFirstSignIn);else{alert("\u5E33\u865F\u5BC6\u78BC\u9A57\u8B49\u932F\u8AA4\uFF0C\u8ACB\u91CD\u65B0\u8F38\u5165\u6216\u662F\u8A62\u554F\u7CFB\u7D71\u7BA1\u7406\u54E1"),o.classList.add("hidden"),r.classList.remove("hidden");return}}catch(s){console.log(s),alert(`\u5E33\u865F\u5BC6\u78BC\u9A57\u8B49\u904E\u7A0B\u51FA\u73FE\u554F\u984C
\u8ACB\u8A62\u554F\u7CFB\u7D71\u7BA1\u7406\u54E1`),o.classList.add("hidden"),r.classList.remove("hidden");return}if(JSON.parse(window.sessionStorage.getItem("isFirstSignIn"))){o.classList.add("hidden"),l.classList.remove("hidden");return}await L()});q.addEventListener("click",async function(t){if(t.preventDefault(),i.value==""||u.value==""){alert("\u4E0D\u80FD\u6709\u7A7A\u767D\u5594!");return}if(i.value!=u.value){alert("\u5BC6\u78BC\u78BA\u8A8D\u8207\u6B32\u4FEE\u6539\u4E4B\u5BC6\u78BC\u4E0D\u76F8\u7B26");return}try{let e="ChangePassword",s={account:window.localStorage.getItem("account"),token:window.localStorage.getItem("token"),ip:w,newPassword:i.value};o.classList.remove("hidden"),l.classList.add("hidden"),i.value="",u.value="";const a=await m(e,s);if(await p(a.status))alert("\u66F4\u8B8A\u5BC6\u78BC\u6210\u529F\uFF01"),l.classList.add("hidden"),o.classList.remove("hidden");else{alert(`\u66F4\u8B8A\u5BC6\u78BC\u5931\u6557
\u8ACB\u8DDF\u7CFB\u7D71\u7BA1\u7406\u54E1\u78BA\u8A8D`);return}await g("isFirstSignIn","false"),await L()}catch(e){console.log(e),alert(`\u91CD\u7F6E\u5BC6\u78BC\u767C\u751F\u4E86\u9EDE\u554F\u984C
\u8ACB\u8A62\u554F\u7CFB\u7D71\u7BA1\u7406\u54E1`),o.classList.add("hidden"),r.classList.remove("hidden");return}});async function m(t,e){let s=new Headers;s.append("Content-Type","text/plain"),e.requestType=t;const a="https://script.google.com/macros/s/AKfycbxwECLronCkZoHt4YCSkXfJryEncPxHTsIo1NC9ZUWNi7TY3TpOx7hLpBUFww3XWprGBg/exec",n={header:s,method:"POST",body:JSON.stringify(e)};return await(await fetch(a,n)).json()}async function f(){return(await(await fetch("https://api.ipify.org/?format=json")).json()).ip}function v(t,e){return new Promise(s=>{window.localStorage.setItem(t,e),s()})}function g(t,e){return new Promise(s=>{window.sessionStorage.setItem(t,e),s()})}function p(t){return new Promise(e=>{t=="success"?e(!0):t=="fail"&&e(!1)})}async function L(){if(window.sessionStorage.getItem("gameCodes")){const t=JSON.parse(window.sessionStorage.getItem("gameCodes"));for(let e=0;e<t.length;e++)S[e].innerText=t[e],y[e].innerText=t[e];o.classList.add("hidden"),h.classList.remove("hidden");return}try{let t="GetGameCodes",e={account:window.localStorage.getItem("account"),token:window.localStorage.getItem("token"),ip:await f()},s=await m(t,e);if(console.log(s),await p(s.status))await g("gameCodes",JSON.stringify(s.gameCodes));else throw"get game codes fail";const a=s.gameCodes;for(let n=0;n<a.length;n++)S[n].innerText=a[n],y[n].innerText=a[n];o.classList.add("hidden"),h.classList.remove("hidden")}catch(t){console.log(t),alert(`\u6293\u53D6\u8CC7\u6599\u6642\u51FA\u73FE\u554F\u984C
\u8ACB\u8A62\u554F\u7CFB\u7D71\u7BA1\u7406\u54E1`),o.classList.add("hidden"),r.classList.remove("hidden");return}}
