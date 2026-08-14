const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const orders = [
  { project: "Nexora Growth Fund", amount: "50,000 USDT", date: "14/08/2026 21:40", status: "Chờ duyệt" },
  { project: "Nexora Strategic Fund", amount: "100,000 USDT", date: "13/08/2026 18:20", status: "Đã duyệt" }
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
      <span class="status ${o.status === "Đã duyệt" ? "success" : ""}">${o.status}</span>
    </div>
  `).join("");
}

function openProject(name) {
  document.getElementById("modal-project-name").textContent = name;
  document.getElementById("amount").value = "";
  document.getElementById("project-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("project-modal").classList.add("hidden");
}

function createOrder() {
  const amount = Number(document.getElementById("amount").value);
  const project = document.getElementById("modal-project-name").textContent;

  if (!amount || amount <= 0) {
    alert("Vui lòng nhập số tiền đầu tư.");
    return;
  }

  orders.unshift({
    project,
    amount: amount.toLocaleString("en-US") + " USDT",
    date: new Date().toLocaleString("vi-VN"),
    status: "Chờ duyệt"
  });

  closeModal();
  renderOrders();

  if (tg?.showPopup) {
    tg.showPopup({
      title: "Tạo lệnh thành công",
      message: "Lệnh đã được tạo và đang chờ Admin duyệt.",
      buttons: [{type: "ok"}]
    });
  } else {
    alert("Lệnh đã được tạo và đang chờ Admin duyệt.");
  }
}

function showPage(page) {
  if (page === "projects") {
    document.querySelector(".section").scrollIntoView({behavior:"smooth"});
  } else if (page === "orders") {
    document.getElementById("recent-orders").scrollIntoView({behavior:"smooth"});
  } else if (page === "profile") {
    alert("Trang tài khoản sẽ được hoàn thiện ở V2.");
  } else {
    window.scrollTo({top:0, behavior:"smooth"});
  }
}

renderOrders();