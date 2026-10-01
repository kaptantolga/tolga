/* ============================================================
   MOTOR — Bu dosyaya dokunma. config.js'teki veriyi sayfaya çizer.
   ============================================================ */
(function () {
  "use strict";

  var C = window.SITE;
  if (!C) { console.error("config.js yüklenemedi"); return; }

  /* ---------- Yardımcılar ---------- */
  function $(sel, kok) { return (kok || document).querySelector(sel); }
  function $$(sel, kok) { return Array.prototype.slice.call((kok || document).querySelectorAll(sel)); }
  function yaz(el, metin) { if (el) el.textContent = metin; }

  // Kullanıcı girdisini güvenle metne çevir (innerHTML enjeksiyonunu engelle)
  function temizle(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Görsel yoksa yerine zarif bir yer tutucu koy
  function gorselHtml(yol, alternatif, sinif) {
    return '<img src="' + temizle(yol) + '" alt="' + temizle(alternatif) +
      '" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.style.background=' +
      '\'linear-gradient(135deg,var(--deniz-acik),var(--deniz))\';this.parentNode.setAttribute(\'data-yok\',\'1\')"' +
      (sinif ? ' class="' + sinif + '"' : '') + '>';
  }

  function waLink(mesaj) {
    return "https://wa.me/" + encodeURIComponent(C.marka.whatsapp) +
      "?text=" + encodeURIComponent(mesaj);
  }

  /* ---------- 1. Renkleri uygula ---------- */
  function renkler() {
    var r = C.renkler || {};
    var kok = document.documentElement.style;
    if (r.deniz) kok.setProperty("--deniz", r.deniz);
    if (r.denizAcik) kok.setProperty("--deniz-acik", r.denizAcik);
    if (r.toprak) kok.setProperty("--toprak", r.toprak);
    if (r.kum) kok.setProperty("--kum", r.kum);
    if (r.yazi) kok.setProperty("--yazi", r.yazi);
  }

  /* ---------- 2. Üst menü + logo ---------- */
  function menu() {
    var logoIc = temizle(C.marka.ad) +
      (C.marka.tur ? "<small>" + temizle(C.marka.tur) + "</small>" : "");
    $$("#logo, #logo-footer").forEach(function (el) { el.innerHTML = logoIc; });
    document.title = C.marka.ad + " — " + (C.marka.tur || "Çanakkale");

    var ham = $("#hamburger"), nav = $("#nav");
    if (ham && nav) {
      ham.addEventListener("click", function () {
        nav.classList.toggle("acik");
        ham.setAttribute("aria-expanded", nav.classList.contains("acik") ? "true" : "false");
      });
      $$("#nav a").forEach(function (a) {
        a.addEventListener("click", function () { nav.classList.remove("acik"); });
      });
    }

    // Kaydırınca gölge
    var header = $("header.site");
    function kaydirmaKontrol() {
      if (header) header.classList.toggle("kaydirildi", window.scrollY > 12);
    }
    window.addEventListener("scroll", kaydirmaKontrol, { passive: true });
    kaydirmaKontrol();
  }

  /* ---------- 3. Hero ---------- */
  function hero() {
    yaz($("#hero-ust"), C.marka.tur);
    yaz($("#hero-baslik"), C.marka.slogan);
    var arka = $("#hero-arka");
    if (arka) arka.style.backgroundImage = 'url("' + C.heroGorsel + '")';

    $$(".js-wa").forEach(function (a) {
      a.href = waLink("Merhaba, " + C.marka.ad + " için bilgi almak istiyorum.");
    });
    var telefonlar = $$(".js-tel");
    telefonlar.forEach(function (a) {
      a.href = "tel:" + C.marka.telefon.replace(/[^\d+]/g, "");
      yaz(a, C.marka.telefon);
    });
  }

  /* ---------- 4. Vaatler ---------- */
  function vaatler() {
    var kutu = $("#vaatler");
    if (!kutu || !C.vaatler) return;
    kutu.innerHTML = C.vaatler.map(function (v) {
      return '<div class="vaat">' +
        '<span class="ikon">' + temizle(v.ikon) + "</span>" +
        "<strong>" + temizle(v.baslik) + "</strong>" +
        "<span>" + temizle(v.aciklama) + "</span></div>";
    }).join("");
  }

  /* ---------- 5. Hakkında ---------- */
  function hakkinda() {
    var h = C.hakkinda;
    if (!h) return;
    yaz($("#hakkinda-baslik"), h.baslik);
    var pKutu = $("#hakkinda-metin");
    if (pKutu) {
      pKutu.innerHTML = (h.paragraflar || []).map(function (p) {
        return "<p>" + temizle(p) + "</p>";
      }).join("");
    }
    var g = $("#hakkinda-gorsel");
    if (g && h.gorsel) g.innerHTML = gorselHtml(h.gorsel, h.baslik);
    var r = $("#hakkinda-rozetler");
    if (r && h.rozetler) {
      r.innerHTML = h.rozetler.map(function (x) {
        return '<span class="rozet">' + temizle(x) + "</span>";
      }).join("");
    }
  }

  /* ---------- 6. Ürün kartları ---------- */
  function urunler() {
    var kutu = $("#kartlar");
    if (!kutu || !C.urunler) return;
    kutu.innerHTML = C.urunler.map(function (u, i) {
      var ozellikler = (u.ozellikler || []).map(function (o) {
        return "<li>" + temizle(o) + "</li>";
      }).join("");
      var mesaj = "Merhaba, \"" + u.baslik + "\" için müsaitlik ve fiyat bilgisi almak istiyorum.";
      return '<article class="kart">' +
        '<div class="kart-gorsel">' +
          gorselHtml(u.gorsel, u.baslik) +
          (u.etiket ? '<span class="kart-etiket">' + temizle(u.etiket) + "</span>" : "") +
        "</div>" +
        '<div class="kart-ic">' +
          "<h3>" + temizle(u.baslik) + "</h3>" +
          '<div class="kart-fiyat"><span class="tutar">' + temizle(u.fiyat) +
            '</span><span class="birim">' + temizle(u.fiyatBirimi) + "</span></div>" +
          '<p class="kart-aciklama">' + temizle(u.aciklama) + "</p>" +
          '<ul class="kart-ozellikler">' + ozellikler + "</ul>" +
          '<a class="btn btn-hayalet" target="_blank" rel="noopener" href="' +
            waLink(mesaj) + '">Müsaitlik sor</a>' +
        "</div></article>";
    }).join("");

    // Seçim listesini de doldur
    var secim = $("#f-urun");
    if (secim) {
      secim.innerHTML = '<option value="">Seçiniz (opsiyonel)</option>' +
        C.urunler.map(function (u) {
          return '<option value="' + temizle(u.baslik) + '">' +
            temizle(u.baslik) + " — " + temizle(u.fiyat) + temizle(u.fiyatBirimi) + "</option>";
        }).join("");
    }
  }

  /* ---------- 7. Direkt rezervasyon avantajı ---------- */
  function direktAvantaj() {
    var d = C.direktAvantaj;
    if (!d) return;
    yaz($("#direkt-baslik"), d.baslik);
    yaz($("#direkt-aciklama"), d.aciklama);
    var l = $("#direkt-liste");
    if (l) {
      l.innerHTML = (d.maddeler || []).map(function (m) {
        return "<li>" + temizle(m) + "</li>";
      }).join("");
    }
  }

  /* ---------- 8. Galeri + lightbox ---------- */
  function galeri() {
    var kutu = $("#galeri");
    if (!kutu || !C.galeri || !C.galeri.length) {
      var bolum = $("#bolum-galeri");
      if (bolum) bolum.style.display = "none";
      return;
    }
    kutu.innerHTML = C.galeri.map(function (g, i) {
      var sinif = i === 0 ? "genis uzun" : (i === 3 ? "genis" : "");
      return '<button type="button" class="' + sinif + '" data-i="' + i + '" aria-label="Görseli büyüt">' +
        gorselHtml(g.yol, g.baslik || ("Galeri " + (i + 1))) + "</button>";
    }).join("");

    var lb = $("#lightbox"), lbImg = $("#lightbox-img"), lbKapat = $("#lightbox-kapat");
    kutu.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-i]");
      if (!btn) return;
      var g = C.galeri[Number(btn.getAttribute("data-i"))];
      lbImg.src = g.yol;
      lbImg.alt = g.baslik || "";
      lb.classList.add("acik");
      document.body.style.overflow = "hidden";
    });
    function kapat() {
      lb.classList.remove("acik");
      document.body.style.overflow = "";
    }
    if (lbKapat) lbKapat.addEventListener("click", kapat);
    lb.addEventListener("click", function (e) { if (e.target === lb) kapat(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") kapat(); });
  }

  /* ---------- 9. Yorumlar ---------- */
  function yorumlar() {
    var kutu = $("#yorumlar-kutu");
    if (!kutu || !C.yorumlar) return;
    kutu.innerHTML = C.yorumlar.map(function (y) {
      var basHarf = (y.isim || "?").trim().charAt(0).toUpperCase();
      var yildiz = "★".repeat(Math.min(5, Math.max(0, y.puan || 5)));
      return '<figure class="yorum">' +
        '<div class="yildiz">' + yildiz + "</div>" +
        "<p>" + temizle(y.metin) + "</p>" +
        '<figcaption class="yorum-kim">' +
          '<span class="yorum-ava">' + temizle(basHarf) + "</span>" +
          "<span><strong>" + temizle(y.isim) + "</strong>" +
          "<span>" + temizle(y.tarih) + " · " + temizle(y.kaynak) + "</span></span>" +
        "</figcaption></figure>";
    }).join("");
  }

  /* ---------- 10. SSS ---------- */
  function sss() {
    var kutu = $("#sss-kutu");
    if (!kutu || !C.sss) return;
    kutu.innerHTML = C.sss.map(function (o, i) {
      return '<div class="sss-oge">' +
        '<button type="button" class="sss-soru" aria-expanded="false">' + temizle(o.s) + "</button>" +
        '<div class="sss-cevap"><p>' + temizle(o.c) + "</p></div></div>";
    }).join("");

    kutu.addEventListener("click", function (e) {
      var btn = e.target.closest(".sss-soru");
      if (!btn) return;
      var oge = btn.parentNode;
      var cevap = $(".sss-cevap", oge);
      var acik = oge.classList.toggle("acik");
      btn.setAttribute("aria-expanded", acik ? "true" : "false");
      cevap.style.maxHeight = acik ? cevap.scrollHeight + "px" : "0px";
    });

    // SEO: FAQ schema
    var veri = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": C.sss.map(function (o) {
        return {
          "@type": "Question",
          "name": o.s,
          "acceptedAnswer": { "@type": "Answer", "text": o.c }
        };
      })
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(veri);
    document.head.appendChild(s);
  }

  /* ---------- 11. Rezervasyon formu -> WhatsApp ---------- */
  function rezervasyon() {
    var r = C.rezervasyon || {};
    yaz($("#rezerv-baslik"), r.baslik);
    yaz($("#rezerv-aciklama"), r.aciklama);

    // İletişim satırları
    yaz($("#iletisim-adres"), C.marka.adres);
    yaz($("#iletisim-email"), C.marka.email);
    var emailLink = $("#iletisim-email");
    if (emailLink) emailLink.href = "mailto:" + C.marka.email;

    var harita = $("#harita");
    if (harita && C.marka.haritaEmbed) {
      harita.innerHTML = '<iframe src="' + temizle(C.marka.haritaEmbed) +
        '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
        'title="' + temizle(C.marka.ad) + ' konumu"></iframe>';
    }

    // Bugünü minimum tarih yap
    var tarih = $("#f-tarih");
    if (tarih) tarih.min = new Date().toISOString().split("T")[0];

    var form = $("#rezerv-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ad = $("#f-ad").value.trim();
      var tel = $("#f-tel").value.trim();

      if (!ad) { uyari($("#f-ad"), "Adınızı yazın."); return; }
      if (tel.replace(/\D/g, "").length < 10) { uyari($("#f-tel"), "Geçerli bir telefon yazın."); return; }

      var tarihBas = $("#f-tarih").value;
      var tarihBit = $("#f-tarih-bit").value;
      var kisi = $("#f-kisi").value;
      var urun = $("#f-urun").value;
      var not = $("#f-not").value.trim();

      var satirlar = [
        "Merhaba, rezervasyon talebim var.",
        "",
        "• Ad Soyad: " + ad,
        "• Telefon: " + tel
      ];
      if (tarihBas) satirlar.push("• Giriş: " + tarihBas);
      if (tarihBit) satirlar.push("• Çıkış: " + tarihBit);
      if (kisi) satirlar.push("• Kişi sayısı: " + kisi);
      if (urun) satirlar.push("• İlgilendiğim: " + urun);
      if (not) satirlar.push("• Not: " + not);
      satirlar.push("", "(" + C.marka.ad + " web sitesinden gönderildi)");

      window.open(waLink(satirlar.join("\n")), "_blank", "noopener");

      var durum = $("#form-durum");
      if (durum) {
        durum.textContent = "WhatsApp açılıyor… Açılmazsa bize " + C.marka.telefon + " numarasından ulaşın.";
        durum.style.color = "var(--toprak)";
      }
      form.reset();
    });

    function uyari(alan, mesaj) {
      alan.focus();
      alan.style.borderColor = "var(--toprak)";
      var durum = $("#form-durum");
      if (durum) { durum.textContent = mesaj; durum.style.color = "var(--toprak)"; }
      setTimeout(function () { alan.style.borderColor = ""; }, 2500);
    }
  }

  /* ---------- 12. WhatsApp yüzen buton + mobil CTA ---------- */
  function yuzen() {
    var y = $("#wa-yuzen");
    if (y) y.href = waLink("Merhaba, " + C.marka.ad + " hakkında bilgi almak istiyorum.");
  }

  /* ---------- 13. Footer ---------- */
  function footer() {
    yaz($("#footer-adres"), C.marka.adres);
    yaz($("#footer-yil"), new Date().getFullYear());
    yaz($("#footer-marka"), C.marka.ad);
    var ig = $("#footer-ig");
    if (ig) {
      ig.href = "https://instagram.com/" + C.marka.instagram;
      yaz(ig, "@" + C.marka.instagram);
    }
  }

  /* ---------- 14. SEO / LocalBusiness schema ---------- */
  function seo() {
    var m = C.marka;
    var veri = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": m.ad,
      "description": m.slogan,
      "telephone": m.telefon,
      "email": m.email,
      "url": window.location.href,
      "address": { "@type": "PostalAddress", "streetAddress": m.adres, "addressCountry": "TR" },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": m.konum.enlem,
        "longitude": m.konum.boylam
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "212" }
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(veri);
    document.head.appendChild(s);

    // Open Graph
    [["og:title", m.ad + " — " + m.tur], ["og:description", m.slogan],
     ["og:type", "website"], ["og:locale", "tr_TR"]].forEach(function (c) {
      var t = document.createElement("meta");
      t.setAttribute("property", c[0]);
      t.setAttribute("content", c[1]);
      document.head.appendChild(t);
    });
  }

  /* ---------- Çalıştır ---------- */
  function baslat() {
    renkler(); menu(); hero(); vaatler(); hakkinda(); urunler();
    direktAvantaj(); galeri(); yorumlar(); sss(); rezervasyon();
    yuzen(); footer(); seo();
    document.body.classList.add("hazir");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", baslat);
  } else {
    baslat();
  }
})();
