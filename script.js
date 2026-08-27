/* ==================================================
   クーポン設定
   ==================================================

   ★ここを変更するだけで
   「等賞」「クーポン名」「当選確率」を変更できます。

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
        name: "5％OFFクーポン",
        probability: 75
    }

];


/* ==================================================
   HTML要素取得
================================================== */

const startScreen = document.getElementById("startScreen");

const resultScreen = document.getElementById("resultScreen");

const couponBtn = document.getElementById("couponBtn");

const retryBtn = document.getElementById("retryBtn");

const rankText = document.getElementById("rankText");

const couponText = document.getElementById("couponText");

const resultCouponItem =
    document.getElementById("resultCouponItem");

/* ==================================================
   クーポン抽選
================================================== */

function drawCoupon() {

    /*
        0～100のランダムな数字を作る
    */

    const random = Math.random() * 100;

    let cumulativeProbability = 0;


    /*
        上から順番に確率を足していき、
        ランダムな数字が入った賞を当選にする
    */

    for (const coupon of coupons) {

        cumulativeProbability += coupon.probability;

        if (random < cumulativeProbability) {

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
   結果を表示
================================================== */

function showResult() {

    const result = drawCoupon();


    /*
        結果を書き換える
    */

    rankText.textContent = result.rank;

    couponText.textContent = result.name;


    /*
        等賞に合わせて
        結果画面のデザインを変更
    */

    resultCouponItem.classList.remove(
        "rank-1",
        "rank-2",
        "rank-3",
        "rank-4"
    );


    /*
        1等
    */

    if (result.rank === "1等") {

        resultCouponItem.classList.add("rank-1");

    }


    /*
        2等
    */

    else if (result.rank === "2等") {

        resultCouponItem.classList.add("rank-2");

    }


    /*
        3等
        それ以外も3等デザイン
    */

    else {

        resultCouponItem.classList.add("rank-3");

    }


    /*
        スタート画面を隠す
    */

    startScreen.classList.add("hidden");


    /*
        結果画面を表示
    */

    resultScreen.classList.remove("hidden");

}


/* ==================================================
   クーポン取得ボタン
================================================== */

couponBtn.addEventListener("click", function () {

    showResult();

});


/* ==================================================
   もう一度引く
================================================== */

retryBtn.addEventListener("click", function () {

    showResult();

});
