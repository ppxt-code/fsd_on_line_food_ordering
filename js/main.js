// global variables : menuItems, cart, hasbeenloaded, searchMode, likes, qrcodetext
// localStorage : nbclients, isloggedin
let nbclients = Number(localStorage.getItem("nbclients")) || 0;
let isloggedin = localStorage.getItem("isloggedin") === "true";
let hasbeenloaded ; let searchMode; let showAddressMode;
let cart; let menuItems; let likes; let qrcodetext;
function init() {
    if (!isloggedin) { window.location.href = "login.html"; return;}
    hasbeenloaded = false; searchMode = false; showAddressMode = false; qrcodetext = "";
    cart = []; menuItems = []; likes = [];
    let nbvisitedElt = document.getElementById("nbvisited");
    if (nbvisitedElt) nbvisitedElt.innerText = `${nbclients} users have visited this app!`;
}
//------------------- login:
function loginSubmit(event) {
    event.preventDefault();
    let loginsuccess = document.getElementById("email").value === "admin@gmail.com" && document.getElementById("password").value === "admin";
    if (!loginsuccess) {alert("Wrong email or password!"); return;}
    document.getElementById("login-form").reset();
    init();
    nbclients++; localStorage.setItem("nbclients", nbclients);
    localStorage.setItem("isloggedin", "true");
    window.location.href = "index.html";
}
function logoutClicked(event) {
    localStorage.setItem("isloggedin", "false");
    window.location.href = "login.html";
}
function loginPageReset() {
    const form = document.getElementById("login-form");
    if (form) form.reset();
}
window.addEventListener("DOMContentLoaded", loginPageReset);
window.addEventListener("pageshow", loginPageReset);
//------------------- page loading:
const app = document.getElementById("app");
if (app) initIndexPage();
const pageInits = {
    "menu.html": initMenuPage,
    "cart.html": initCartPage,
    "checkout.html": initCheckoutPage,
};
async function loadPage(page) {
    const response = await fetch(page);
    //console.log("status:", response.status);
    //console.log("url:", response.url);
    const html = await response.text();
    app.innerHTML = html;
    if (pageInits[page]) {
        await pageInits[page]();
    }
}

//------------------- menu :
async function initMenuPage() {
    addSvgToTags(); // pb when adding them to html
    try {
        if (!hasbeenloaded) { menuItems = await getMenuItems(); hasbeenloaded = !!menuItems; } 
        updatecartCount();
        if (menuItems) {
            let categoriesElt = document.getElementById("categories");
            const grouped = Object.groupBy(menuItems, item => item.category);
            const firstItems = Object.values(grouped).map(group => group[0]);
            let html = "";
            for (item of firstItems)
                html += `<button onclick="categoryClicked('${item.category}')">
                            <div class="flex items-center gap-4"> 
                                <img src="${item.image}" alt="${item.name}" class="lg:w-20 lg:h-20 w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110"/> 
                                <p class="text-orange-800 text-xs sm:text-xl">${item.category}</p>
                            </div>
                        </button>`;
            if (categoriesElt) categoriesElt.innerHTML = html;
        }
    } catch (error) { alert(error); }
}
function addSvgToTags() {   
    document.getElementById("search-tag").innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>`+document.getElementById("search-tag").innerHTML;
    document.getElementById("offers-tag").innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
</svg>`+document.getElementById("offers-tag").innerHTML;
    document.getElementById("cart-tag").innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
</svg>`+document.getElementById("cart-tag").innerHTML;
    document.getElementById("address-tag").innerHTML =`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
</svg>`+document.getElementById("address-tag").innerHTML;
}
function mean(array) {
    if (array.length === 0) return 0;
    return array.reduce((sum, value) => sum + value, 0) / array.length;
}
function categoryClicked(category) {
    if (menuItems) {
        const itemsArr = menuItems.filter((item) => item.category === category);
        const categoryElt = document.getElementById("category");
        if (categoryElt) categoryElt.innerText = category;
        fillEltWithArray(itemsArr, "itemsByCategory");
    }
}
function fillEltWithArray(itemsArr, itemsId, appendMode=false) {
    if (itemsArr) {
        let html = "";
        for (item of itemsArr) {
            notation = mean(item.notation).toFixed(1);//1 digit
            html += `<div> 
                        <div class="flex flex-col bg-pink-100 rounded-md sm:p-5">
                            <div class="flex justify-around">
                                <span class="flex sm:gap-1 w-fit rounded-2xl sm:rounded-3xl p-1 sm:p-2 bg-black text-orange-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sm:size-6 size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>
                                    <p class="text-xs sm:text-md">${notation}</p>
                                </span>
                                <button id="like-btn-${item.id}-${itemsId}" onclick="toggleLike(${item.id},'${itemsId}')" class="w-fit bg-white rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                     fill="${likes.includes(item.id) ? 'currentColor' : 'none'}" 
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sm:size-6 size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
                                </button>
                            </div>
                            <button onclick="addToCart(${item.id})">
                                <img src="${item.image}" alt="${item.name}" class="mx-auto w-12 h-12 md:w-24 md:h-24 sm:w-32 sm:h-32 rounded-full transition-transform duration-300 hover:scale-110"/> 
                            </button>
                            <p class="text-xs sm:text-md font-bold text-gray-500">${item.name}</p> 
                        </div>
                        <p class="text-xs sm:text-md font-bold sm:px-5">Price: $${item.price}</p>
                    </div>`;
        }
        const itemsArrElt = document.getElementById(itemsId);
        if (itemsArrElt) {
            if (appendMode) itemsArrElt.innerHTML += html;
            else            itemsArrElt.innerHTML = html;
        }
    }
}
function getMenuItems() {
    let islocaldata = false;
    const URL = islocaldata ? 'data/db.json' : 'https://my-json-server.typicode.com/ppxt-code/food-api/menu';

    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", URL, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var menuItems = JSON.parse(xhr.responseText);
                if (islocaldata) resolve(menuItems.menu);
                else resolve(menuItems);
            }
            else { reject("ERROR WHILE LOADING DATA"); }
        }
        xhr.send();
    });
}

//------------------- cart :
async function initCartPage() {
    let cartById = Object.groupBy(cart, id => id);
    let html = ''; let totalPrice = 0; let totalDiscount = 0;
    for (const [id, ids] of Object.entries(cartById)) {
        // console.log("id="+id+" nb="+ids.length);
        const item = menuItems.find((item) => item.id == id); // item.id is a number, id is a string
        if (item) {
            html += `<div class="grid grid-cols-5 gap-4 font-bold items-center">
                        <img src="${item.image}" alt="${item.name}" class="lg:w-20 lg:h-20 w-10 h-10">
                        <div class="col-span-2 text-xs sm:text-md">${item.name} Price: $${item.price}</div>
                        <div class="col-span-2 text-xs sm:text-md">Quantity:<input type="number" min="0" value="${ids.length}" onchange="changeQuantity(${id}, Number(this.value))" class="w-10 sm:w-20 p-2"</input></div>
                      </div>`;
            totalPrice += item.price * ids.length;
            totalDiscount += item.price * ids.length * item.discount / 100;
        }
    }
    html += `<br><h2 class="font-bold text-md sm:text-xl text-red-600">Total : $${(totalPrice - totalDiscount).toFixed(2)} (Discount : $${(totalDiscount).toFixed(2)})</h2>`;
    const cartElt = document.getElementById("cart");
    cartElt.innerHTML = html;
    qrcodetext = `Total : $${(totalPrice - totalDiscount).toFixed(2)} (Discount : $${(totalDiscount).toFixed(2)}) -`;//global
}
function addToCart(id) {
    cart.push(id);
    updatecartCount();
}
function changeQuantity(id, value) {
    cart = cart.filter(item => item !== id);
    for (let i = 1; i <= value; i++) cart.push(id);
    initCartPage();
}
function updatecartCount() { 
    let cartCountElt = document.getElementById("cart-count");
    if (cartCountElt)  cartCountElt.textContent = `${cart.length} Items`; 
}

//------------------- search:
function togglesearchMode() {
    searchMode = !searchMode;
    document.getElementById("search-string").hidden = !searchMode;
}
function smartsearch(searchString, string) {
    let searchWords = searchString.split(" ");
    if (searchWords.length === 1) return string.includes(searchString);
    for (searchword of searchWords) if (!string.includes(searchword)) return false;
    return true;
}
function searchingFor(searchString) {
    if (searchString.trim() === "") return;
    let foundElts = menuItems.filter(elt => smartsearch(searchString.toLowerCase(), elt.name.toLowerCase()));
    fillEltWithArray(foundElts, "itemsByCategory");
    document.getElementById("category").innerText = "";
}
//------------------- Wishlist:
function toggleLike(id, itemsId) {
    let like=false;
    if (likes.includes(id)) {like=false; likes = likes.filter(item => item !== id);}
    else                    {like=true; likes.push(id);}
    let likeBtn = document.getElementById(`like-btn-${id}-${itemsId}`);
    if (likeBtn) likeBtn.innerHTML 
        = `<svg xmlns="http://www.w3.org/2000/svg" 
                                     fill="${like ? 'currentColor' : 'none'}" 
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="sm:size-6 size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>`;
}
function showWishlist() {
    let wishlist = [];
    for (id of likes) {
        let foundElts = menuItems.filter(elt => elt.id === id);
        if (foundElts) wishlist.push(foundElts[0]);
    }
    fillEltWithArray(wishlist, "itemsByCategory");
    let categoryElt = document.getElementById("category");
    if (categoryElt) categoryElt.innerText = "";
}
//------------------- checkout:
async function checkout() {
    if (cart.length === 0) return;
    await loadPage("checkout.html");
}
async function initCheckoutPage() {
    document.getElementById("qrcode").innerHTML = "";
    let nb = Math.floor(Math.random() * 1000);
    let qr;
    try {
        qr = new QRCode(document.getElementById("qrcode"), {
            text: qrcodetext+nb,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
        alert("Failed to generate QR code.");
    }

}
//------------------- Offers:
function offers() {
    document.getElementById("category").innerText = "";
    let foundElts = menuItems.filter(elt => elt.discount > 0);
    document.getElementById("itemsByCategory").innerHTML = "";
    let groups = Object.entries(Object.groupBy(foundElts, elt => elt.discount)).sort((a, b) => b[0] - a[0]);
    for (const [discount, group] of groups) {
        document.getElementById("itemsByCategory").innerHTML 
            += `<div class="col-span-full text-xl font-bold">Offers (${discount}%)</div>`;
        fillEltWithArray(group, "itemsByCategory",true);
    }
}
//------------------- contact:
function sendEmail(event) {
    event.preventDefault();
    alert("Sending email... from: "+document.getElementById("mail").value+" name: "+document.getElementById("name").value+" message: "+document.getElementById("message").value);
}
//------------------- index:
function initIndexPage() {
    document.addEventListener("click", async (e) => {
        const link = e.target.closest("[data-page]");
        if (!link) return;
        e.preventDefault();
        await loadPage(link.dataset.page);
        if (link.dataset.action === "wishlist") showWishlist();
    });
}
//------------------- miscellaneous:
function toggleShowAddress() {
    showAddressMode = !showAddressMode;
    document.getElementById("address").hidden = !showAddressMode;
}