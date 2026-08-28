/* ==================================================
   クーポン設定
   ==================================================

   ★クーポンの内容はここだけ変更してください。

   rank        → 等賞
   name        → クーポン名
   probability → 当選確率

   probability の合計は100にしてください。
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
   クーポンリスト自動生成
================================================== */

function createCouponList() {

    /* クーポンリストを一度空にする */

    couponList.innerHTML = "";


    /* couponsの数だけ自動生成 */

    coupons.forEach((coupon, index) => {

        /*
         * 1番目 → rank-1
         * 2番目 → rank-2
         * 3番目 → rank-3
         * 4番目 → rank-4
         * ...
         */

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
           クーポンを組み立てる
        ============================== */

        couponItem.appendChild(
            rankLabel
        );

        couponItem.appendChild(
            couponContent
        );


        /* ==============================
           リストに追加
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

    /*
        0～100のランダムな数字を作る
    */

    const random =
        Math.random() * 100;

    let cumulativeProbability = 0;


    /*
        上から順番に確率を足していく
    */

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


    /*
        万が一確率の合計が100未満だった場合
        最後のクーポンを返す
    */

    return coupons[
        coupons.length - 1
    ];

}


/* ==================================================
   1等 紙吹雪
================================================== */

function createConfetti() {

    confetti({

        /* 紙吹雪の数 */

        particleCount: 100,


        /* 発射角度 */

        angle: 90,


        /* 左右への広がり */

        spread: 90,


        /* 重力 */

        gravity: 0.2,


        /* 横方向への流れ */

        drift: 0,


        /* アニメーション時間 */

        ticks: 200,


        /* 発射位置 */

        origin: {
            x: 0.5,
            y: 0.8
        },


        /* 色 */

        colors: [
            '#165B33',
            '#BB2528',
            '#146B3A',
            '#EA4630'
        ],


        /* 四角形のみ */

        shapes: ['square'],


        /* サイズ */

        scalar: 0.8,


        /* 重なり順 */

        zIndex: 100

    });

}


/* ==================================================
   抽選結果表示
================================================== */

function showResult() {

    /* =================================
       クーポンを抽選
    ================================= */

    const result =
        drawCoupon();


    /* =================================
       結果を書き換える
    ================================= */

    rankText.textContent =
        result.rank;

    couponText.textContent =
        result.name;


    /* =================================
       前回の等賞クラスを削除
    ================================= */

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


    /* =================================
       当選した等賞のCSSクラスを設定
    ================================= */

    const resultIndex =
        coupons.indexOf(result);


    resultCouponItem.classList.add(
        `rank-${resultIndex + 1}`
    );


    /* =================================
       スタート画面を隠す
    ================================= */

    startScreen.classList.add(
        "hidden"
    );


    /* =================================
       結果画面を表示
    ================================= */

    resultScreen.classList.remove(
        "hidden"
    );

/* =================================
   1等の場合は引き直しボタンを非表示
   2等以下は表示
================================= */

if (result.rank === "1等") {

    retryBtn.style.display = "none";

} else {

    retryBtn.style.display = "block";

}
    /* =================================
       1等の場合だけ紙吹雪
    ================================= */

    if (result.rank === "1等") {

        createConfetti();

    }

}

/* ==================================================
   初期処理
================================================== */

/*
   ページ読み込み時に
   クーポンリストを自動生成
*/

createCouponList();


/* ==================================================
   抽選中アニメーション
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

const whiteout =
    document.getElementById("whiteout");


/* =================================
   抽選演出開始
================================= */

function startLotteryAnimation() {

    /* 抽選結果を先に決定 */

    const result =
        drawCoupon();


    /* 結果を書き換える */

    rankText.textContent =
        result.rank;

    couponText.textContent =
        result.name;


    /* 等賞クラスをリセット */

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


    const resultIndex =
        coupons.indexOf(result);


    resultCouponItem.classList.add(
        `rank-${resultIndex + 1}`
    );


    /* スタート画面を隠す */

    startScreen.classList.add(
        "hidden"
    );


    /* 抽選画面を表示 */

    lotteryScreen.classList.remove(
        "hidden"
    );


    /* アニメーションを初期化 */

    gachaMachine.className =
        "gacha-machine";

    gachaCapsule.className =
        "gacha-capsule";

    lotteryLight.className =
        "lottery-light";

    whiteout.className =
        "whiteout";


    /* =================================
       ① ガチャ機1回目
    ================================= */

    setTimeout(function () {

        gachaMachine.classList.add(
            "shake-1"
        );

    }, 300);


    /* =================================
       ② ガチャ機2回目
    ================================= */

    setTimeout(function () {

        gachaMachine.classList.remove(
            "shake-1"
        );

        void gachaMachine.offsetWidth;

        gachaMachine.classList.add(
            "shake-2"
        );

    }, 850);


    /* =================================
       ③ カプセル排出
    ================================= */

    setTimeout(function () {

        gachaCapsule.classList.add(
            "eject"
        );

    }, 1300);


    /* =================================
       ④ カプセルズーム
    ================================= */

    setTimeout(function () {

        gachaCapsule.classList.remove(
            "eject"
        );

        void gachaCapsule.offsetWidth;

        gachaCapsule.classList.add(
            "zoom"
        );

    }, 2050);


    /* =================================
       ⑤ カプセルが割れる
    ================================= */

    setTimeout(function () {

        gachaCapsule.classList.remove(
            "zoom"
        );

        void gachaCapsule.offsetWidth;

        gachaCapsule.classList.add(
            "break"
        );

    }, 2800);


    /* =================================
       ⑥ 光が拡散
    ================================= */

    setTimeout(function () {

        lotteryLight.classList.add(
            "flash"
        );

    }, 2950);


    /* =================================
       ⑦ ホワイトアウト
    ================================= */

    setTimeout(function () {

        whiteout.classList.add(
            "show"
        );

    }, 3250);


    /* =================================
       ⑧ 結果画面
    ================================= */

    setTimeout(function () {

        lotteryScreen.classList.add(
            "hidden"
        );

        resultScreen.classList.remove(
            "hidden"
        );


        /* 1等の場合だけ紙吹雪 */

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
         * 現在のアニメーションを止める
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

        showResult();

    }
);
