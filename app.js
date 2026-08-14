const tg = window.Telegram?.WebApp;
const API_BASE = "http://127.0.0.1:8000/api";

if (tg) { tg.ready(); tg.expand(); }

let authMode = "login";
let projects = [];
let orders = [];

function getUserId() {
  return localStorage.getItem("nexora_user_id");
}

function setUser(id, username) {
  localStorage.setItem("nexora_user_id", String(id));
  localStorage.setItem("nexora_username", username || "");
}

function clearUser() {
  localStorage.removeItem("nexora_user_id");
  localStorage.removeItem("nexora_username");
}

async function api(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    headers: {"Content-Type": "application/json", ...(options.headers || {})},
    ...options
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = {detail: text}; }
  if (!response.ok) throw new Error(data.detail || "API error");
  return data;
}

const localOrders = [
  { project: "Nexora Growth Fund", amount: "50,000 USDT", date: "Demo", status: "Chờ duyệt" }
];

function renderOrders() {
  const el = document.getElementById("recent-orders");
  if (!el) return;
  const list = orders.length ? orders : localOrders;
  el.innerHTML = list.map(o => `
    <div class="order-row">
      <div class="order-left">
        <strong>${o.project || "Project #" + o.project_id}</strong>
        <span>${Number(o.amount || 0).toLocaleString("en-US")} USDT · ${o.created_at ? new Date(o.created_at).toLocaleString("vi-VN") : o.date}</span>
      </div>
      <span class="status ${o.status === "approved" || o.status === "Đã duyệt" ? "success" : ""}">
        ${formatStatus(o.status)}
      </span>
    </div>
  `).join("");
}

function formatStatus(s) {
  if (s === "pending" || s === "Chờ duyệt") return "Chờ duyệt";
  if (s === "approved" || s === "Đã duyệt") return "Đã duyệt";
  return "Từ chối";
}

async function loadProjectsFromBackend() {
  try {
    projects = await api("/projects");
    const cards = document.querySelectorAll(".project-card");
    if (projects.length && cards.length) {
      cards.forEach((card, i) => {
        const p = projects[i % projects.length];
        card.dataset.projectId = p.id;
        card.querySelector(".project-title").textContent = p.name;
        card.querySelector(".project-desc").textContent = p.description || "Dự án NEXORA";
        card.querySelector(".project-meta span").textContent = `Tối thiểu ${Number(p.min_amount).toLocaleString("en-US")} USDT · ${p.duration_days} ngày`;
        card.querySelector(".project-meta strong").textContent = p.status === "open" ? "Đang mở" : "Đã đóng";
        card.onclick = () => openProject(p);
      });
    }
  } catch (e) {
    console.log("Backend projects chưa sẵn sàng:", e.message);
  }
}

async function loadOrdersFromBackend() {
  const userId = getUserId();
  if (!userId) return;
  try {
    orders = await api(`/investment-orders?user_id=${encodeURIComponent(userId)}`);
    // Resolve project names for a nicer display.
    const map = new Map(projects.map(p => [p.id, p.name]));
    orders = orders.map(o => ({...o, project: map.get(o.project_id) || `Dự án #${o.project_id}`}));
    renderOrders();
  } catch (e) {
    console.log("Không tải được lịch sử:", e.message);
  }
}

function openProject(project) {
  const p = typeof project === "string"
    ? projects.find(x => x.name === project) || {name: project}
    : project;

  document.getElementById("modal-project-name").textContent = p.name || "NEXORA Project";
  document.getElementById("project-modal").dataset.projectId = p.id || "";
  document.getElementById("amount").value = "";
  document.getElementById("project-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("project-modal").classList.add("hidden");
}

async function createOrder() {
  const userId = getUserId();
  const projectId = Number(document.getElementById("project-modal").dataset.projectId);
  const amount = Number(document.getElementById("amount").value);

  if (!userId) {
    closeModal();
    openAuth();
    return;
  }
  if (!projectId) {
    alert("Chưa có dự án từ Backend. Hãy tạo dự án trong Admin Panel trước.");
    return;
  }
  if (!amount || amount <= 0) {
    alert("Vui lòng nhập số tiền đầu tư.");
    return;
  }

  try {
    await api("/investment-orders", {
      method: "POST",
      body: JSON.stringify({user_id: Number(userId), project_id: projectId, amount})
    });

    closeModal();
    await loadOrdersFromBackend();

    if (tg?.showPopup) {
      tg.showPopup({
        title: "Tạo lệnh thành công",
        message: "Lệnh đã được gửi tới Admin và đang chờ duyệt.",
        buttons: [{type: "ok"}]
      });
    } else {
      alert("Lệnh đã được gửi tới Admin và đang chờ duyệt.");
    }
  } catch (e) {
    alert("Không tạo được lệnh: " + e.message);
  }
}

function openAuth() {
  document.getElementById("auth-modal").classList.remove("hidden");
  document.getElementById("auth-message").textContent = "";
}

function closeAuth() {
  document.getElementById("auth-modal").classList.add("hidden");
}

function toggleAuthMode() {
  authMode = authMode === "login" ? "register" : "login";
  document.getElementById("auth-title").textContent = authMode === "login" ? "Đăng nhập" : "Tạo tài khoản";
  document.getElementById("register-extra").classList.toggle("hidden", authMode !== "register");
  document.getElementById("auth-switch").textContent =
    authMode === "login" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập";
}

async function submitAuth() {
  const username = document.getElementById("auth-username").value.trim();
  const password = document.getElementById("auth-password").value;
  const message = document.getElementById("auth-message");

  if (!username || !password) {
    message.textContent = "Vui lòng nhập tài khoản và mật khẩu.";
    return;
  }

  try {
    if (authMode === "register") {
      const telegramId = document.getElementById("auth-telegram").value.trim() || null;
      const created = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          telegram_id: telegramId,
          username,
          account_username: username,
          password
        })
      });
      setUser(created.id, created.account_username);
      message.textContent = "Đăng ký thành công.";
    } else {
      const logged = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          account_username: username,
          password
        })
      });
      setUser(logged.user_id, logged.account_username);
      message.textContent = "Đăng nhập thành công.";
    }

    setTimeout(async () => {
      closeAuth();
      await loadProjectsFromBackend();
      await loadOrdersFromBackend();
    }, 400);
  } catch (e) {
    message.textContent = e.message;
  }
}

function logout() {
  clearUser();
  alert("Đã đăng xuất.");
}

function showPage(page) {
  if (page === "projects") {
    document.querySelector(".section")?.scrollIntoView({behavior:"smooth"});
  } else if (page === "orders") {
    document.getElementById("recent-orders")?.scrollIntoView({behavior:"smooth"});
  } else if (page === "profile") {
    const user = localStorage.getItem("nexora_username");
    if (user) {
      if (confirm(`Đang đăng nhập: ${user}\n\nĐăng xuất?`)) logout();
    } else {
      openAuth();
    }
  } else {
    window.scrollTo({top:0, behavior:"smooth"});
  }
}

async function boot() {
  renderOrders();
  await loadProjectsFromBackend();
  await loadOrdersFromBackend();
}

boot();
