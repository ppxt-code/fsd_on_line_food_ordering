// global variables : menuItems, cart, hasbeenloaded, searchMode, likes, qrcodetext
hasbeenloaded = false; searchMode = false;
if (!hasbeenloaded) { cart = []; menuItems = []; likes = [] }
currentItemsArr = []; currentItemsId = ""; // keep in memory to refresh panel with fillEltWithArray

function loginSubmit(event) {
    event.preventDefault();
    window.location.href = "index.html";
}
function logoutClicked(event) {
    window.location.href = "login.html";
}

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
    //console.log(page+" contains categories ? "+html.includes("categories"));
    app.innerHTML = html;
    if (pageInits[page]) {
        await pageInits[page]();
    }
}

//------------------- menu :
async function initMenuPage() {
    try {
        if (!hasbeenloaded) { menuItems = await getMenuItems(); hasbeenloaded = !!menuItems; } // global
        updatecartCount();
        if (menuItems) {
            let categoriesElt = document.getElementById("categories");
            const grouped = Object.groupBy(menuItems, item => item.category);
            const firstItems = Object.values(grouped).map(group => group[0]);
            let html = "";
            for (item of firstItems)
                html += `<button onclick="categoryClicked('${item.category}')">
                            <div class="flex items-center gap-4"> 
                                <img src="${item.image}" class="lg:w-20 lg:h-20 w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110"/> 
                                <p>${item.category}</p>
                            </div>
                        </button>`;
            if (categoriesElt) categoriesElt.innerHTML = html;
        }
    } catch (error) { alert(error); }
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
function fillEltWithArray(itemsArr, itemsId) {
    if (itemsArr && itemsId != "") { currentItemsArr = itemsArr; currentItemsId = itemsId }
    if (itemsArr) {
        let html = "";
        for (item of itemsArr) {
            notation = mean(item.notation).toFixed(1);//1 digit
            html += `<div> 
                        <div class="flex flex-col bg-pink-100 rounded-md p-5">
                            <div class="flex justify-around">
                                <span class="flex gap-1 w-fit rounded-3xl p-2 bg-black text-orange-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>
                                    ${notation}
                                </span>
                                <button onclick="toggleLike(${item.id})" class="w-fit bg-white rounded-full p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                     fill="${likes.includes(item.id) ? 'currentColor' : 'none'}" 
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
                                </button>
                            </div>
                            <button onclick="addToCart(${item.id})">
                                <img src="${item.image}" class="mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full transition-transform duration-300 hover:scale-110"/> 
                            </button>
                            <p>${item.name}</p> 
                        </div>
                        <p>Price: $${item.price}</p>
                    </div>`;
        }
        const itemsArrElt = document.getElementById(itemsId);
        if (itemsArrElt) itemsArrElt.innerHTML = html;
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
                        <img src="${item.image}"  class="lg:w-20 lg:h-20 w-10 h-10">
                        <div class="col-span-2">${item.name} Price: $${item.price}</div>
                        <div class="col-span-2">Quantity:<input type="number" min="0" value="${ids.length}" onchange="changeQuantity(${id}, Number(this.value))" class="w-20 p-2"</input></div>
                      </div>`;
            totalPrice += item.price * ids.length;
            totalDiscount += item.price * ids.length * item.discount / 100;
        }
    }
    html += `<br><h2 class="font-bold text-xl text-red-600">Total : $${(totalPrice - totalDiscount).toFixed(2)} (Discount : $${(totalDiscount).toFixed(2)})</h2>`;
    const cartElt = document.getElementById("cart");
    cartElt.innerHTML = html;
    qrcodetext = `Total : $${(totalPrice - totalDiscount).toFixed(2)} (Discount : $${(totalDiscount).toFixed(2)})`;//global
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
function updatecartCount() { document.getElementById("cart-count").textContent = `${cart.length} Items`; }

//------------------- search:
function togglesearchMode() {
    searchMode = !searchMode;
    document.getElementById("search-string").hidden = !searchMode;
}
function searchingFor(searchString) {
    if (searchString.trim() === "") return;
    let foundElts = menuItems.filter(elt => elt.name.toLowerCase().includes(searchString.toLowerCase()));
    fillEltWithArray(foundElts, "itemsByCategory");
    document.getElementById("category").innerText = "";
}
//------------------- Wishlist:
function toggleLike(id) {
    if (likes.includes(id)) likes = likes.filter(item => item !== id);
    else likes.push(id);
    fillEltWithArray(currentItemsArr, currentItemsId);
}
function showWishlist() {
    let wishlist = [];
    for (id of likes) {
        let foundElts = menuItems.filter(elt => elt.id === id);
        if (foundElts) wishlist.push(foundElts[0]);
    }
    fillEltWithArray(wishlist, "itemsByCategory");
    document.getElementById("category").innerText = "";
}
//------------------- checkout:
async function checkout() {
    if (cart.length === 0) return;
    await loadPage("checkout.html");
}
async function initCheckoutPage() {
    document.getElementById("qrcode").innerHTML = "";
    let qr;
    try {
        qr = new QRCode(document.getElementById("qrcode"), {
            text: qrcodetext,
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