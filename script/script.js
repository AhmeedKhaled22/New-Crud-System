// ---------------------------
// عناصر HTML
// ---------------------------
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxis = document.getElementById("taxis");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let cat = document.getElementById("cat");
let btn = document.getElementById("btn");
let contuner = [];
let mood = "create";
let tmp;

// ---------------------------
// جلب البيانات من localStorage
// ---------------------------
if (localStorage.getItem("productData") != null) {
  contuner = JSON.parse(localStorage.getItem("productData"));
  if (!Array.isArray(contuner)) contuner = [];
} else {
  contuner = [];
}

rowData();
checkBtnColor();

// ---------------------------
// إضافة أو تحديث منتج
// ---------------------------
function addData() {
  let data = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxis: taxis.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    cat: cat.value.toLowerCase(),
  };

  if (
    title.value !== "" &&
    price.value !== "" &&
    cat.value !== "" &&
    (mood === "update" || (data.count > 0 && data.count < 100))
  ) {
    if (mood === "create") {
      let quantity = data.count > 1 ? data.count : 1;
      for (let i = 0; i < quantity; i++) {
        contuner.push(data);
      }
    } else {
      contuner[tmp] = data;
      mood = "create";
      btn.innerHTML = "Create";
      count.style.display = "block";
    }

    clearData();
    localStorage.setItem("productData", JSON.stringify(contuner));
    rowData();
    getTotal();
    checkBtnColor();
  }
}

// ---------------------------
// حساب السعر الكلي
// ---------------------------
function getTotal() {
  if (
    price.value !== "" &&
    taxis.value !== "" &&
    ads.value !== "" &&
    discount.value !== ""
  ) {
    let result = +price.value + +taxis.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.background = "#040";
  } else {
    total.innerHTML = "";
    total.style.background = "#a00d02";
  }
  checkBtnColor();
}

// ---------------------------
// مسح البيانات من الفورم
// ---------------------------
function clearData() {
  title.value = "";
  price.value = "";
  taxis.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  cat.value = "";
}

// ---------------------------
// عرض البيانات في الجدول
// ---------------------------
function rowData() {
  let dataHTML = "";
  for (let i = 0; i < contuner.length; i++) {
    dataHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${contuner[i].title}</td>
        <td>${contuner[i].price}</td>
        <td>${contuner[i].taxis}</td>
        <td>${contuner[i].ads}</td>
        <td>${contuner[i].discount}</td>
        <td>${contuner[i].total}</td>
        <td>${contuner[i].cat}</td>
        <td><button onclick="upDate(${i})" class="btn-up">Update</button></td>
        <td><button onclick="deleta(${i})" class="btn-dl">Delete</button></td>
      </tr>`;
  }
  document.getElementById("rowData").innerHTML = dataHTML;

  let btnDelete = document.getElementById("deleteAll");
  btnDelete.innerHTML =
    contuner.length > 0
      ? `<button onclick="deleteAll()">Delete All (${contuner.length})</button>`
      : "";
}

// ---------------------------
// تحميل بيانات منتج للفورم للتعديل
// ---------------------------
function upDate(i) {
  title.value = contuner[i].title;
  price.value = contuner[i].price;
  taxis.value = contuner[i].taxis;
  ads.value = contuner[i].ads;
  discount.value = contuner[i].discount;
  getTotal();
  count.style.display = "none";
  cat.value = contuner[i].cat;
  btn.innerHTML = "Update";
  mood = "update";
  tmp = i;
  scroll({top: 0, behavior: "smooth"});
}

// ---------------------------
// حذف منتج واحد
// ---------------------------
function deleta(i) {
  contuner.splice(i, 1);
  localStorage.setItem("productData", JSON.stringify(contuner));
  rowData();
  checkBtnColor();
}

// ---------------------------
// حذف كل المنتجات
// ---------------------------
function deleteAll() {
  contuner = [];
  localStorage.removeItem("productData");
  rowData();
  checkBtnColor();
}

// ---------------------------
// تغيير لون الزرار حسب الحقول
// ---------------------------
function checkBtnColor() {
  if (title.value !== "" && price.value !== "" && cat.value !== "") {
    btn.style.background = "green";
  } else {
    btn.style.background = "#333";
  }
}

// ---------------------------
// أحداث input لحساب الـ total وتغيير لون الزرار
// ---------------------------
title.addEventListener("input", checkBtnColor);
price.addEventListener("input", () => {
  getTotal();
});
taxis.addEventListener("input", () => {
  getTotal();
});
ads.addEventListener("input", () => {
  getTotal();
});
discount.addEventListener("input", () => {
  getTotal();
});
cat.addEventListener("input", checkBtnColor);
count.addEventListener("input", checkBtnColor);

// ---------------------------
// البحث بالعنوان أو التصنيف
// ---------------------------
let searchMood = "title";

function searche(id) {
  let searchInput = document.getElementById("search");
  if (id === "searchTitle") {
    searchMood = "title";
    searchInput.placeholder = "Search by title";
  } else {
    searchMood = "category";
    searchInput.placeholder = "Search by category";
  }
  searchInput.focus();
  searchInput.value = "";
  rowData();
}

function searchData(value) {
  let dataHTML = "";
  for (let i = 0; i < contuner.length; i++) {
    if (
      (searchMood === "title" &&
        contuner[i].title.includes(value.toLowerCase())) ||
      (searchMood === "category" &&
        contuner[i].cat.includes(value.toLowerCase()))
    ) {
      dataHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${contuner[i].title}</td>
          <td>${contuner[i].price}</td>
          <td>${contuner[i].taxis}</td>
          <td>${contuner[i].ads}</td>
          <td>${contuner[i].discount}</td>
          <td>${contuner[i].total}</td>
          <td>${contuner[i].cat}</td>
          <td><button onclick="upDate(${i})" class="btn-up">Update</button></td>
          <td><button onclick="deleta(${i})" class="btn-dl">Delete</button></td>
        </tr>`;
    }
  }
  document.getElementById("rowData").innerHTML = dataHTML;
}
