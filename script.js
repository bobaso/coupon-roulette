/* ==================================================
   クーポン設定
================================================== */

const coupons = [

    {
        rank: "1等",
        name: "ドリンク一杯無料券",
        probability: 98
    },

    {
        rank: "2等",
        name: "10％OFFクーポン",
        probability: 1
    },

    {
        rank: "3等",
        name: "5％OFFクーポン",
        probability: 1
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

    setTimeout(function () {

        lotteryText.classList.add(
            "is-active"
        );


        /* ==========================================
           ② 表示後にフェードアウト
           ========================================== */

        lotteryTextTimeout =
            setTimeout(function () {

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
                setTimeout(function () {

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
   クーポン抽選
================================================== */

function drawCoupon() {

    const random =
        Math.random() * 100;

    let cumulativeProbability = 0;


    for (const coupon of coupons) {

        cumulativeProbability +=
            coupon.probability;


        if (
            random <
            cumulativeProbability
        ) {

            return coupon;

        }

    }


    /* 念のため */

    return coupons[
        coupons.length - 1
    ];

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


    /* 当選順位を取得 */

    const resultIndex =
        coupons.indexOf(result);


    /* クラスを追加 */

    resultCouponItem.classList.add(
        `rank-${resultIndex + 1}`
    );

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
        "flash"
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

function startLotteryAnimation() {

    /*
     * =============================================
     * 抽選結果を最初に1回だけ決定
     * =============================================
     */

    const result =
        drawCoupon();
setCapsuleImage(result);

    /*
     * 結果画面の内容を先にセット
     */

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

    setTimeout(function () {

        gachaMachine.classList.add(
            "shake-1"
        );

    }, 300);


    /*
     * =============================================
     * ② ガチャ機2回目
     * =============================================
     */

    setTimeout(function () {

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

    setTimeout(function () {

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

    setTimeout(function () {

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

    setTimeout(function () {

        openCapsule();

    }, 2800);


    /*
     * =============================================
     * ⑥ カプセル中央の光
     * =============================================
     */

    setTimeout(function () {

        lotteryLight.classList.remove(
            "flash"
        );

        void lotteryLight.offsetWidth;

        lotteryLight.classList.add(
            "flash"
        );

    }, 2950);


    /*
     * =============================================
     * ⑦ ホワイトアウト
     * =============================================
     */

    setTimeout(function () {

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

setTimeout(function () {

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
         * 現在の抽選画面を終了
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
