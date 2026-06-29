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
    "cart.html": initCartPage
};
async function loadPage(page) {
    const html = await fetch(page).then(r => r.text());
    app.innerHTML = html;
    if (pageInits[page]) {
        await pageInits[page]();
    }
}

async function initMenuPage() {
    try {
        menuItems = await getMenuItems(); // global
        if (menuItems) {
            let categoriesElt = document.getElementById("categories");
            const grouped = Object.groupBy(menuItems, item=>item.category);
            const firstItems = Object.values(grouped).map(group=>group[0]);
            let html="";
            for (item of firstItems) 
                html +=`<button onclick="categoryClicked('${item.category}')">
                            <div class="flex items-center gap-4"> 
                                <img src="${item.image}" class="lg:w-20 lg:h-20 w-10 h-10 rounded-full"/> 
                                <p>${item.category}</p>
                            </div>
                        </button>`;
            if (categoriesElt) categoriesElt.innerHTML=html;
        }
    } catch (error) {alert(error);}
}
function categoryClicked(category) {
    if (menuItems) {
        const itemsByCategory = menuItems.filter((item)=>item.category===category);
        const categoryElt = document.getElementById("category");
        if (categoryElt) categoryElt.innerText=category;
        let html="";
        for (item of itemsByCategory) 
            html +=`<div> 
                        <div class="bg-pink-100 rounded-md">
                            <img src="${item.image}" class="sm:w-40 sm:h-40 w-32 h-32 rounded-full"/> 
                            <p>${item.name}</p> 
                        </div>
                        <p>Price: $${item.price}</p>
                    </div>`;
        const itemsByCategoryElt = document.getElementById("itemsByCategory");
        if (itemsByCategoryElt) itemsByCategoryElt.innerHTML=html;
    }
}
function getMenuItems() {
    let islocaldata=false;
    const URL = islocaldata ? 'data/db.json' : 'https://my-json-server.typicode.com/ppxt-code/food-api/menu';
    
    return new Promise((resolve,reject)=>
        {
            var xhr = new XMLHttpRequest();
            xhr.open("GET",URL,true);
            xhr.onload = function() {
                if (xhr.status===200){
                    var menuItems = JSON.parse(xhr.responseText); 
                    if (islocaldata) resolve(menuItems.menu);
                    else resolve(menuItems);
                }
                else {reject("ERROR WHILE LOADING DATA");}
            }
            xhr.send();
        });
}
async function initCartPage() {
    console.log("initCartPage");
}
function initIndexPage() {
    document.addEventListener("click", (e) => {
        const link = e.target.closest("[data-page]");
        if (!link) return;
        e.preventDefault();
        loadPage(link.dataset.page);
    });
}
