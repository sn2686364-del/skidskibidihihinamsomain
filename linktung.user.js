
(function () {
  const SEL_CAPTCHA_WRAPPER = "#captcha-html-wrapper";
  const SEL_ADVERTISE_WRAPPER = "#advertise-html-wrapper";
  const SEL_TIMEOUT_ALERT = ".time-out-alert";
  const SEL_MODAL_REPORT = "#modal-report";
  const MESSAGE_CLEANER_DONE = "[Cleaner] Đã xóa xong!";
  const SITE_TITLE = ""; 
  const BR_HTML = "<br><br>";
  const FORM_ID = "main-form";
  const FORM_METHOD = "post";
  const RECAPTCHA_WRAPPER_ID = "recaptcha";
  const RECAPTCHA_CLASS = "g-recaptcha";
  const RECAPTCHA_CALLBACK = "recaptcha_callback";
  const FIELD_ALIAS = "alias";
  const CONTINUE_TEXT = "Click vào đây để tiếp tục";
  const CONTINUE_BTN_CLASS = "btn btn-success disabled get-link";
  const DISCORD_TEXT = "Click vào đây để vô Discord";
  const DISCORD_BTN_CLASS = "btn btn-success";
  const DISCORD_URL = "https://discord.gg/S3XQRDfnPR";
  function getDocument() { return document; }
  function getSetTimeout() { return setTimeout; }
  function getGrecaptcha() { return typeof grecaptcha !== "undefined" ? grecaptcha : undefined; }
  function getRecaptchaKey() { return typeof recaptcha_key !== "undefined" ? recaptcha_key : undefined; }
  function initCaptchaUI() {
    const $captchaWrapper = $(SEL_CAPTCHA_WRAPPER);
    const aliasValue = $captchaWrapper.data(FIELD_ALIAS) || "";
    const $title = $('<h4>').html(SITE_TITLE);
    const $marginDiv = $('<div>', { style: "margin-bottom:10px" });
    const $form = $('<form>', { id: FORM_ID, method: FORM_METHOD });
    const $recaptchaHolder = $('<div>', {
      id: RECAPTCHA_WRAPPER_ID,
      class: RECAPTCHA_CLASS,
      "data-callback": RECAPTCHA_CALLBACK
    });
    const $hiddenAlias = $('<input>', {
      type: "hidden",
      id: FIELD_ALIAS,
      name: FIELD_ALIAS
    }).val(aliasValue);
    const $group = $('<div>', { class: "form-group" });
    const $continueBtn = $('<a>', {
      class: CONTINUE_BTN_CLASS,
      target: "_blank",
      rel: "noopener noreferrer nofollow",
      href: "#" 
    }).html(CONTINUE_TEXT);
    const $discordBtn = $('<a>', {
      class: DISCORD_BTN_CLASS,
      href: DISCORD_URL,
      target: "_blank",
      rel: "noopener noreferrer nofollow"
    }).html(DISCORD_TEXT);
    $group.append($continueBtn);
    $group.append(BR_HTML);
    $group.append($discordBtn);
    $form.append($recaptchaHolder, $hiddenAlias, $group);
    $marginDiv.append($form);
    $captchaWrapper.append($title, $marginDiv);
    $captchaWrapper.find('.loader').remove();
    $(SEL_ADVERTISE_WRAPPER).remove();
    console.log(MESSAGE_CLEANER_DONE);
    const waitAndRender = () => {
      if (typeof grecaptcha !== "undefined" && typeof recaptcha_key !== "undefined") {
        const widgetId = grecaptcha.render(RECAPTCHA_WRAPPER_ID, {
          sitekey: recaptcha_key
        });
        $recaptchaHolder.data('recaptcha-id', widgetId);
      } else {
        getSetTimeout()(waitAndRender, 1000);
      }
    };
    waitAndRender();
  }
  (function startupCheckAndRun() {
    const $e = $("#captcha-html-wrapper");
    const $a = $("#advertise-html-wrapper");
    const $t = $(".time-out-alert");
    const $r = $("#modal-report");
    if ($e.length || $a.length || $t.length || $r.length) {
      $e.empty();
      $a.empty();
      $t.remove(); 
      $r.empty();
      console.log(MESSAGE_CLEANER_DONE);
    }
  })();
  initCaptchaUI();
})();
