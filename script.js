/* =========================================
   Cloudflare Worker API
========================================= */

const API_URL =
    "https://coupon-api.yoshioka-mwork.workers.dev";

/* ==================================================
   HTML要素取得
================================================== */

const startScreen =
    document.getElementById("startScreen");

const resultScreen =
    document.getElementById("resultScreen");

const couponBtn =
    document.getElementById("couponBtn");

let campaignStartDate = null;
let campaignEndDate = null;

/* ==================================================
   抽選モード
   test：引き直し可能
   daily：1日1回・引き直し不可
================================================== */

let campaignDrawMode = "test";
let instagramRetryEnabled = false;
let instagramRetryUrl =
    "https://www.instagram.com/umakitack/";
/* ==================================================
   SNS引き直し用
   SNSへ移動した状態を保存
================================================== */

const SNS_RETRY_PENDING_KEY =
    "sns_retry_pending";


/* ==================================================
   SNSへ移動した状態を保存
================================================== */

function setSnsRetryPending() {

    localStorage.setItem(
        SNS_RETRY_PENDING_KEY,
        "true"
    );

}


/* ==================================================
   SNSへ移動した状態を確認
================================================== */

function isSnsRetryPending() {

    return (
        localStorage.getItem(
            SNS_RETRY_PENDING_KEY
        ) === "true"
    );

}


/* ==================================================
   SNSへ移動した状態を削除
================================================== */

function clearSnsRetryPending() {

    localStorage.removeItem(
        SNS_RETRY_PENDING_KEY
    );

}
/* ==================================================
   SNSフォロー先URL取得
================================================== */

async function loadInstagramRetryUrl() {

    try {

        const response =
            await fetch(
                API_URL +
                "/instagram-retry-setting"
            );

        if (!response.ok) {

            throw new Error(
                "SNS設定の取得に失敗しました"
            );

        }

        const data =
            await response.json();


      if (data.success) {

    /* =========================================
       SNS引き直しON / OFF
    ========================================= */

    instagramRetryEnabled =
        data.instagram_retry_enabled === true;


    /* =========================================
       SNSフォロー先URL
    ========================================= */

    if (data.instagram_retry_url) {

        instagramRetryUrl =
            data.instagram_retry_url;

    }

}

    } catch (error) {

        console.error(
            "SNSフォロー先URL取得エラー:",
            error
        );

    }

}
/* ==================================================
   SNSから戻った後の引き直しボタン表示
================================================== */

function updateSnsRetryButton() {

    if (!isSnsRetryPending()) {
        return;
    }

    retryBtn.textContent =
        "引き直す";

    retryBtn.disabled =
        false;

    retryBtn.style.display =
        "block";

}
let campaignActive = false;
const useCouponBtn =
    document.getElementById("useCouponBtn");

let issuedCouponId = null;
let isLoseResult = false;

const retryBtn =
    document.getElementById("retryBtn");

const rankText =
    document.getElementById("rankText");

const couponText =
    document.getElementById("couponText");

const resultCouponItem =
    document.getElementById("resultCouponItem");
const usedStamp =
    document.getElementById("usedStamp");
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

function createCouponList(coupons) {

    couponList.innerHTML = "";

    coupons.forEach((coupon) => {

        const couponItem =
            document.createElement("div");


        /* =========================================
           3等以下はすべて3等デザイン
        ========================================= */

        let designClass = "rank-3";

        if (coupon.rank === "1等") {

            designClass = "rank-1";

        } else if (coupon.rank === "2等") {

            designClass = "rank-2";

        }


        couponItem.classList.add(
            "coupon-item",
            designClass
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
   キャンペーン開催期間取得
================================================== */

async function loadCampaign() {

    try {

        const response =
           await fetch(
    "https://coupon-api.yoshioka-mwork.workers.dev/campaign"
);


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                "キャンペーン取得エラー:",
                data.error
            );

            return false;

        }


        /* =========================================
           キャンペーン期間を取得
        ========================================= */

campaignStartDate =
    data.campaign.start_date;

campaignEndDate =
    data.campaign.end_date;


/* =========================================
   抽選モードを取得
========================================= */

campaignDrawMode =
    data.campaign.draw_mode || "test";


console.log(
    "抽選モード:",
    campaignDrawMode
);

        /* =========================================
           画面上の開催期間を更新
        ========================================= */

        const campaignPeriod =
            document.getElementById(
                "campaignPeriod"
            );


        if (
            campaignPeriod &&
            campaignStartDate &&
            campaignEndDate
        ) {

            /*
             * YYYY-MM-DD
             * ↓
             * YYYY.M.D
             */

            const formatDate =
                function (dateString) {

                    const parts =
                        dateString.split("-");

                    const year =
                        parts[0];

                    const month =
                        Number(parts[1]);

                    const day =
                        Number(parts[2]);

                    return (
                        year +
                        "." +
                        month +
                        "." +
                        day
                    );

                };


            campaignPeriod.textContent =
                formatDate(campaignStartDate) +
                "~" +
                formatDate(campaignEndDate);

        }


        /* =========================================
           開催期間チェック
        ========================================= */

        return checkCampaignPeriod();


    } catch (error) {

        console.error(
            "キャンペーン期間取得エラー:",
            error
        );

        return false;

    }

}
/* ==================================================
   キャンペーン開催期間チェック
================================================== */

function checkCampaignPeriod() {

    if (
        !campaignStartDate ||
        !campaignEndDate
    ) {

        campaignActive = false;

        return false;

    }


    /*
     * 日本時間の日付を取得
     */

    const japanDate =
        new Intl.DateTimeFormat(
            "ja-JP",
            {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).formatToParts(new Date());


    const year =
        japanDate.find(
            part => part.type === "year"
        ).value;

    const month =
        japanDate.find(
            part => part.type === "month"
        ).value;

    const day =
        japanDate.find(
            part => part.type === "day"
        ).value;


    const today =
        `${year}-${month}-${day}`;


    /*
     * 開催期間内か確認
     *
     * 開始日・終了日は両方とも含む
     */

    campaignActive =
        today >= campaignStartDate &&
        today <= campaignEndDate;


    /*
     * ボタン表示変更
     */

    updateCampaignButton();


    return campaignActive;

}

/* ==================================================
   APIからクーポン一覧を取得
================================================== */

async function loadCoupons() {

    try {

        const response =
      await fetch(
    "https://coupon-api.yoshioka-mwork.workers.dev/coupons"
);


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                "クーポン取得エラー:",
                data.error
            );

            return;

        }


        /* =========================================
           APIから取得した賞品でリスト生成
        ========================================= */

        createCouponList(
            data.coupons
        );


    } catch (error) {

        console.error(
            "クーポン一覧取得エラー:",
            error
        );

    }

}

/* ==================================================
   結果画面の等賞クラスを設定
================================================== */
function setResultCoupon(result) {

    /* =========================================
       既存クラスを削除
    ========================================= */

    resultCouponItem.classList.remove(
        "rank-1",
        "rank-2",
        "rank-3",
        "rank-lose"
    );


    /* =========================================
       ハズレ判定
    ========================================= */

    isLoseResult =
        result.rank === "ハズレ";


    /* =========================================
       結果を書き換え
    ========================================= */

    rankText.textContent =
        result.rank;

    couponText.textContent =
        result.name;


    /* =========================================
       ハズレの場合
    ========================================= */

    if (isLoseResult) {

        resultCouponItem.classList.add(
            "rank-lose"
        );

        return;

    }


    /* =========================================
       通常当選の場合
    ========================================= */

    let resultRankClass = "";

    if (result.rank === "1等") {

        resultRankClass = "rank-1";

    } else if (result.rank === "2等") {

        resultRankClass = "rank-2";

    } else {

        /* 3等以下はすべて3等デザイン */

        resultRankClass = "rank-3";

    }


    /* =========================================
       結果画面に順位クラスを追加
    ========================================= */

    resultCouponItem.classList.add(
        resultRankClass
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
   抽選端末識別用トークン
================================================== */

function getDeviceToken() {

    let token =
        localStorage.getItem(
            "lottery_device_token"
        );

    if (!token) {

        token =
            crypto.randomUUID();

        localStorage.setItem(
            "lottery_device_token",
            token
        );

    }

    return token;

}

/* ==================================================
   SNS引き直し利用状況確認
================================================== */

async function loadInstagramRetryStatus() {

    try {

        const deviceToken =
            getDeviceToken();


        const response =
            await fetch(
                "https://coupon-api.yoshioka-mwork.workers.dev/retry-status?device_token=" +
                encodeURIComponent(deviceToken) +
                "&platform=instagram"
            );


        const data =
            await response.json();


        console.log(
            "SNS引き直し利用状況:",
            data
        );


        if (!data.success) {

            instagramRetryEnabled =
                false;

            return false;

        }


        instagramRetryEnabled =
            data.can_retry === true;


        return instagramRetryEnabled;


    } catch (error) {

        console.error(
            "SNS引き直し利用状況取得エラー:",
            error
        );

        instagramRetryEnabled =
            false;

        return false;

    }

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

const deviceToken =
    getDeviceToken();

const response = await fetch(
    "https://coupon-api.yoshioka-mwork.workers.dev/draw?device_token=" +
    encodeURIComponent(deviceToken)
);

const data = await response.json();

if (!data.success) {
    alert(data.error || "クーポンを取得できませんでした");
    return;
}
issuedCouponId =
    data.issued_coupon_id;
   
const result =
    data.coupon;


/* =========================================
   ハズレ判定
========================================= */

isLoseResult =
    data.lose === true;


/* =========================================
   結果を設定
========================================= */

setCapsuleImage(result);
setResultCoupon(result);


/* =========================================
   dailyモードで本日すでに抽選済みの場合
========================================= */

if (
    campaignDrawMode === "daily" &&
    data.already_drawn === true
) {

    /*
     * 抽選演出は行わない
     */

    clearLotteryTimers();

    clearInterval(
        lotteryTextTimer
    );

    clearTimeout(
        lotteryTextTimeout
    );


    /*
     * 抽選画面を非表示
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


    /* =========================================
       使用済みクーポンの場合
    ========================================= */

    if (
        data.used === true
    ) {

        /*
         * クーポン使用ボタンを
         * 「本日分使用済み」にする
         */

        useCouponBtn.textContent =
            "本日分使用済み";


        useCouponBtn.classList.add(
            "is-used"
        );


        useCouponBtn.disabled =
            true;


        useCouponBtn.style.display =
            "block";


        /*
         * 使用済み背景
         */

        const resultContent =
            document.querySelector(
                ".result-content"
            );


        resultContent.classList.add(
            "is-used"
        );


        /*
         * 「済」ハンコ
         */

        usedStamp.classList.remove(
            "show"
        );

        void usedStamp.offsetWidth;

        usedStamp.classList.add(
            "show"
        );


    } else {

        /*
         * 未使用クーポン
         */

        const resultContent =
            document.querySelector(
                ".result-content"
            );


        resultContent.classList.remove(
            "is-used"
        );


        usedStamp.classList.remove(
            "show"
        );


        /*
         * ハズレなら使用ボタンなし
         */

        if (isLoseResult) {

            useCouponBtn.style.display =
                "none";

        } else {

            /*
             * 未使用クーポンなので
             * 使用ボタンを表示
             */

            useCouponBtn.textContent =
                "クーポンを使用する";

            useCouponBtn.classList.remove(
                "is-used"
            );

            useCouponBtn.disabled =
                false;

            useCouponBtn.style.display =
                "block";

        }

    }


  /* =========================================
   SNS引き直し利用状況を確認
========================================= */

if (
    result.rank === "1等"
) {

    /*
     * 1等は引き直し不可
     */

    retryBtn.style.display =
        "none";

} else {

    /*
     * Workerへ
     * 今日の引き直し利用状況を確認
     */

    const canRetry =
        await loadInstagramRetryStatus();


    if (canRetry) {

        retryBtn.style.display =
            "block";

    } else {

        retryBtn.style.display =
            "none";

    }

}


    /*
     * ここで処理終了
     *
     * 抽選アニメーションは実行しない
     */

    return;

}

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

setLotteryTimer(async function () {

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


/* =========================================
   dailyモードの場合
   どの結果でも引き直し不可
========================================= */

if (campaignDrawMode === "daily") {

    /* =========================================
       dailyモード
       クーポン使用ボタン
    ========================================= */

    if (isLoseResult) {

        useCouponBtn.style.display =
            "none";

    } else {

        useCouponBtn.style.display =
            "block";

    }


/* =========================================
   SNS引き直し利用状況を確認
========================================= */

if (result.rank === "1等") {

    retryBtn.style.display =
        "none";

} else if (!instagramRetryEnabled) {

    retryBtn.style.display =
        "none";

} else {

    const canRetry =
        await loadInstagramRetryStatus();

    if (canRetry) {

        if (isSnsRetryPending()) {

            retryBtn.textContent =
                "引き直す";

        } else {

            retryBtn.textContent =
                "SNSをフォローして引き直す";

        }

        retryBtn.style.display =
            "block";

    } else {

        retryBtn.style.display =
            "none";

    }

}

    /* =========================================
       ハズレの場合
    ========================================= */

    if (isLoseResult) {

        useCouponBtn.style.display =
            "none";


    /* =========================================
       1等の場合
    ========================================= */

    } else if (result.rank === "1等") {

        useCouponBtn.style.display =
            "block";


        /*
         * 1等は引き直し不可
         */

        retryBtn.style.display =
            "none";


    /* =========================================
       通常当選の場合
    ========================================= */

    } else {

        useCouponBtn.style.display =
            "block";

    }

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

        /*
         * 開催期間外なら抽選しない
         */

        if (!checkCampaignPeriod()) {

            alert(
                "キャンペーン期間が終了しています"
            );

            return;

        }


        startLotteryAnimation();

    }
);
/* ==================================================
   クーポン取得ボタン表示
================================================== */

function updateCampaignButton() {

    if (!couponBtn) {

        return;

    }


    if (campaignActive) {

        couponBtn.textContent =
            "クーポンを取得";

        couponBtn.disabled =
            false;

        couponBtn.classList.remove(
            "campaign-ended"
        );

    } else {

        couponBtn.textContent =
            "キャンペーン終了";

        couponBtn.disabled =
            true;

        couponBtn.classList.add(
            "campaign-ended"
        );

    }

}
/* ==================================================
   Skipボタン
================================================== */

skipButton.addEventListener(
    "click",
    async function () {
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


/* =========================================
   dailyモードの場合
========================================= */

if (campaignDrawMode === "daily") {

    /* =========================================
       dailyモード
       クーポン使用ボタン
    ========================================= */

    if (isLoseResult) {

        useCouponBtn.style.display =
            "none";

    } else {

        useCouponBtn.style.display =
            "block";

    }


    /* =========================================
       SNS引き直し利用状況を確認
    ========================================= */

    if (result.rank === "1等") {

        /*
         * 1等は引き直し不可
         */

        retryBtn.style.display =
            "none";

    } else {

        /*
         * Workerへ
         * 今日の引き直し利用状況を確認
         */

        const canRetry =
            await loadInstagramRetryStatus();


        if (canRetry) {

            retryBtn.style.display =
                "block";

        } else {

            retryBtn.style.display =
                "none";

        }

    }


    /* =========================================
       ハズレの場合
    ========================================= */

    if (isLoseResult) {

        useCouponBtn.style.display =
            "none";


    /* =========================================
       1等の場合
    ========================================= */

    } else if (result.rank === "1等") {

        useCouponBtn.style.display =
            "block";

        /*
         * 1等は引き直し不可
         */

        retryBtn.style.display =
            "none";


    /* =========================================
       通常当選の場合
    ========================================= */

    } else {

        useCouponBtn.style.display =
            "block";

    }

}else {


    /* =========================================
       ハズレの場合
    ========================================= */

    if (isLoseResult) {

        useCouponBtn.style.display =
            "none";

        retryBtn.style.display =
            "block";


    /* =========================================
       1等の場合
    ========================================= */

    } else if (rankText.textContent === "1等") {

        useCouponBtn.style.display =
            "block";

        retryBtn.style.display =
            "none";


    /* =========================================
       通常当選の場合
    ========================================= */

    } else {

        useCouponBtn.style.display =
            "block";

        retryBtn.style.display =
            "block";

    }

}
        /* =========================================
           Skipで1等の場合だけ紙吹雪
        ========================================= */

        if (
            !isLoseResult &&
            rankText.textContent === "1等"
        ) {
            createConfetti();
        }

    }
);

/* ==================================================
   もう一度引く
   SNS引き直し
================================================== */

retryBtn.addEventListener(
    "click",
    async function () {

        /* =========================================
           ボタンを一時的に無効化
        ========================================= */

        retryBtn.disabled = true;
        /* =========================================
           SNSへ移動したことがまだない場合
        ========================================= */

        if (!isSnsRetryPending()) {

            setSnsRetryPending();

            window.location.href =
                instagramRetryUrl;

            return;

        }

        try {

            /* =========================================
               device_token取得
            ========================================= */

            const deviceToken =
                getDeviceToken();


            /* =========================================
               SNS引き直しAPI
            ========================================= */

const response =
    await fetch(
        "https://coupon-api.yoshioka-mwork.workers.dev/retry-draw",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                device_token:
                    deviceToken,

                platform:
                    "instagram"

            })
        }
    );


            const data =
                await response.json();


            console.log(
                "SNS引き直しAPI:",
                data
            );


            /* =========================================
               APIエラー
            ========================================= */

            if (!data.success) {

                alert(
                    data.error ||
                    "引き直しできませんでした"
                );

                return;
            }


            /* =========================================
               新しい発券IDを保存
            ========================================= */

            issuedCouponId =
                data.issued_coupon_id;
clearSnsRetryPending();

            /* =========================================
               新しい結果を保存
            ========================================= */

            const result =
                data.coupon;


            isLoseResult =
                data.lose === true;


            /* =========================================
               新しい結果を表示
            ========================================= */

            setCapsuleImage(result);

            setResultCoupon(result);


            /* =========================================
               抽選演出開始
            ========================================= */

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


            /* =========================================
               カプセルアニメーションリセット
            ========================================= */

            resetCapsuleAnimation();


            /* =========================================
               ① ガチャ機1回目
            ========================================= */

            setLotteryTimer(function () {

                gachaMachine.classList.add(
                    "shake-1"
                );

            }, 300);


            /* =========================================
               ② ガチャ機2回目
            ========================================= */

            setLotteryTimer(function () {

                gachaMachine.classList.remove(
                    "shake-1"
                );

                void gachaMachine.offsetWidth;

                gachaMachine.classList.add(
                    "shake-2"
                );

            }, 850);


            /* =========================================
               ③ カプセル排出
            ========================================= */

            setLotteryTimer(function () {

                gachaCapsule.classList.remove(
                    "zoom",
                    "open"
                );

                void gachaCapsule.offsetWidth;

                gachaCapsule.classList.add(
                    "eject"
                );

            }, 1300);


            /* =========================================
               ④ カプセルズーム
            ========================================= */

            setLotteryTimer(function () {

                gachaCapsule.classList.remove(
                    "eject"
                );

                void gachaCapsule.offsetWidth;

                gachaCapsule.classList.add(
                    "zoom"
                );

            }, 2050);


            /* =========================================
               ⑤ カプセル開封
            ========================================= */

            setLotteryTimer(function () {

                openCapsule();

            }, 2800);


            /* =========================================
               ⑥ カプセル中央の光
            ========================================= */

            setLotteryTimer(function () {

                lotteryLight.classList.remove(
                    "flash",
                    "flash-first"
                );

                void lotteryLight.offsetWidth;


                if (
                    result.rank === "1等"
                ) {

                    lotteryLight.classList.add(
                        "flash-first"
                    );

                } else {

                    lotteryLight.classList.add(
                        "flash"
                    );

                }

            }, 2950);


            /* =========================================
               ⑦ ホワイトアウト
            ========================================= */

            setLotteryTimer(function () {

                whiteout.classList.remove(
                    "show"
                );

                void whiteout.offsetWidth;

                whiteout.classList.add(
                    "show"
                );

            }, 3250);


            /* =========================================
               ⑧ 結果画面
            ========================================= */

            setLotteryTimer(function () {

                clearInterval(
                    lotteryTextTimer
                );

                clearTimeout(
                    lotteryTextTimeout
                );


                lotteryText.classList.remove(
                    "is-active",
                    "is-hide"
                );


                lotteryScreen.classList.add(
                    "hidden"
                );


                resultScreen.classList.remove(
                    "hidden"
                );


                /* =========================================
                   結果に応じたボタン表示
                ========================================= */

                if (isLoseResult) {

                    useCouponBtn.style.display =
                        "none";

                    retryBtn.style.display =
                        "none";

                } else {

                    useCouponBtn.style.display =
                        "block";

                    retryBtn.style.display =
                        "none";

                }


                /* =========================================
                   1等なら紙吹雪
                ========================================= */

                if (
                    result.rank === "1等"
                ) {

                    createConfetti();

                }

            }, 3700);


        } catch (error) {

            console.error(
                "SNS引き直しエラー:",
                error
            );

            alert(
                "通信エラーが発生しました"
            );

        } finally {

            retryBtn.disabled = false;

        }

    }
);
/* ==================================================
   初期処理
================================================== */

async function initialize() {

    await loadCampaign();

    await loadCoupons();

}


initialize();

/* ==================================================
   クーポンを使用する
================================================== */

useCouponBtn.addEventListener(
    "click",
    async function () {

        console.log(
            "クーポン使用ボタンが押されました"
        );


        /* =========================================
           発行ID確認
        ========================================= */

        if (!issuedCouponId) {

            alert(
                "クーポン情報がありません"
            );

            return;

        }


        /* =========================================
           通信中だけボタンを無効化
        ========================================= */

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


            console.log(
                "APIレスポンス:",
                response.status
            );


            const data =
                await response.json();


            console.log(
                "APIデータ:",
                data
            );


            /* =========================================
               API側でエラー
            ========================================= */

            if (!data.success) {

                /*
                 * 二重使用の場合もここに入る
                 */

                alert(
                    data.error ||
                    "クーポンを使用できませんでした"
                );


                /*
                 * エラーの場合は再度押せる
                 */

                useCouponBtn.disabled = false;

                return;

            }


            /* =========================================
               使用成功
            ========================================= */

            console.log(
                "クーポン使用成功"
            );


            /* =========================================
               結果画面を使用済み状態に変更
            ========================================= */

            const resultContent =
                document.querySelector(
                    ".result-content"
                );


            /* =========================================
               背景画像を変更
               
               background-result.png
               ↓
               background-result2.png
            ========================================= */

         resultContent.classList.add(
    "is-used"
);


/* =========================================
   「済」ハンコを押す
========================================= */

usedStamp.classList.remove(
    "show"
);


/*
 * アニメーションを一度リセットしてから
 * showを追加
 */

void usedStamp.offsetWidth;

usedStamp.classList.add(
    "show"
);

            /* =========================================
               ボタン表示変更
               
               クーポンを使用する
               ↓
               本日分使用済み
            ========================================= */

            useCouponBtn.textContent =
                "本日分使用済み";


            /* =========================================
               使用済みボタンの色
            ========================================= */

            useCouponBtn.classList.add(
                "is-used"
            );


            /* =========================================
               ボタンを完全に無効化
            ========================================= */

            useCouponBtn.disabled = true;


            /* =========================================
               引き直しボタンを非表示
            ========================================= */

            retryBtn.style.display =
                "none";


            /* =========================================
               使用完了メッセージ
            ========================================= */

            alert(
                "クーポンを使用しました"
            );


        } catch (error) {

            console.error(
                "クーポン使用エラー:",
                error
            );


            alert(
                "通信エラーが発生しました"
            );


            /*
             * 通信エラーの場合は
             * もう一度押せるようにする
             */

            useCouponBtn.disabled = false;

        }

    }
);

/* ==================================================
   SNSから戻ってきたとき
   引き直しボタンを即時表示
================================================== */

function restoreSnsRetryButton() {

    if (!isSnsRetryPending()) {
        return;
    }

    retryBtn.textContent =
        "引き直す";

    retryBtn.disabled =
        false;

    retryBtn.style.display =
        "block";
}


/* =========================================
   SNSから戻ってきたとき
========================================= */

window.addEventListener(
    "pageshow",
    function () {

        restoreSnsRetryButton();

    }
);


document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            restoreSnsRetryButton();

        }

    }
);


window.addEventListener(
    "focus",
    function () {

        restoreSnsRetryButton();

    }
);

/* ==================================================
   初回ページ読み込み
================================================== */

loadInstagramRetryUrl()
    .then(function () {

        if (!isSnsRetryPending()) {
            return;
        }

        startScreen.classList.add(
            "hidden"
        );

        lotteryScreen.classList.add(
            "hidden"
        );

        resultScreen.classList.remove(
            "hidden"
        );

        retryBtn.textContent =
            "引き直す";

        retryBtn.disabled =
            false;

        retryBtn.style.display =
            "block";

    });
