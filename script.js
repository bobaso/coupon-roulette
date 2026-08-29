
/* ==================================================
   クーポン設定
================================================== */

const coupons = [

    {
        rank: "1等",
        name: "ドリンク一杯無料券",
        probability: 10
    },

    {
        rank: "2等",
        name: "10％OFFクーポン",
        probability: 30
    },

    {
        rank: "3等",
        name: "5％OFFクーポン",
        probability: 60
    }

];


/* ==================================================
   HTML要素取得
================================================== */

const startScreen =
    document.getElementById("startScreen");

const resultScreen =
    document.getElementById("resultScreen");

const couponBtn =
    document.getElementById("couponBtn");

const useCouponBtn =
    document.getElementById("useCouponBtn");

let issuedCouponId = null;

const retryBtn =
    document.getElementById("retryBtn");

const rankText =
    document.getElementById("rankText");

const couponText =
    document.getElementById("couponText");

const resultCouponItem =
    document.getElementById("resultCouponItem");

const couponList =
    document.getElementById("couponList");


/* ==================================================
   抽選演出用HTML要素
================================================== */

const lotteryScreen =
    document.getElementById("lotteryScreen");

const skipButton =
    document.getElementById("skipButton");

const gachaMachine =
    document.getElementById("gachaMachine");

const gachaCapsule =
    document.getElementById("gachaCapsule");

const lotteryLight =
    document.getElementById("lotteryLight");

const capsuleTop =
    document.querySelector(".capsule-top");

const capsuleBottom =
    document.querySelector(".capsule-bottom");
/* ==================================================
   抽選中テキスト
================================================== */

const lotteryText =
    document.querySelector(".lottery-text");

const whiteout =
    document.getElementById("whiteout");

/* ==================================================
   抽選演出タイマー管理
================================================== */

let lotteryTimers = [];


/* ==================================================
   抽選タイマーをすべて停止
================================================== */

function clearLotteryTimers() {

    lotteryTimers.forEach(function (timer) {

        clearTimeout(timer);

    });

    lotteryTimers = [];

}


/* ==================================================
   タイマーを登録
================================================== */

function setLotteryTimer(callback, delay) {

    const timer =
        setTimeout(callback, delay);

    lotteryTimers.push(timer);

    return timer;

}


/* ==================================================
   抽選中テキストアニメーション
================================================== */

let lotteryTextTimer = null;
let lotteryTextTimeout = null;


/* ==================================================
   抽選中テキストを1文字ずつ分解
================================================== */

function setupLotteryText() {

    const text =
        lotteryText.textContent.trim();

    lotteryText.innerHTML = "";

    const chars =
        [...text];

    chars.forEach(function (char, index) {

        const span =
            document.createElement("span");

        span.classList.add("char");

        span.style.setProperty(
            "--char-index",
            index
        );

        span.style.setProperty(
            "--reverse-index",
            chars.length - 1 - index
        );

        span.textContent = char;

        lotteryText.appendChild(span);

    });

}


/* ==================================================
   抽選中テキストアニメーション開始
================================================== */

function startLotteryTextAnimation() {

    /* 既存タイマーを完全停止 */

    clearInterval(lotteryTextTimer);
    clearTimeout(lotteryTextTimeout);


    /* 初期状態 */

    lotteryText.classList.remove(
        "is-active",
        "is-hide"
    );


    /* ==========================================
       ① 文字を表示
       ========================================== */

   setLotteryTimer(function () {

        lotteryText.classList.add(
            "is-active"
        );


        /* ==========================================
           ② 表示後にフェードアウト
           ========================================== */

        lotteryTextTimeout =
            setLotteryTimer(function () {

                lotteryText.classList.remove(
                    "is-active"
                );

                lotteryText.classList.add(
                    "is-hide"
                );


            }, 1500);


    }, 100);


    /* ==========================================
       ③ 繰り返す
       ========================================== */

    lotteryTextTimer =
        setInterval(function () {

            lotteryText.classList.remove(
                "is-active",
                "is-hide"
            );


            /*
             * ブラウザに一度リセットさせる
             */

            void lotteryText.offsetWidth;


            /*
             * もう一度表示
             */

            lotteryText.classList.add(
                "is-active"
            );


            /*
             * 表示後に消す
             */

            lotteryTextTimeout =
                setLotteryTimer(function () {

                    lotteryText.classList.remove(
                        "is-active"
                    );

                    lotteryText.classList.add(
                        "is-hide"
                    );

                }, 1500);


        }, 3000);

}
/* ==================================================
   クーポンリスト自動生成
================================================== */

function createCouponList() {

    couponList.innerHTML = "";

    coupons.forEach((coupon, index) => {

        const couponItem =
            document.createElement("div");

        couponItem.classList.add(
            "coupon-item",
            `rank-${index + 1}`
        );


        /* ==============================
           等賞
        ============================== */

        const rankLabel =
            document.createElement("div");

        rankLabel.classList.add(
            "rank-label"
        );


        const rankSpan =
            document.createElement("span");

        rankSpan.textContent =
            coupon.rank;


        rankLabel.appendChild(
            rankSpan
        );


        /* ==============================
           クーポン名
        ============================== */

        const couponContent =
            document.createElement("div");

        couponContent.classList.add(
            "coupon-content"
        );

        couponContent.textContent =
            coupon.name;


        /* ==============================
           組み立て
        ============================== */

        couponItem.appendChild(
            rankLabel
        );

        couponItem.appendChild(
            couponContent
        );


        /* ==============================
           リストへ追加
        ============================== */

        couponList.appendChild(
            couponItem
        );

    });

}


/* ==================================================
   結果画面の等賞クラスを設定
================================================== */
function setResultCoupon(result) {

    /* 既存クラスを削除 */

    resultCouponItem.classList.remove(
        "rank-1",
        "rank-2",
        "rank-3",
        "rank-4",
        "rank-5",
        "rank-6",
        "rank-7",
        "rank-8",
        "rank-9",
        "rank-10"
    );


    /* 結果を書き換え */

    rankText.textContent =
        result.rank;

    couponText.textContent =
        result.name;


    /* =========================================
       APIから返ってきた順位を直接判定
    ========================================= */

    let resultRankClass = "";

    if (result.rank === "1等") {

        resultRankClass = "rank-1";

    } else if (result.rank === "2等") {

        resultRankClass = "rank-2";

    } else if (result.rank === "3等") {

        resultRankClass = "rank-3";

    }


    /* =========================================
       結果画面に順位クラスを追加
    ========================================= */

    if (resultRankClass) {

        resultCouponItem.classList.add(
            resultRankClass
        );

    }

}
/* ==================================================
   ガチャカプセルの色変更
   1等だけ特別カラー
================================================== */

function setCapsuleImage(result) {

    if (result.rank === "1等") {

        capsuleTop.src =
            "images/capsule-top1.png";

        capsuleBottom.src =
            "images/capsule-bottom1.png";

    } else {

        capsuleTop.src =
            "images/capsule-top.png";

        capsuleBottom.src =
            "images/capsule-bottom.png";

    }

}

/* ==================================================
   紙吹雪
================================================== */

function createConfetti() {

    confetti({

        particleCount: 100,

        angle: 90,

        spread: 90,

        gravity: 0.2,

        drift: 0,

        ticks: 200,

        origin: {
            x: 0.5,
            y: 0.8
        },

        colors: [
            '#165B33',
            '#BB2528',
            '#146B3A',
            '#EA4630'
        ],

        shapes: ['square'],

        scalar: 0.8,

        zIndex: 300

    });

}

/* ==================================================
   カプセルアニメーションを完全リセット
================================================== */

function resetCapsuleAnimation() {

    /*
     * カプセルの状態をすべてリセット
     *
     * breakは使用しない
     * openもここで削除する
     */

    gachaCapsule.classList.remove(
        "eject",
        "zoom",
        "open"
    );


    /*
     * ブラウザに状態を反映
     */

    void gachaCapsule.offsetWidth;


    /*
     * ガチャ機のアニメーションもリセット
     */

    gachaMachine.classList.remove(
        "shake-1",
        "shake-2"
    );

    void gachaMachine.offsetWidth;


    /*
     * 光をリセット
     */

lotteryLight.classList.remove(
    "flash",
    "flash-first"
);


    /*
     * ホワイトアウトをリセット
     */

    whiteout.classList.remove(
        "show"
    );

}

/* ==================================================
   カプセルを開く
   transition方式
================================================== */

function openCapsule() {

    /*
     * カプセルを開く
     * .gacha-capsule.open .capsule-top-wrap
     * .gacha-capsule.open .capsule-bottom-wrap
     *
     * が発動する
     */

    gachaCapsule.classList.add(
        "open"
    );


    /*
     * デバッグ用
     */

    console.log(
        "カプセル開封開始:",
        gachaCapsule.className
    );

}
/* ==================================================
   抽選演出開始
================================================== */

async function startLotteryAnimation() {
clearLotteryTimers();

clearInterval(lotteryTextTimer);
clearTimeout(lotteryTextTimeout);
    /*
     * =============================================
     * 抽選結果を最初に1回だけ決定
     * =============================================
     */

const response = await fetch(
    "https://coupon-api.yoshioka-mwork.workers.dev/draw"
);

const data = await response.json();

if (!data.success) {
    alert(data.error || "クーポンを取得できませんでした");
    return;
}
issuedCouponId =
    data.issued_coupon_id;
const result = data.coupon;

setCapsuleImage(result);
setResultCoupon(result);


    /*
     * =============================================
     * 画面切り替え
     * =============================================
     */

    startScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.add(
        "hidden"
    );

    lotteryScreen.classList.remove(
        "hidden"
    );
startLotteryTextAnimation();
    /*
     * =============================================
     * アニメーションを完全リセット
     * =============================================
     */

    resetCapsuleAnimation();


    /*
     * =============================================
     * ① ガチャ機1回目
     * =============================================
     */

    setLotteryTimer(function () {
        gachaMachine.classList.add(
            "shake-1"
        );

    }, 300);


    /*
     * =============================================
     * ② ガチャ機2回目
     * =============================================
     */

    setLotteryTimer(function () {

        gachaMachine.classList.remove(
            "shake-1"
        );

        void gachaMachine.offsetWidth;

        gachaMachine.classList.add(
            "shake-2"
        );

    }, 850);


    /*
     * =============================================
     * ③ カプセル排出
     * =============================================
     */

    setLotteryTimer(function () {

gachaCapsule.classList.remove(
    "zoom",
    "open"
);

        void gachaCapsule.offsetWidth;

        gachaCapsule.classList.add(
            "eject"
        );


        console.log(
            "カプセル排出開始"
        );

    }, 1300);


    /*
     * =============================================
     * ④ カプセルズーム
     * =============================================
     */

    setLotteryTimer(function () {

        gachaCapsule.classList.remove(
            "eject"
        );

        void gachaCapsule.offsetWidth;

        gachaCapsule.classList.add(
            "zoom"
        );


        console.log(
            "カプセルズーム開始"
        );

    }, 2050);


    /*
     * =============================================
     * ⑤ カプセル開封
     *
     * ★最重要部分
     * =============================================
     */

    setLotteryTimer(function () {

        openCapsule();

    }, 2800);


/* =============================================
   ⑥ カプセル中央の光
   1等だけ強い光
============================================= */

setLotteryTimer(function () {

    lotteryLight.classList.remove(
        "flash",
        "flash-first"
    );

    void lotteryLight.offsetWidth;


    /* 1等なら強い光 */

    if (result.rank === "1等") {

        lotteryLight.classList.add(
            "flash-first"
        );

    } else {

        lotteryLight.classList.add(
            "flash"
        );

    }

}, 2950);
    /*
     * =============================================
     * ⑦ ホワイトアウト
     * =============================================
     */

    setLotteryTimer(function () {

        whiteout.classList.remove(
            "show"
        );

        void whiteout.offsetWidth;

        whiteout.classList.add(
            "show"
        );

    }, 3250);


    /*
     * =============================================
     * ⑧ 結果画面
     * =============================================
     */

setLotteryTimer(function () {

    /*
     * 抽選中テキストを停止
     */
    clearInterval(lotteryTextTimer);
    clearTimeout(lotteryTextTimeout);

    lotteryText.classList.remove(
        "is-active",
        "is-hide"
    );


    /*
     * 抽選画面を終了
     */
    lotteryScreen.classList.add(
        "hidden"
    );


    /*
     * 結果画面を表示
     */
    resultScreen.classList.remove(
        "hidden"
    );


    /*
     * =========================================
     * 1等なら「もう一度引く」を非表示
     * =========================================
     */

    if (result.rank === "1等") {

        retryBtn.style.display = "none";

    } else {

        retryBtn.style.display = "block";

    }


    /*
     * =========================================
     * 1等なら紙吹雪
     * =========================================
     */

    if (result.rank === "1等") {

        createConfetti();

    }

}, 3700);

}
/* ==================================================
   クーポン取得ボタン
================================================== */

couponBtn.addEventListener(
    "click",
    function () {

        startLotteryAnimation();

    }
);

/* ==================================================
   Skipボタン
================================================== */

skipButton.addEventListener(
    "click",
    function () {

        /*
         * =========================================
         * 抽選演出のタイマーを完全停止
         * =========================================
         */

        clearLotteryTimers();


        /*
         * =========================================
         * 抽選中テキストも停止
         * =========================================
         */

        clearInterval(lotteryTextTimer);
        clearTimeout(lotteryTextTimeout);

        lotteryText.classList.remove(
            "is-active",
            "is-hide"
        );


        /*
         * =========================================
         * カプセル演出をリセット
         * =========================================
         */

        resetCapsuleAnimation();


        /*
         * =========================================
         * 抽選画面を終了
         * =========================================
         */

        lotteryScreen.classList.add(
            "hidden"
        );


        /*
         * =========================================
         * 結果画面を表示
         * =========================================
         */

        resultScreen.classList.remove(
            "hidden"
        );


        /*
         * =========================================
         * 1等なら引き直しボタンを非表示
         * =========================================
         */

        if (rankText.textContent === "1等") {

            retryBtn.style.display = "none";

        } else {

            retryBtn.style.display = "block";

        }

    }
);



/* ==================================================
   もう一度引く
================================================== */

retryBtn.addEventListener(
    "click",
    function () {

        startLotteryAnimation();

    }
);


/* ==================================================
   初期処理
================================================== */

createCouponList();

/* ==================================================
   クーポンを使用する
================================================== */

useCouponBtn.addEventListener(
    "click",
    async function () {

        if (!issuedCouponId) {

            alert("クーポン情報がありません");

            return;

        }

        useCouponBtn.disabled = true;

        try {

            const response = await fetch(
                "https://coupon-api.yoshioka-mwork.workers.dev/use",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        issued_coupon_id:
                            issuedCouponId
                    })
                }
            );


            const data =
                await response.json();


            if (!data.success) {

                alert(
                    data.error ||
                    "クーポンを使用できませんでした"
                );

                useCouponBtn.disabled = false;

                return;

            }


    /* 使用成功 */

alert(
    "クーポンを使用しました"
);

        } catch (error) {

            console.error(error);

            alert(
                "通信エラーが発生しました"
            );

            useCouponBtn.disabled = false;

        }

    }
);
