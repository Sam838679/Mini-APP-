/* =========================================
   DEPOSIT FORM
========================================= */

async function openDepositForm() {

    const old =
        document.getElementById(
            "deposit-panel"
        );

    if (old) {
        old.remove();
    }

    const panel =
        document.createElement("div");

    panel.id = "deposit-panel";

    panel.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            z-index:10000;
            background:rgba(0,0,0,.78);
            display:flex;
            align-items:flex-end;
            justify-content:center;
        ">

            <div style="
                width:100%;
                max-width:520px;
                background:#08111d;
                color:#fff;
                border:1px solid #20344b;
                border-radius:24px 24px 0 0;
                padding:24px;
                box-sizing:border-box;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:22px;
                ">

                    <div>
                        <div style="
                            color:#718ba8;
                            font-size:12px;
                            margin-bottom:6px;
                        ">
                            GIAO DỊCH
                        </div>

                        <div style="
                            font-size:22px;
                            font-weight:700;
                        ">
                            Nạp tiền
                        </div>
                    </div>

                    <button
                        id="deposit-close"
                        type="button"
                        style="
                            width:40px;
                            height:40px;
                            border-radius:50%;
                            border:1px solid #29405a;
                            background:#101e2e;
                            color:#fff;
                            font-size:20px;
                        "
                    >
                        ×
                    </button>

                </div>


                <!-- WALLET -->

                <div style="
                    background:#0d1c2d;
                    border:1px solid #20344b;
                    border-radius:16px;
                    padding:16px;
                    margin-bottom:16px;
                ">

                    <div style="
                        color:#718ba8;
                        font-size:12px;
                        margin-bottom:7px;
                    ">
                        Ví nhận tiền
                    </div>

                    <div style="
                        display:flex;
                        gap:8px;
                        align-items:center;
                    ">

                        <div
                            id="deposit-wallet"
                            style="
                                flex:1;
                                word-break:break-all;
                                font-size:13px;
                                color:#dbe8f5;
                            "
                        >
                            Đang tải...
                        </div>

                        <button
                            id="copy-wallet"
                            type="button"
                            style="
                                border:1px solid #29405a;
                                background:#101e2e;
                                color:#fff;
                                border-radius:10px;
                                padding:9px 12px;
                            "
                        >
                            Sao chép
                        </button>

                    </div>

                    <div
                        id="deposit-network"
                        style="
                            margin-top:10px;
                            color:#7fa2c7;
                            font-size:12px;
                        "
                    >
                        Mạng: Đang tải...
                    </div>

                </div>


                <div style="
                    background:#241d08;
                    border:1px solid #5c4812;
                    color:#d9bd67;
                    border-radius:12px;
                    padding:12px;
                    margin-bottom:16px;
                    font-size:12px;
                    line-height:1.5;
                ">
                    ⚠️ Đây là ví demo để kiểm thử.
                    Không chuyển tiền thật vào địa chỉ này.
                </div>


                <label style="
                    display:block;
                    color:#8da3bc;
                    font-size:13px;
                    margin-bottom:8px;
                ">
                    Số tiền nạp
                </label>

                <input
                    id="deposit-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Nhập số tiền USDT"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:15px;
                        margin-bottom:16px;
                        border-radius:12px;
                        border:1px solid #29405a;
                        background:#0d1927;
                        color:#fff;
                        font-size:16px;
                        outline:none;
                    "
                />


                <button
                    id="deposit-submit"
                    type="button"
                    style="
                        width:100%;
                        padding:16px;
                        border:none;
                        border-radius:14px;
                        background:#168cff;
                        color:#fff;
                        font-size:16px;
                        font-weight:600;
                    "
                >
                    Tạo lệnh nạp
                </button>


                <div
                    id="deposit-message"
                    style="
                        margin-top:14px;
                        text-align:center;
                        color:#8da3bc;
                        font-size:13px;
                    "
                ></div>

            </div>
        </div>
    `;

    document.body.appendChild(panel);


    // Đóng

    document
        .getElementById("deposit-close")
        ?.addEventListener(
            "click",
            () => panel.remove()
        );


    // Tạo lệnh

    document
        .getElementById("deposit-submit")
        ?.addEventListener(
            "click",
            submitDeposit
        );


    // Lấy ví từ Backend

    try {

        const config =
            await api(
                "/config/deposit"
            );


        const wallet =
            document.getElementById(
                "deposit-wallet"
            );

        const network =
            document.getElementById(
                "deposit-network"
            );


        if (wallet) {

            wallet.textContent =
                config.wallet;
        }


        if (network) {

            network.textContent =
                "Mạng: " +
                config.network;
        }


        // Sao chép ví

        document
            .getElementById("copy-wallet")
            ?.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard.writeText(
                            config.wallet
                        );

                        alert(
                            "Đã sao chép địa chỉ ví."
                        );

                    } catch {

                        alert(
                            config.wallet
                        );
                    }
                }
            );


    } catch (error) {

        console.error(
            "DEPOSIT CONFIG ERROR:",
            error
        );

        const wallet =
            document.getElementById(
                "deposit-wallet"
            );

        if (wallet) {

            wallet.textContent =
                "Không tải được ví";
        }
    }
}

/* =========================================
   CREATE DEPOSIT
========================================= */

async function submitDeposit() {

    const userId =
        getUserId();

    const amount =
        Number(
            document.getElementById(
                "deposit-amount"
            )?.value
        );

    const message =
        document.getElementById(
            "deposit-message"
        );


    if (!userId) {

        message.textContent =
            "Bạn chưa đăng nhập.";

        return;
    }


    if (!amount || amount <= 0) {

        message.textContent =
            "Vui lòng nhập số tiền hợp lệ.";

        return;
    }


    message.textContent =
        "Đang tạo lệnh...";


    try {

        const result =
            await api(
                "/deposits",
                {
                    method: "POST",

                    body:
                        JSON.stringify({

                            user_id:
                                Number(userId),

                            amount:
                                amount

                        })
                }
            );


        message.textContent =
            "Đã tạo lệnh nạp — đang chờ duyệt.";

        console.log(
            "DEPOSIT CREATED:",
            result
        );


        setTimeout(
            () => {

                document
                    .getElementById(
                        "deposit-panel"
                    )
                    ?.remove();

            },
            1000
        );


    } catch (error) {

        console.error(
            "DEPOSIT ERROR:",
            error
        );

        message.textContent =
            "Lỗi: " +
            error.message;
    }
}
const tg = window.Telegram?.WebApp;

const API_BASE = "http://127.0.0.1:8000/api";

if (tg) {
    tg.ready();
    tg.expand();
}

let authMode = "login";
let projects = [];
let orders = [];


/* =========================================
   USER
========================================= */

function getUserId() {
    function updateHomeAuthState() {
        async function loadHomeBalance() {

    const balanceElement =
        document.getElementById("home-balance");

    if (!balanceElement) {
        return;
    }

    const userId =
        getUserId();

    if (!userId) {

        balanceElement.textContent = "0";

        return;
    }

    try {

        const user =
            await api(`/users/${userId}`);

        const balance =
            Number(user.balance || 0);

        balanceElement.textContent =
            balance.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });

    } catch (error) {

        console.error(
            "LOAD HOME BALANCE ERROR:",
            error
        );

        balanceElement.textContent = "0";
    }
}

    const loginButton =
        document.getElementById("home-login-btn");

    const balanceCard =
        document.getElementById("home-balance-card");

    const userId =
        getUserId();

    if (userId) {

        if (loginButton) {
            loginButton.style.display = "none";
        }

        if (balanceCard) {
            balanceCard.classList.remove("hidden");
        }

    } else {

        if (loginButton) {
            loginButton.style.display = "";
        }

        if (balanceCard) {
            balanceCard.classList.add("hidden");
        }
    }
}
    function updateHomeAuthState() {

    const loginButton =
        document.getElementById(
            "home-login-btn"
        );

    const balanceCard =
        document.getElementById(
            "home-balance-card"
        );

    const userId =
        getUserId();
if (userId) {

        if (loginButton) {
            loginButton.style.display = "none";
        }

        if (balanceCard) {
            balanceCard.classList.remove(
                "hidden"
            );
        }

    } else {

        if (loginButton) {
            loginButton.style.display = "";
        }

        if (balanceCard) {
            balanceCard.classList.add(
                "hidden"
            );
        }
    }
}
async function loadHomeBalance() {

    const balanceElement =
        document.getElementById("home-balance");

    if (!balanceElement) {
        return;
    }

    const userId =
        getUserId();

    if (!userId) {

        balanceElement.textContent = "0";

        return;
    }

    try {

        const user =
            await api(`/users/${userId}`);

        const balance =
            Number(user.balance || 0);

        balanceElement.textContent =
            balance.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });

    } catch (error) {

        console.error(
            "LOAD HOME BALANCE ERROR:",
            error
        );

        balanceElement.textContent = "0";
    }
}
    // =========================
    // ĐÃ ĐĂNG NHẬP
    // =========================

    if (userId) {

        if (loginButton) {
            loginButton.style.display = "none";
        }

        if (balanceCard) {
            balanceCard.classList.remove("hidden");
        }

    }

    // =========================
    // CHƯA ĐĂNG NHẬP
    // =========================

    else {

        if (loginButton) {
            loginButton.style.display = "";
        }

        if (balanceCard) {
            balanceCard.classList.add("hidden");
        }

    }
}
    
function updateHomeAuthState() {

    const loginButton =
        document.getElementById(
            "home-login-btn"
        );

    const balanceCard =
        document.getElementById(
            "home-balance-card"
        );

    const userId =
        getUserId();


    // =========================
    // ĐÃ ĐĂNG NHẬP
    // =========================

    if (userId) {

        if (loginButton) {
            loginButton.style.display =
                "none";
        }

        if (balanceCard) {
            balanceCard.classList.remove(
                "hidden"
            );
        }

    }

    // =========================
    // CHƯA ĐĂNG NHẬP
    // =========================

    else {

        if (loginButton) {
            loginButton.style.display =
                "";
        }

        if (balanceCard) {
            balanceCard.classList.add(
                "hidden"
            );
        }

    }
}


function getUserId() {

    return localStorage.getItem(
        "nexora_user_id"
    );

}


function getUsername() {

    return localStorage.getItem(
        "nexora_username"
    ) || "";

}


function setUser(id, username) {

    localStorage.setItem(
        "nexora_user_id",
        String(id)
    );

    localStorage.setItem(
        "nexora_username",
        username || ""
    );

}


function clearUser() {

    localStorage.removeItem(
        "nexora_user_id"
    );

    localStorage.removeItem(
        "nexora_username"
    );

}

function setUser(id, username) {
    localStorage.setItem(
        "nexora_user_id",
        String(id)
    );

    localStorage.setItem(
        "nexora_username",
        username || ""
    );
}

function clearUser() {
    localStorage.removeItem("nexora_user_id");
    localStorage.removeItem("nexora_username");
}


/* =========================================
   API
========================================= */

async function api(path, options = {}) {

    const response = await fetch(
        API_BASE + path,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        }
    );

    const text = await response.text();

    let data = {};

    try {
        data = text
            ? JSON.parse(text)
            : {};
    } catch {
        data = {
            detail: text
        };
    }

    if (!response.ok) {

        throw new Error(
            data.detail ||
            "API error"
        );
    }

    return data;
}


/* =========================================
   ORDER STATUS
========================================= */

function formatStatus(status) {

    if (
        status === "pending" ||
        status === "Chờ duyệt"
    ) {
        return "Chờ duyệt";
    }

    if (
        status === "approved" ||
        status === "Đã duyệt"
    ) {
        return "Đã duyệt";
    }

    return "Từ chối";
}


/* =========================================
   ORDERS
========================================= */

function renderOrders() {

    const element =
        document.getElementById(
            "recent-orders"
        );

    if (!element) return;


    if (!orders.length) {

        element.innerHTML = `
            <div class="empty">
                Chưa có lệnh đầu tư.
            </div>
        `;

        return;
    }


    element.innerHTML =
        orders.map(order => `

            <div class="order-row">

                <div class="order-left">

                    <strong>
                        ${
                            order.project ||
                            "Dự án #" +
                            order.project_id
                        }
                    </strong>

                    <span>
                        ${
                            Number(
                                order.amount || 0
                            ).toLocaleString(
                                "en-US"
                            )
                        }
                        USDT
                        ·
                        ${
                            order.created_at
                                ? new Date(
                                    order.created_at
                                ).toLocaleString(
                                    "vi-VN"
                                )
                                : ""
                        }
                    </span>

                </div>

                <span class="status ${
                    order.status === "approved"
                        ? "success"
                        : ""
                }">

                    ${
                        formatStatus(
                            order.status
                        )
                    }

                </span>

            </div>

        `).join("");
}
/* =========================================
   INVESTMENT ORDERS PAGE
========================================= */

function openInvestmentOrders() {

    const old =
        document.getElementById("investment-orders-panel");

    if (old) {
        old.remove();
    }

    const panel =
        document.createElement("div");

    panel.id =
        "investment-orders-panel";

    panel.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            z-index:10000;
            background:#050b12;
            color:#fff;
            overflow-y:auto;
        ">

            <div style="
                max-width:520px;
                margin:auto;
                padding:20px;
                padding-bottom:40px;
            ">

                <!-- HEADER -->

                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    margin-bottom:22px;
                ">

                    <div>

                        <div style="
                            color:#718ba8;
                            font-size:12px;
                            margin-bottom:5px;
                        ">
                            NEXORA
                        </div>

                        <div style="
                            font-size:24px;
                            font-weight:700;
                        ">
                            Lệnh đầu tư
                        </div>

                    </div>

                    <button
                        id="investment-orders-close"
                        type="button"
                        style="
                            width:40px;
                            height:40px;
                            border-radius:50%;
                            border:1px solid #29405a;
                            background:#101e2e;
                            color:#fff;
                            font-size:20px;
                        "
                    >
                        ×
                    </button>

                </div>


                <!-- FILTER -->

                <div style="
                    display:flex;
                    gap:8px;
                    overflow-x:auto;
                    margin-bottom:18px;
                ">

                    <button
                        class="order-filter active"
                        data-filter="all"
                    >
                        Tất cả
                    </button>

                    <button
                        class="order-filter"
                        data-filter="pending"
                    >
                        Chờ duyệt
                    </button>

                    <button
                        class="order-filter"
                        data-filter="approved"
                    >
                        Đã duyệt
                    </button>

                    <button
                        class="order-filter"
                        data-filter="investing"
                    >
                        Đang đầu tư
                    </button>

                    <button
                        class="order-filter"
                        data-filter="completed"
                    >
                        Hoàn thành
                    </button>

                </div>


                <!-- LIST -->

                <div id="investment-orders-list">

                    <div style="
                        text-align:center;
                        padding:40px 10px;
                        color:#718ba8;
                    ">
                        Đang tải lệnh...
                    </div>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(panel);


    /* CLOSE */

    document
        .getElementById("investment-orders-close")
        ?.addEventListener(
            "click",
            () => panel.remove()
        );


    /* FILTER */

    panel
        .querySelectorAll(".order-filter")
        .forEach(button => {

            button.style.cssText += `
                padding:9px 14px;
                border-radius:20px;
                border:1px solid #29405a;
                background:#0d1927;
                color:#8da3bc;
                white-space:nowrap;
                font-size:12px;
            `;

            button.addEventListener(
                "click",
                () => {

                    panel
                        .querySelectorAll(".order-filter")
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                            btn.style.background =
                                "#0d1927";

                            btn.style.color =
                                "#8da3bc";

                        });


                    button.classList.add(
                        "active"
                    );

                    button.style.background =
                        "#168cff";

                    button.style.color =
                        "#fff";


                    renderInvestmentOrders(
                        button.dataset.filter
                    );

                }
            );

        });


    renderInvestmentOrders("all");

}
/* =========================================
   RENDER INVESTMENT ORDERS
========================================= */

function renderInvestmentOrders(filter = "all") {

    const list =
        document.getElementById(
            "investment-orders-list"
        );

    if (!list) {
        return;
    }

    let filteredOrders = [...orders];


    /* =========================
       FILTER
    ========================= */

    if (filter !== "all") {

        filteredOrders =
            filteredOrders.filter(
                order => {

                    const status =
                        order.status;


                    if (
                        filter === "pending"
                    ) {

                        return (
                            status === "pending" ||
                            status === "Chờ duyệt"
                        );

                    }


                    if (
                        filter === "approved"
                    ) {

                        return (
                            status === "approved" ||
                            status === "Đã duyệt"
                        );

                    }


                    if (
                        filter === "investing"
                    ) {

                        return (
                            status === "investing" ||
                            status === "Đang đầu tư"
                        );

                    }


                    if (
                        filter === "completed"
                    ) {

                        return (
                            status === "completed" ||
                            status === "Hoàn thành"
                        );

                    }


                    return true;

                }
            );

    }


    /* =========================
       EMPTY
    ========================= */

    if (!filteredOrders.length) {

        list.innerHTML = `

            <div style="
                text-align:center;
                padding:50px 20px;
                color:#718ba8;
            ">

                <div style="
                    font-size:36px;
                    margin-bottom:12px;
                ">
                    ◇
                </div>

                <div style="
                    font-size:15px;
                    color:#dbe8f5;
                ">
                    Chưa có lệnh đầu tư
                </div>

            </div>

        `;

        return;
    }


    /* =========================
       RENDER
    ========================= */

    list.innerHTML =
        filteredOrders
            .map(order => {

                const status =
                    order.status;


                let statusText =
                    "Từ chối";

                let statusColor =
                    "#ff6575";


                if (
                    status === "pending" ||
                    status === "Chờ duyệt"
                ) {

                    statusText =
                        "Chờ duyệt";

                    statusColor =
                        "#e8b84a";

                }


                if (
                    status === "approved" ||
                    status === "Đã duyệt"
                ) {

                    statusText =
                        "Đã duyệt";

                    statusColor =
                        "#00e6a7";

                }


                if (
                    status === "investing" ||
                    status === "Đang đầu tư"
                ) {

                    statusText =
                        "Đang đầu tư";

                    statusColor =
                        "#168cff";

                }


                if (
                    status === "completed" ||
                    status === "Hoàn thành"
                ) {

                    statusText =
                        "Hoàn thành";

                    statusColor =
                        "#00e6a7";

                }


                const amount =
                    Number(
                        order.amount || 0
                    ).toLocaleString(
                        "en-US"
                    );


                const date =
                    order.created_at
                        ? new Date(
                            order.created_at
                        ).toLocaleString(
                            "vi-VN"
                        )
                        : "-";


                return `

                    <div
                        class="investment-order-card"
                        data-order-id="${order.id}"
                        style="
                            background:#0d1c2d;
                            border:1px solid #20344b;
                            border-radius:18px;
                            padding:18px;
                            margin-bottom:12px;
                            cursor:pointer;
                        "
                    >

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            gap:12px;
                            margin-bottom:14px;
                        ">

                            <div>

                                <div style="
                                    font-size:16px;
                                    font-weight:700;
                                    margin-bottom:5px;
                                ">
                                    ${
                                        order.project ||
                                        "Dự án #" +
                                        order.project_id
                                    }
                                </div>

                                <div style="
                                    color:#718ba8;
                                    font-size:11px;
                                ">
                                    Mã lệnh #${order.id}
                                </div>

                            </div>


                            <div style="
                                color:${statusColor};
                                font-size:12px;
                                white-space:nowrap;
                            ">
                                ${statusText}
                            </div>

                        </div>


                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:end;
                        ">

                            <div>

                                <div style="
                                    color:#718ba8;
                                    font-size:11px;
                                    margin-bottom:5px;
                                ">
                                    Số tiền đầu tư
                                </div>

                                <div style="
                                    font-size:20px;
                                    font-weight:700;
                                ">
                                    ${amount}

                                    <span style="
                                        font-size:12px;
                                        color:#8da3bc;
                                    ">
                                        USDT
                                    </span>

                                </div>

                            </div>


                            <div style="
                                color:#718ba8;
                                font-size:11px;
                                text-align:right;
                            ">
                                ${date}
                            </div>

                        </div>

                    </div>

                `;

            })
            .join("");


    /* =========================
       CLICK ORDER
    ========================= */

    list
        .querySelectorAll(
            ".investment-order-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const orderId =
                        Number(
                            card.dataset.orderId
                        );

                    openInvestmentOrderDetail(
                        orderId
                    );

                }
            );

        });

}
/* =========================================
   LOAD PROJECTS
========================================= */

async function loadProjectsFromBackend() {

    try {

        projects = await api("/projects");

        const list =
            document.getElementById(
                "projects-list"
            );

        if (!list) {
            console.warn(
                "Không tìm thấy #projects-list"
            );
            return;
        }

        if (!projects || !projects.length) {

            list.innerHTML = `
                <div class="empty">
                    Chưa có dự án.
                </div>
            `;

            return;
        }

        const apiRoot =
            API_BASE.replace(/\/api$/, "");

        list.innerHTML = projects
            .map(project => {

                const logoUrl =
                    project.logo_url
                        ? apiRoot + project.logo_url
                        : "";

                const documentUrl =
                    project.document_url
                        ? apiRoot + project.document_url
                        : "";

                const profitMin =
                    Number(project.profit_min || 0);

                const profitMax =
                    Number(project.profit_max || 0);

                const raisedAmount =
                    Number(project.raised_amount || 0);

                const targetAmount =
                    Number(project.target_amount || 0);

                const raisedPercent =
                    Math.min(
                        Math.max(
                            Number(
                                project.raised_percent || 0
                            ),
                            0
                        ),
                        100
                    );

                const isOpen =
                    project.status === "open";

                const profitText =
                    profitMin || profitMax
                        ? `${profitMin}% - ${profitMax}%`
                        : "—";

                const minAmount =
                    Number(
                        project.min_amount || 0
                    ).toLocaleString("en-US");

                const raisedText =
                    raisedAmount.toLocaleString(
                        "en-US"
                    );

                const targetText =
                    targetAmount.toLocaleString(
                        "en-US"
                    );

                return `
                    <div
                        class="nexora-project-card"
                        data-project-id="${project.id}"
                    >

                        <div class="nexora-project-header">

                            <div class="nexora-project-logo">

                                ${
                                    logoUrl
                                        ? `
                                            <img
                                                src="${logoUrl}"
                                                alt="${project.name || "Project Logo"}"
                                            >
                                          `
                                        : `
                                            <span>NX</span>
                                          `
                                }

                            </div>

                            <div class="nexora-project-title">

                                <div class="nexora-project-name">
                                    ${project.name || "NEXORA Project"}
                                </div>

                                <div class="nexora-project-desc">
                                    ${
                                        project.description ||
                                        "Dự án NEXORA"
                                    }
                                </div>

                            </div>

                            <div
                                class="nexora-project-status ${
                                    isOpen
                                        ? "open"
                                        : "closed"
                                }"
                            >
                                ${
                                    isOpen
                                        ? "ĐANG MỞ"
                                        : "ĐÃ ĐÓNG"
                                }
                            </div>

                        </div>


                        <div class="nexora-project-stats">

                            <div class="nexora-stat">
                                <span>LỢI NHUẬN</span>
                                <strong>
                                    ${profitText}
                                </strong>
                            </div>

                            <div class="nexora-stat">
                                <span>THỜI HẠN</span>
                                <strong>
                                    ${project.duration_days || 0} Ngày
                                </strong>
                            </div>

                            <div class="nexora-stat">
                                <span>TỐI THIỂU</span>
                                <strong>
                                    ${minAmount} USDT
                                </strong>
                            </div>

                        </div>


                        <div class="nexora-raised">

                            <div class="nexora-raised-head">

                                <span>
                                    Đã huy động
                                </span>

                                <strong>
                                    ${raisedPercent}%
                                </strong>

                            </div>

                            <div class="nexora-progress">

                                <div
                                    class="nexora-progress-bar"
                                    style="width:${raisedPercent}%"
                                ></div>

                            </div>

                            <div class="nexora-raised-amount">

                                ${raisedText}
                                /
                                ${targetText}
                                USDT

                            </div>

                        </div>


                        ${
                            documentUrl
                                ? `
                                    <button
                                        type="button"
                                        class="nexora-document-btn"
                                    >
                                        📄 Xem tài liệu dự án
                                    </button>
                                  `
                                : ""
                        }


                        <button
                            type="button"
                            class="nexora-invest-btn"
                            ${isOpen ? "" : "disabled"}
                        >
                            ${
                                isOpen
                                    ? "ĐẦU TƯ NGAY"
                                    : "DỰ ÁN ĐÃ ĐÓNG"
                            }
                        </button>

                    </div>
                `;
            })
            .join("");


        projects.forEach(project => {

            const card =
                list.querySelector(
                    `[data-project-id="${project.id}"]`
                );

            if (!card) {
                return;
            }


            const documentButton =
                card.querySelector(
                    ".nexora-document-btn"
                );

            if (
                documentButton &&
                project.document_url
            ) {

                documentButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        window.open(
                            apiRoot +
                            project.document_url,
                            "_blank"
                        );

                    }
                );

            }


            const investButton =
                card.querySelector(
                    ".nexora-invest-btn"
                );

            if (
                investButton &&
                project.status === "open"
            ) {

                investButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openProject(
                            project
                        );

                    }
                );

            }


            card.addEventListener(
                "click",
                () => {

                    if (
                        project.status === "open"
                    ) {

                        openProject(
                            project
                        );

                    } else {

                        alert(
                            "Dự án này đã đóng."
                        );

                    }

                }
            );

        });

    } catch (error) {

        console.error(
            "PROJECT LOAD ERROR:",
            error
        );

        const list =
            document.getElementById(
                "projects-list"
            );

        if (list) {

            list.innerHTML = `
                <div class="empty">
                    Không tải được danh sách dự án.
                </div>
            `;

        }

    }
}


/* =========================================
   LOAD ORDERS
========================================= */

async function loadOrdersFromBackend() {

    const userId =
        getUserId();


    if (!userId) {

        return;
    }


    try {

        orders =
            await api(
                `/investment-orders?user_id=${encodeURIComponent(
                    userId
                )}`
            );


        const projectMap =
            new Map(
                projects.map(
                    project => [
                        project.id,
                        project.name
                    ]
                )
            );


        orders =
            orders.map(
                order => ({

                    ...order,

                    project:
                        projectMap.get(
                            order.project_id
                        ) ||
                        `Dự án #${order.project_id}`

                })
            );


        renderOrders();

    } catch (error) {

        console.log(
            "Orders:",
            error.message
        );
    }
}


/* =========================================
   PROJECT MODAL
========================================= */

function openProject(project) {

    const modal =
        document.getElementById(
            "project-modal"
        );


    const title =
        document.getElementById(
            "modal-project-name"
        );


    const amount =
        document.getElementById(
            "amount"
        );


    if (!modal) return;


    if (title) {

        title.textContent =
            project.name ||
            "NEXORA Project";
    }


    modal.dataset.projectId =
        project.id || "";


    if (amount) {

        amount.value = "";
    }


    modal.classList.remove(
        "hidden"
    );
}


function closeModal() {

    const modal =
        document.getElementById(
            "project-modal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );
    }
}


/* =========================================
   CREATE INVESTMENT ORDER
========================================= */

async function createOrder() {

    const userId =
        getUserId();


    const modal =
        document.getElementById(
            "project-modal"
        );


    const projectId =
        Number(
            modal?.dataset.projectId
        );


    const amount =
        Number(
            document.getElementById(
                "amount"
            )?.value
        );


    if (!userId) {

        closeModal();

        openAuth();

        return;
    }


    if (!projectId) {

        alert(
            "Chưa có dự án từ Backend."
        );

        return;
    }


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Vui lòng nhập số tiền đầu tư."
        );

        return;
    }


    try {

        await api(
            "/investment-orders",
            {
                method: "POST",

                body: JSON.stringify({

                    user_id:
                        Number(userId),

                    project_id:
                        projectId,

                    amount:
                        amount

                })
            }
        );


        closeModal();


        await loadOrdersFromBackend();


        alert(
            "Lệnh đã được gửi tới Admin và đang chờ duyệt."
        );


    } catch (error) {

        alert(
            "Không tạo được lệnh: " +
            error.message
        );
    }
}


/* =========================================
   AUTH
========================================= */

function openAuth() {

    const modal =
        document.getElementById(
            "auth-modal"
        );


    if (!modal) return;


    modal.classList.remove(
        "hidden"
    );


    const message =
        document.getElementById(
            "auth-message"
        );


    if (message) {

        message.textContent = "";
    }
}


function closeAuth() {

    const modal =
        document.getElementById(
            "auth-modal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );
    }
}


function toggleAuthMode() {

    console.log(
        "TOGGLE AUTH CLICK"
    );


    authMode =
        authMode === "login"
            ? "register"
            : "login";


    const title =
        document.getElementById(
            "auth-title"
        );


    const extra =
        document.getElementById(
            "register-extra"
        );


    const button =
        document.getElementById(
            "auth-switch"
        );


    if (authMode === "register") {

        if (title) {

            title.textContent =
                "Tạo tài khoản";
        }


        if (extra) {

            extra.classList.remove(
                "hidden"
            );
        }


        if (button) {

            button.textContent =
                "Đã có tài khoản? Đăng nhập";
        }

    } else {

        if (title) {

            title.textContent =
                "Đăng nhập";
        }


        if (extra) {

            extra.classList.add(
                "hidden"
            );
        }


        if (button) {

            button.textContent =
                "Chưa có tài khoản? Đăng ký";
        }
    }
}


/* =========================================
   SUBMIT AUTH
========================================= */

async function submitAuth() {

    console.log(
        "submitAuth() được gọi"
    );


    const usernameInput =
        document.getElementById(
            "auth-username"
        );


    const passwordInput =
        document.getElementById(
            "auth-password"
        );


    const message =
        document.getElementById(
            "auth-message"
        );


    if (
        !usernameInput ||
        !passwordInput
    ) {

        return;
    }


    const username =
        usernameInput.value.trim();


    const password =
        passwordInput.value;


    if (
        !username ||
        !password
    ) {

        message.textContent =
            "Vui lòng nhập tài khoản và mật khẩu.";

        return;
    }


    message.textContent =
        "Đang kết nối Backend...";


    try {

        if (
            authMode === "register"
        ) {

            const telegramInput =
                document.getElementById(
                    "auth-telegram"
                );


            const telegramId =
                telegramInput
                    ? telegramInput.value.trim()
                    : "";


            const created =
                await api(
                    "/auth/register",
                    {

                        method: "POST",

                        body:
                            JSON.stringify({

                                telegram_id:
                                    telegramId ||
                                    null,

                                username:
                                    username,

                                account_username:
                                    username,

                                password:
                                    password

                            })
                    }
                );


            setUser(
    created.id,
    created.account_username
);

updateHomeAuthState();

message.textContent =
    "Đăng ký thành công!";

        } else {

            const logged =
                await api(
                    "/auth/login",
                    {

                        method: "POST",

                        body:
                            JSON.stringify({

                                account_username:
                                    username,

                                password:
                                    password

                            })
                    }
                );


            setUser(
    logged.user_id,
    logged.account_username
);

updateHomeAuthState();

await loadHomeBalance();
            message.textContent =
                "Đăng nhập thành công!";
        }


        setTimeout(
            async () => {

                closeAuth();

                await loadProjectsFromBackend();

                await loadOrdersFromBackend();

            },
            500
        );


    } catch (error) {

        console.error(
            "AUTH ERROR:",
            error
        );


        message.textContent =
            "Lỗi: " +
            error.message;
    }
}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    clearUser();

    location.reload();
}


/* =========================================
   ACCOUNT PANEL
========================================= */

async function openAccountPanel() {

    const old =
        document.getElementById(
            "account-panel"
        );

    if (old) {
        old.remove();
    }

    const username =
        getUsername();

    const userId =
        getUserId();

    if (!username || !userId) {
        openAuth();
        return;
    }

    // ================================
    // LẤY THÔNG TIN USER TỪ BACKEND
    // ================================

    let balance = 0;

    try {

        const user =
            await api(
                `/users/${userId}`
            );

        balance =
            Number(
                user.balance || 0
            );

    } catch (error) {

        console.error(
            "LOAD USER ERROR:",
            error
        );
    }

    const panel =
        document.createElement(
            "div"
        );

    panel.id =
        "account-panel";

    const investorId =
        `NX-${String(userId).padStart(6, "0")}`;

    panel.innerHTML = `
        <div
            style="
                position:fixed;
                inset:0;
                z-index:9999;
                background:
                    radial-gradient(
                        circle at 50% 15%,
                        rgba(30,140,255,.12),
                        transparent 38%
                    ),
                    rgba(1,8,15,.82);
                backdrop-filter:blur(16px);
                display:flex;
                align-items:flex-end;
                justify-content:center;
            "
        >

            <div
                style="
                    width:100%;
                    max-width:520px;
                    box-sizing:border-box;
                    padding:20px;
                    color:#fff;

                    background:
                        linear-gradient(
                            145deg,
                            #061522,
                            #04101a 58%,
                            #030b13
                        );

                    border:1px solid rgba(76,177,235,.28);
                    border-radius:26px 26px 0 0;

                    box-shadow:
                        0 -18px 55px rgba(0,95,190,.16),
                        inset 0 1px 0 rgba(255,255,255,.05);

                    position:relative;
                    overflow:hidden;
                "
            >

                <!-- TOP SIGNAL -->
                <div
                    style="
                        position:absolute;
                        top:0;
                        left:10%;
                        right:10%;
                        height:1px;
                        background:
                            linear-gradient(
                                90deg,
                                transparent,
                                rgba(91,205,255,.25),
                                rgba(191,239,255,.95),
                                rgba(91,205,255,.25),
                                transparent
                            );
                        box-shadow:
                            0 0 10px rgba(67,186,255,.55);
                    "
                ></div>

                <!-- HEADER -->
                <div
                    style="
                        display:flex;
                        align-items:flex-start;
                        justify-content:space-between;
                        margin-bottom:18px;
                    "
                >

                    <div>

                        <div
                            style="
                                color:#56b8ed;
                                font-size:10px;
                                font-weight:700;
                                letter-spacing:2px;
                                text-transform:uppercase;
                                margin-bottom:7px;
                            "
                        >
                            INVESTOR PROFILE
                        </div>

                        <div
                            style="
                                font-size:24px;
                                font-weight:800;
                                letter-spacing:.2px;
                                color:#f4fbff;
                            "
                        >
                            ${username}
                        </div>

                        <div
                            style="
                                margin-top:5px;
                                color:#647f95;
                                font-size:10px;
                                letter-spacing:1.1px;
                            "
                        >
                            ${investorId}
                        </div>

                    </div>

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:7px;
                            padding-top:3px;
                        "
                    >

                        <span
                            style="
                                width:7px;
                                height:7px;
                                border-radius:50%;
                                background:#4ee3ab;
                                box-shadow:
                                    0 0 7px rgba(78,227,171,.75);
                            "
                        ></span>

                        <span
                            style="
                                color:#77d9b6;
                                font-size:9px;
                                font-weight:700;
                                letter-spacing:1.2px;
                            "
                        >
                            ACTIVE
                        </span>

                        <button
                            id="account-close"
                            type="button"
                            aria-label="Close"
                            style="
                                margin-left:8px;
                                width:38px;
                                height:38px;
                                border-radius:50%;
                                border:1px solid rgba(71,165,216,.32);
                                background:#091e2f;
                                color:#dff6ff;
                                font-size:18px;
                                line-height:1;
                            "
                        >
                            ×
                        </button>

                    </div>

                </div>


                <!-- CAPITAL CORE -->
                <div
                    style="
                        position:relative;
                        padding:18px;
                        margin-bottom:14px;
                        border-radius:20px;

                        background:
                            radial-gradient(
                                circle at 14% 15%,
                                rgba(28,144,240,.14),
                                transparent 36%
                            ),
                            linear-gradient(
                                145deg,
                                #082137,
                                #051521
                            );

                        border:1px solid rgba(66,170,228,.25);

                        box-shadow:
                            inset 0 0 28px rgba(18,125,220,.045),
                            0 8px 22px rgba(0,0,0,.16);

                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            position:absolute;
                            top:0;
                            left:14%;
                            right:14%;
                            height:1px;
                            background:
                                linear-gradient(
                                    90deg,
                                    transparent,
                                    rgba(101,213,255,.60),
                                    transparent
                                );
                        "
                    ></div>

                    <div
                        style="
                            color:#6f8ea8;
                            font-size:10px;
                            letter-spacing:1.2px;
                            text-transform:uppercase;
                            margin-bottom:8px;
                        "
                    >
                        AVAILABLE CAPITAL
                    </div>

                    <div
                        style="
                            display:flex;
                            align-items:baseline;
                            gap:9px;
                        "
                    >

                        <span
                            style="
                                font-size:36px;
                                line-height:1;
                                font-weight:800;
                                letter-spacing:-1px;
                                color:#f6fcff;
                                text-shadow:
                                    0 0 16px rgba(72,191,255,.16);
                            "
                        >
                            ${balance.toLocaleString(
                                "en-US",
                                {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </span>

                        <span
                            style="
                                color:#54bdf3;
                                font-size:12px;
                                font-weight:800;
                                letter-spacing:1px;
                            "
                        >
                            USDT
                        </span>

                    </div>

                    <div
                        style="
                            display:grid;
                            grid-template-columns:repeat(3,1fr);
                            gap:8px;
                            margin-top:16px;
                        "
                    >

                        <div
                            style="
                                padding-top:10px;
                                border-top:1px solid rgba(67,142,188,.12);
                            "
                        >
                            <div style="color:#536e84;font-size:8px;letter-spacing:1px;">
                                CAPITAL STATUS
                            </div>
                            <div style="margin-top:4px;color:#9ed9bd;font-size:10px;font-weight:700;">
                                READY
                            </div>
                        </div>

                        <div
                            style="
                                padding-top:10px;
                                border-top:1px solid rgba(67,142,188,.12);
                            "
                        >
                            <div style="color:#536e84;font-size:8px;letter-spacing:1px;">
                                LIQUIDITY
                            </div>
                            <div style="margin-top:4px;color:#a9dff8;font-size:10px;font-weight:700;">
                                AVAILABLE
                            </div>
                        </div>

                        <div
                            style="
                                padding-top:10px;
                                border-top:1px solid rgba(67,142,188,.12);
                            "
                        >
                            <div style="color:#536e84;font-size:8px;letter-spacing:1px;">
                                ACCOUNT LEVEL
                            </div>
                            <div style="margin-top:4px;color:#b4cff0;font-size:10px;font-weight:700;">
                                INVESTOR
                            </div>
                        </div>

                    </div>

                </div>


                <!-- CAPITAL ACTIONS -->
                <div
                    style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:9px;
                        margin-bottom:9px;
                    "
                >

                    <button
                        id="account-deposit"
                        type="button"
                        style="
                            width:100%;
                            padding:14px 10px;
                            border:1px solid rgba(68,177,237,.34);
                            border-radius:14px;
                            background:
                                linear-gradient(
                                    145deg,
                                    #0d5f9a,
                                    #083f68
                                );
                            color:#eaf9ff;
                            font-size:12px;
                            font-weight:750;
                            letter-spacing:.8px;
                        "
                    >
                        + &nbsp;CAPITAL IN
                    </button>

                    <button
                        id="account-withdraw"
                        type="button"
                        style="
                            width:100%;
                            padding:14px 10px;
                            border:1px solid rgba(68,177,237,.20);
                            border-radius:14px;
                            background:#071b2b;
                            color:#cfe9f5;
                            font-size:12px;
                            font-weight:750;
                            letter-spacing:.8px;
                        "
                    >
                        − &nbsp;CAPITAL OUT
                    </button>

                </div>


                <!-- HISTORY -->
                <button
                    id="account-history"
                    type="button"
                    style="
                        width:100%;
                        padding:14px 16px;
                        margin-bottom:9px;
                        border:1px solid rgba(68,150,197,.20);
                        border-radius:14px;
                        background:#061827;
                        color:#cfe3ef;
                        font-size:11px;
                        font-weight:750;
                        letter-spacing:1px;
                        text-align:left;
                    "
                >
                    TRANSACTION HISTORY
                    <span
                        style="
                            float:right;
                            color:#4eb7ec;
                            font-size:16px;
                            line-height:12px;
                        "
                    >
                        ›
                    </span>
                </button>


                <!-- FOOTER -->
                <div
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:space-between;
                        padding-top:8px;
                    "
                >

                    <div
                        style="
                            color:#455f72;
                            font-size:8px;
                            letter-spacing:1px;
                            text-transform:uppercase;
                        "
                    >
                        NEXORA INVESTOR CONSOLE
                    </div>

                    <button
                        id="account-logout"
                        type="button"
                        style="
                            border:none;
                            background:transparent;
                            color:#d66e7c;
                            padding:6px 0;
                            font-size:10px;
                            font-weight:700;
                            letter-spacing:1px;
                            text-transform:uppercase;
                        "
                    >
                        Sign out
                    </button>

                </div>

            </div>
        </div>
    `;

    document.body.appendChild(
        panel
    );


    // ================================
    // ĐÓNG
    // ================================

    document
        .getElementById("account-close")
        ?.addEventListener(
            "click",
            () => panel.remove()
        );


    // ================================
    // NẠP TIỀN
    // ================================

    document
        .getElementById("account-deposit")
        ?.addEventListener(
            "click",
            () => {
                openDepositForm();
            }
        );


    // ================================
    // RÚT TIỀN
    // ================================

    document
        .getElementById("account-withdraw")
        ?.addEventListener(
            "click",
            () => {
                openWithdrawForm();
            }
        );


    // ================================
    // LỊCH SỬ
    // ================================

    document
        .getElementById("account-history")
        ?.addEventListener(
            "click",
            () => {
                panel.remove();
                openTransactionHistory();
            }
        );


    // ================================
    // ĐĂNG XUẤT
    // ================================

    document
        .getElementById("account-logout")
        ?.addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Bạn có muốn đăng xuất không?"
                    )
                ) {
                    logout();
                }

            }
        );
}

/* =========================================
   NAVIGATION
========================================= */

function showPage(page) {

    if (
        page === "projects"
    ) {

        document
            .querySelector(
                ".section"
            )
            ?.scrollIntoView({
                behavior:
                    "smooth"
            });

        return;
    }


    if (
    page === "orders"
) {

    openInvestmentOrders();

    return;
}


    if (
        page === "profile"
    ) {

        openAccountPanel();

        return;
    }


    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });
}


/* =========================================
   INITIALIZE
========================================= */

async function boot() {

    renderOrders();

    await loadProjectsFromBackend();

    await loadOrdersFromBackend();
}


/* =========================================
   BUTTON EVENTS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        console.log(
    "NEXORA Mini App V2 loaded"
);

updateHomeAuthState();

loadHomeBalance();
        

        const avatar =
            document.querySelector(
                ".avatar"
            );


        if (avatar) {

            avatar.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openAuth();

                }
            );
        }


        const authButton =
            document.querySelector(
                "#auth-modal .primary-btn"
            );


        if (authButton) {

            authButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    submitAuth();

                }
            );
        }


        const authSwitch =
            document.getElementById(
                "auth-switch"
            );


        if (authSwitch) {

            authSwitch.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    toggleAuthMode();

                }
            );
        }

    }
);


/* =========================================
   START
========================================= */

boot();
async function openTransactionHistory() {

    const old =
        document.getElementById(
            "transaction-history-panel"
        );

    if (old) {
        old.remove();
    }

    const userId = getUserId();

    if (!userId) {
        openAuth();
        return;
    }

    const panel =
        document.createElement("div");

    panel.id =
        "transaction-history-panel";

    panel.innerHTML = `
        <div style="
            position:fixed;
            inset:0;
            z-index:10000;
            background:rgba(0,0,0,.78);
            display:flex;
            align-items:flex-end;
            justify-content:center;
        ">

            <div style="
                width:100%;
                max-width:520px;
                max-height:80vh;
                overflow-y:auto;
                background:#08111d;
                color:#fff;
                border:1px solid #20344b;
                border-radius:24px 24px 0 0;
                padding:24px;
                box-sizing:border-box;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:20px;
                ">

                    <div>
                        <div style="
                            color:#718ba8;
                            font-size:12px;
                            margin-bottom:6px;
                        ">
                            GIAO DỊCH
                        </div>

                        <div style="
                            font-size:22px;
                            font-weight:700;
                        ">
                            Lịch sử giao dịch
                        </div>
                    </div>

                    <button
                        id="history-close"
                        type="button"
                        style="
                            width:40px;
                            height:40px;
                            border-radius:50%;
                            border:1px solid #29405a;
                            background:#101e2e;
                            color:#fff;
                            font-size:20px;
                        "
                    >
                        ×
                    </button>

                </div>

                <div id="transaction-history-list">
                    Đang tải...
                </div>

            </div>

        </div>
    `;

    document.body.appendChild(panel);

    document
        .getElementById("history-close")
        ?.addEventListener(
            "click",
            () => panel.remove()
        );


    try {

        const data =
            await api(
                `/transactions?user_id=${userId}`
            );

        const list =
            document.getElementById(
                "transaction-history-list"
            );

        if (!data || !data.length) {

            list.innerHTML = `
                <div style="
                    text-align:center;
                    padding:30px 10px;
                    color:#718ba8;
                ">
                    Chưa có giao dịch
                </div>
            `;

            return;
        }


        list.innerHTML =
            data.map(item => {

                const isDeposit =
                    item.type === "deposit";

                const statusText =
                    item.status === "approved"
                        ? "Đã duyệt"
                        : item.status === "rejected"
                            ? "Đã từ chối"
                            : "Chờ duyệt";

                const statusColor =
                    item.status === "approved"
                        ? "#00e6a7"
                        : item.status === "rejected"
                            ? "#ff6575"
                            : "#e8b84a";

                const sign =
                    isDeposit && item.status === "approved"
                        ? "+"
                        : "";

                const typeText =
                    isDeposit
                        ? "Nạp tiền"
                        : "Rút tiền";

                const date =
                    item.created_at
                        ? new Date(
                            item.created_at
                        ).toLocaleString("vi-VN")
                        : "-";


                return `
                    <div style="
                        background:#0d1c2d;
                        border:1px solid #20344b;
                        border-radius:16px;
                        padding:16px;
                        margin-bottom:10px;
                    ">

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            margin-bottom:8px;
                        ">

                            <div style="
                                font-weight:600;
                            ">
                                ${typeText}
                            </div>

                            <div style="
                                color:${statusColor};
                                font-size:12px;
                            ">
                                ${statusText}
                            </div>

                        </div>


                        <div style="
                            display:flex;
                            justify-content:space-between;
                            align-items:end;
                        ">

                            <div>

                                <div style="
                                    font-size:20px;
                                    font-weight:700;
                                ">
                                    ${sign}${Number(
                                        item.amount || 0
                                    ).toLocaleString("en-US")}
                                    <span style="
                                        font-size:12px;
                                        color:#8da3bc;
                                    ">
                                        USDT
                                    </span>
                                </div>

                                <div style="
                                    color:#718ba8;
                                    font-size:11px;
                                    margin-top:5px;
                                ">
                                    #${item.id}
                                </div>

                            </div>


                            <div style="
                                color:#718ba8;
                                font-size:11px;
                                text-align:right;
                            ">
                                ${date}
                            </div>

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "TRANSACTION HISTORY ERROR:",
            error
        );

        document
            .getElementById(
                "transaction-history-list"
            )
            .innerHTML = `
                <div style="
                    color:#ff6575;
                    text-align:center;
                    padding:20px;
                ">
                    Không tải được lịch sử giao dịch
                </div>
            `;
    }
}
async function openWithdrawForm() {

    const old =
        document.getElementById(
            "withdraw-panel"
        );

    if (old) {
        old.remove();
    }

    const userId = getUserId();

    if (!userId) {
        openAuth();
        return;
    }

    let balance = 0;

    try {

        const user =
            await api(`/users/${userId}`);

        balance =
            Number(user.balance || 0);

    } catch (error) {

        console.error(
            "LOAD BALANCE ERROR:",
            error
        );

        alert(
            "Không tải được số dư."
        );

        return;
    }


    const panel =
        document.createElement("div");

    panel.id =
        "withdraw-panel";


    panel.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            z-index:10000;
            background:rgba(0,0,0,.78);
            display:flex;
            align-items:flex-end;
            justify-content:center;
        ">

            <div style="
                width:100%;
                max-width:520px;
                background:#08111d;
                color:#fff;
                border:1px solid #20344b;
                border-radius:24px 24px 0 0;
                padding:24px;
                box-sizing:border-box;
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:22px;
                ">

                    <div>

                        <div style="
                            color:#718ba8;
                            font-size:12px;
                            margin-bottom:6px;
                        ">
                            GIAO DỊCH
                        </div>

                        <div style="
                            font-size:22px;
                            font-weight:700;
                        ">
                            Rút tiền
                        </div>

                    </div>


                    <button
                        id="withdraw-close"
                        type="button"
                        style="
                            width:40px;
                            height:40px;
                            border-radius:50%;
                            border:1px solid #29405a;
                            background:#101e2e;
                            color:#fff;
                            font-size:20px;
                        "
                    >
                        ×
                    </button>

                </div>


                <div style="
                    background:#0d1c2d;
                    border:1px solid #20344b;
                    border-radius:16px;
                    padding:16px;
                    margin-bottom:16px;
                ">

                    <div style="
                        color:#718ba8;
                        font-size:12px;
                        margin-bottom:6px;
                    ">
                        Số dư khả dụng
                    </div>

                    <div style="
                        font-size:24px;
                        font-weight:700;
                    ">
                        ${balance.toLocaleString("en-US")}
                        <span style="
                            font-size:13px;
                            color:#8da3bc;
                        ">
                            USDT
                        </span>
                    </div>

                </div>


                <label style="
                    display:block;
                    color:#8da3bc;
                    font-size:13px;
                    margin-bottom:8px;
                ">
                    Địa chỉ ví nhận
                </label>

                <input
                    id="withdraw-wallet"
                    type="text"
                    placeholder="Nhập địa chỉ ví"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:15px;
                        margin-bottom:16px;
                        border-radius:12px;
                        border:1px solid #29405a;
                        background:#0d1927;
                        color:#fff;
                        font-size:15px;
                        outline:none;
                    "
                />


                <label style="
                    display:block;
                    color:#8da3bc;
                    font-size:13px;
                    margin-bottom:8px;
                ">
                    Số tiền rút
                </label>

                <input
                    id="withdraw-amount"
                    type="number"
                    min="1"
                    max="${balance}"
                    step="0.01"
                    placeholder="Nhập số tiền USDT"
                    style="
                        width:100%;
                        box-sizing:border-box;
                        padding:15px;
                        margin-bottom:16px;
                        border-radius:12px;
                        border:1px solid #29405a;
                        background:#0d1927;
                        color:#fff;
                        font-size:16px;
                        outline:none;
                    "
                />


                <button
                    id="withdraw-submit"
                    type="button"
                    style="
                        width:100%;
                        padding:16px;
                        border:none;
                        border-radius:14px;
                        background:#168cff;
                        color:#fff;
                        font-size:16px;
                        font-weight:600;
                    "
                >
                    Tạo lệnh rút
                </button>


                <div
                    id="withdraw-message"
                    style="
                        margin-top:14px;
                        text-align:center;
                        color:#8da3bc;
                        font-size:13px;
                    "
                ></div>

            </div>

        </div>
    `;


    document.body.appendChild(panel);


    document
        .getElementById("withdraw-close")
        ?.addEventListener(
            "click",
            () => panel.remove()
        );


    document
        .getElementById("withdraw-submit")
        ?.addEventListener(
            "click",
            submitWithdraw
        );
}


/* =========================================
   CREATE WITHDRAWAL
========================================= */

async function submitWithdraw() {

    const userId =
        getUserId();

    const wallet =
        document
            .getElementById(
                "withdraw-wallet"
            )
            ?.value
            .trim();

    const amount =
        Number(
            document
                .getElementById(
                    "withdraw-amount"
                )
                ?.value
        );

    const message =
        document.getElementById(
            "withdraw-message"
        );


    if (!userId) {

        message.textContent =
            "Bạn chưa đăng nhập.";

        return;
    }


    if (!wallet) {

        message.textContent =
            "Vui lòng nhập địa chỉ ví.";

        return;
    }


    if (!amount || amount <= 0) {

        message.textContent =
            "Vui lòng nhập số tiền hợp lệ.";

        return;
    }


    message.textContent =
        "Đang tạo lệnh rút...";


    try {

        const result =
            await api(
                "/withdrawals",
                {
                    method: "POST",

                    body:
                        JSON.stringify({

                            user_id:
                                Number(userId),

                            amount:
                                amount,

                            wallet_address:
                                wallet

                        })
                }
            );


        console.log(
            "WITHDRAW CREATED:",
            result
        );


        message.textContent =
            "Đã tạo lệnh rút — đang chờ duyệt.";


        setTimeout(
            () => {

                document
                    .getElementById(
                        "withdraw-panel"
                    )
                    ?.remove();

            },
            1200
        );


    } catch (error) {

        console.error(
            "WITHDRAW ERROR:",
            error
        );

        message.textContent =
            "Lỗi: " +
            error.message;
    }
}