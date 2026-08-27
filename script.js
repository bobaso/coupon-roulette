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
        probability: 5
    },

    {
        rank: "2等",
        name: "10％OFFクーポン",
        probability: 20
    },

    {
        rank: "3等",
        name: "とっっっってもながいなまえの5％OFFクーポン",
        probability: 75
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

        rankLabel.classList.add("rank-label");


        const rankSpan =
            document.createElement("span");

        rankSpan.textContent =
            coupon.rank;


        rankLabel.appendChild(rankSpan);


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

        couponItem.appendChild(rankLabel);

        couponItem.appendChild(couponContent);


        /* ==============================
           リストに追加
        ============================== */

        couponList.appendChild(couponItem);

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
        上から順番に確率を足していき、
        ランダムな数字が入った賞を当選にする
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
        万が一確率の合計が100未満だった場合、
        最後のクーポンを返す
    */

    return coupons[coupons.length - 1];

}


/* ==================================================
   抽選結果表示
================================================== */

function showResult() {

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
   クーポン取得ボタン
================================================== */

couponBtn.addEventListener(
    "click",
    function () {

        showResult();

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
