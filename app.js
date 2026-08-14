const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const orders = [
  {
    project: "Nexora Growth Fund",
    amount: "50,000 USDT",
    date: "14/08/2026 21:40",
    status: "Chờ duyệt"
  },
  {
    project: "Nexora Strategic Fund",
    amount: "100,000 USDT",
    date: "13/08/2026 18:20",
    status: "Đã duyệt"
  }
];

function renderOrders() {
  const el = document.getElementById("recent-orders");

  if (!el) return;

  el.innerHTML = orders.map(o => `
    <div class="order-row">
      <div class="order-left">
        <strong>${o.project}</strong>
        <span>${o.amount} · ${o.date}</span>
      </div>

      <span class="status ${o.status === "Đã duyệt" ? "success" : ""}">
        ${o.status}
      </span>
    </div>
  `).join("");
}


function openProject(name) {
  document.getElementById("modal-project-name").textContent = name;
  document.getElementById("amount").value = "";

  document
    .getElementById("project-modal")
    .classList.remove("hidden");
}


function closeModal() {
  document
    .getElementById("project-modal")
    .classList.add("hidden");
}


/*
====================================================
NEXORA MINI APP
GỬI LỆNH TEST VỀ TELEGRAM BOT
====================================================
*/

function createOrder() {

  const amount = Number(
    document.getElementById("amount").value
  );

  const project =
    document.getElementById("modal-project-name").textContent;


  // Kiểm tra số tiền
  if (!amount || amount <= 0) {

    alert("Vui lòng nhập số tiền đầu tư.");

    return;
  }


  /*
  ================================================
  TELEGRAM MINI APP
  Gửi dữ liệu trực tiếp về Bot
  ================================================
  */

  if (
    tg &&
    typeof tg.sendData === "function"
  ) {

    const payload = {

      action: "create_investment_test",

      project: project,

      amount: amount

    };


    console.log(
      "NEXORA MINI APP SEND:",
      payload
    );


    tg.sendData(
      JSON.stringify(payload)
    );


    return;
  }


  /*
  ================================================
  FALLBACK
  Nếu mở bằng Chrome bên ngoài Telegram
  ================================================
  */

  orders.unshift({

    project: project,

    amount:
      amount.toLocaleString("en-US")
      + " USDT",

    date:
      new Date().toLocaleString("vi-VN"),

    status:
      "Chờ duyệt"

  });


  closeModal();

  renderOrders();


  alert(
    "Đã tạo lệnh demo trên trình duyệt."
  );
}


/*
====================================================
ĐIỀU HƯỚNG
====================================================
*/

function showPage(page) {

  if (page === "projects") {

    const section =
      document.querySelector(".section");

    if (section) {

      section.scrollIntoView({
        behavior: "smooth"
      });

    }

  }


  else if (page === "orders") {

    const ordersElement =
      document.getElementById("recent-orders");

    if (ordersElement) {

      ordersElement.scrollIntoView({
        behavior: "smooth"
      });

    }

  }


  else if (page === "profile") {

    alert(
      "Trang tài khoản sẽ được hoàn thiện ở V2."
    );

  }


  else {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

}


/*
====================================================
KHỞI TẠO
====================================================
*/

renderOrders();
