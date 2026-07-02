# 🍔 FSD Online Food Ordering

**End Project of Course 2 – Simplilearn AI Full Stack Developer**

An interactive and responsive **Online Food Ordering** web application that allows users to browse restaurant menus, manage orders, create a wishlist, and simulate the checkout process with QR code generation.

---

## 📋 Overview

This project demonstrates the implementation of a responsive food ordering application using front-end web technologies and AJAX for consuming REST APIs.

Users can:

- Log in to the application
- Browse food categories
- Search for food items
- View discounted offers
- Add food to their cart
- Manage quantities
- Create a wishlist
- Generate a payment QR code
- Contact the restaurant

---

## 🚀 Technical Stack

- HTML5
- CSS3
- Tailwind CSS
- JavaScript (ES6)
- AJAX
- JSON REST API

---

## 📂 Project Structure

```
fsd_on_line_food_ordering/
│
├── login.html          # Login page
├── index.html          # Main application page
│
├── menu.html           # Services page, Wishlist page
├── cart.html           # Your Orders page
├── contact.html        # Contact page
├── js/ main.js
├── data/
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/ppxt-code/fsd_on_line_food_ordering.git
```

Open the project in **Visual Studio Code**.

Run:

```
login.html
```

using **Open with Live Server**.

---

## 🔑 Login Credentials

| Email | Password |
|--------|----------|
| admin@gmail.com | admin |

---

## 🖥️ Application Flow

### Login

The application starts on **login.html**.

After successful authentication, the user is redirected to **index.html**.

---

## 🏠 Main Page

The main page displays the number of visitors of this page (this information is stored in the local storage and incremented) 
The main page contains the following navigation menu:

- Services
- Your Orders
- Wishlist
- Contact Us

Instead of navigating to different pages, the application dynamically loads HTML fragments into **index.html**:

| Menu | Loaded Page |
|-------|-------------|
| Services | menu.html |
| Your Orders | cart.html |
| Wishlist | wishlist.html |
| Contact Us | contact.html |

---

## 🍽️ Services

The Services page displays the restaurant menu.

### Food Categories

Users can filter food by category.

Examples:

- Burgers
- Pizza
- Drinks
- Desserts
- ...

### Tags

Several interactive tags are available:

### 🔍 Search

Searches food whose name contains the entered text.

### 💸 Offers

Displays only discounted items.

Items are sorted in descending discount order.

### 📍 Address

Displays or hides the restaurant address.

### 🛒 n Items

Displays the current number of ordered items.

---

## 🍔 Food Cards

Each menu item is displayed as a card containing:

- Food image
- Name
- Price
- Rating (notation)
- Wishlist icon

### Card Actions

Clicking the food image:

- Adds the item to the shopping cart.

Clicking the heart icon:

- Adds/removes the item from the wishlist.

The heart icon is:

- ⚫ Black when selected
- ⚪ White otherwise

---

## ❤️ Wishlist

Displays all liked food items.

Users can:

- Remove items
- Add them to the shopping cart

---

## 🛒 Your Orders

The cart page allows users to:

- View ordered food
- Increase quantity
- Decrease quantity
- Remove items

The application automatically updates:

- Total price (Final amount)
- Discount

---

## 💳 Payment

When proceeding to payment, the application generates a QR Code.

The QR code encodes:

- Total price
- Discount

Hovering the QR code displays the encoded text.

---

## 📬 Contact Us

The Contact page contains a contact form including:

- Name
- Email
- Message

The form allows users to send a message to the restaurant.

---

## 🎨 User Interface

Interactive elements include:

- Hover background color changes
- Zoom effects
- Bold text on hover

The **wishlist (heart) icon** is excluded from hover animations.

---

## 🌐 REST API

Menu data is retrieved asynchronously using AJAX.

API endpoint:

```
https://my-json-server.typicode.com/ppxt-code/food-api/menu
```

GitHub repository:

https://github.com/ppxt-code/food-api

Example response:

```json
{
  "menu": [
    {
      "id": 1,
      "name": "Classic Cheeseburger",
      "category": "burger",
      "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      "description": "Juicy beef patty with cheddar, lettuce, tomato and pickles.",
      "price": 11.9,
      "notation": [5, 4, 5, 4, 5, 4],
      "discount": 10
    }
  ]
}
```

---

## ✨ Features

- Responsive layout
- Dynamic HTML loading
- AJAX data fetching
- Category filtering
- Search functionality
- Discount filtering
- Wishlist management
- Shopping cart management
- Automatic price calculation
- QR Code generation
- Contact form
- Interactive UI animations

---

## 📸 Screens

- Login
- Services
- Wishlist
- Cart
- Payment QR Code
- Contact Form

---

## 👨‍💻 Author

**ppxt-code**

End Project for:

**Simplilearn – AI Full Stack Developer**

Course 2