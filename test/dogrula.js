/* ============================================================
   Doğrulama: GERÇEK index.html + config.js + main.js'i jsdom'a
   yükleyip render edilmiş DOM'u kontrol eder.

   ÖNEMLİ: Testler statik HTML'deki placeholder metinlerle
   sahte geçmesin diye, her kontrol config'teki DEĞERİ arar
   (statik HTML'de yazandan farklı olanı).
   ============================================================ */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const DIR = path.resolve(__dirname, "../template");
const html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
const configSrc = fs.readFileSync(path.join(DIR, "assets/config.js"), "utf8");
const mainSrc = fs.readFileSync(path.join(DIR, "assets/main.js"), "utf8");

let gecen = 0, kalan = 0;
function kontrol(ad, sart, detay) {
  if (sart) { gecen++; console.log("  ✓ " + ad); }
  else { kalan++; console.log("  ✗ " + ad + (detay ? "  -> " + detay : "")); }
}

(async () => {
  const hatalar = [];
  const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://ornek.test/" });
  const { window } = dom;
  window.console.error = (...a) => hatalar.push("console.error: " + a.join(" "));

  // DOM tamamen ayrıştıktan SONRA scriptleri çalıştır (tarayıcı davranışı)
  if (window.document.readyState !== "complete") {
    await new Promise((r) => window.addEventListener("load", r));
  }
  console.log("(document.readyState = " + window.document.readyState + ")");

  const acilanlar = [];
  window.open = (url) => { acilanlar.push(url); return null; };

  // GERÇEK dosyaları çalıştır — hata olursa burada patlar
  window.eval(configSrc);
  try {
    window.eval(mainSrc);
  } catch (e) {
    console.log("\n✗✗ main.js ÇALIŞIRKEN HATA VERDİ: " + e.message + "\n" + e.stack);
    process.exit(1);
  }

  const C = window.SITE;
  const d = window.document;
  const q = (s) => d.querySelector(s);
  const n = (s) => d.querySelectorAll(s).length;
  const txt = (s) => (q(s) ? q(s).textContent.trim() : "(yok)");

  console.log("\n=== SAYFA RENDER ===");
  // Statik HTML "Butik Otel", config "Butik Otel & Tekne Turları" -> farkı ölçüyoruz
  kontrol("Logo config'ten dolduruldu (statik değil)",
    txt("#logo").includes(C.marka.tur), txt("#logo"));
  kontrol("Footer logosu dolduruldu", txt("#logo-footer").includes(C.marka.tur), txt("#logo-footer"));
  kontrol("document.title güncellendi", d.title === C.marka.ad + " — " + C.marka.tur, d.title);
  kontrol("Hero başlığı config'ten geldi",
    txt("#hero-baslik") === C.marka.slogan, txt("#hero-baslik"));
  kontrol("Hero arkaplanı ayarlandı",
    q("#hero-arka").style.backgroundImage.includes("hero.jpg"),
    q("#hero-arka").style.backgroundImage);
  kontrol("Renk token'ları uygulandı",
    window.getComputedStyle(d.documentElement).getPropertyValue("--toprak").trim() === C.renkler.toprak,
    window.getComputedStyle(d.documentElement).getPropertyValue("--toprak"));

  console.log("\n=== BÖLÜMLER ===");
  kontrol(`${C.vaatler.length} vaat çizildi`, n("#vaatler .vaat") === C.vaatler.length, "bulunan: " + n("#vaatler .vaat"));
  kontrol(`${C.hakkinda.paragraflar.length} hakkında paragrafı`,
    n("#hakkinda-metin p") === C.hakkinda.paragraflar.length, "bulunan: " + n("#hakkinda-metin p"));
  kontrol("Hakkında başlığı config'ten", txt("#hakkinda-baslik") === C.hakkinda.baslik, txt("#hakkinda-baslik"));
  kontrol(`${C.hakkinda.rozetler.length} rozet`, n("#hakkinda-rozetler .rozet") === C.hakkinda.rozetler.length, "bulunan: " + n("#hakkinda-rozetler .rozet"));
  kontrol(`${C.urunler.length} ürün kartı`, n("#kartlar .kart") === C.urunler.length, "bulunan: " + n("#kartlar .kart"));
  const kartlar = [...d.querySelectorAll("#kartlar .kart")];
  kontrol("Her kartta fiyat var",
    kartlar.every((k, i) => k.querySelector(".tutar").textContent === C.urunler[i].fiyat),
    kartlar.map(k => k.querySelector(".tutar") && k.querySelector(".tutar").textContent).join(", "));
  kontrol("Kart özellik listeleri dolu",
    kartlar.every((k, i) => k.querySelectorAll(".kart-ozellikler li").length === C.urunler[i].ozellikler.length));
  kontrol("Ürün seçim kutusu dolduruldu",
    q("#f-urun").options.length === C.urunler.length + 1, "adet: " + q("#f-urun").options.length);
  kontrol(`${C.direktAvantaj.maddeler.length} direkt avantaj maddesi`,
    n("#direkt-liste li") === C.direktAvantaj.maddeler.length, "bulunan: " + n("#direkt-liste li"));
  kontrol("Direkt avantaj metni config'ten", txt("#direkt-aciklama") === C.direktAvantaj.aciklama);
  kontrol(`${C.galeri.length} galeri görseli`, n("#galeri button") === C.galeri.length, "bulunan: " + n("#galeri button"));
  kontrol(`${C.yorumlar.length} yorum`, n("#yorumlar-kutu .yorum") === C.yorumlar.length, "bulunan: " + n("#yorumlar-kutu .yorum"));
  kontrol("Yorum yıldız sayısı doğru",
    d.querySelector("#yorumlar-kutu .yildiz").textContent.length === C.yorumlar[0].puan,
    d.querySelector("#yorumlar-kutu .yildiz").textContent);
  kontrol(`${C.sss.length} SSS`, n("#sss-kutu .sss-oge") === C.sss.length, "bulunan: " + n("#sss-kutu .sss-oge"));
  kontrol("Harita iframe eklendi", !!q("#harita iframe") && q("#harita iframe").src.includes("google.com/maps"),
    q("#harita").innerHTML.slice(0, 80));
  kontrol("Adres yazıldı", txt("#iletisim-adres") === C.marka.adres, txt("#iletisim-adres"));

  console.log("\n=== SSS AÇILIP KAPANIYOR MU ===");
  const ilkSoru = q("#sss-kutu .sss-soru");
  ilkSoru.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  kontrol("Tıklayınca açıldı", q("#sss-kutu .sss-oge").classList.contains("acik"));
  kontrol("aria-expanded=true oldu", ilkSoru.getAttribute("aria-expanded") === "true");
  ilkSoru.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  kontrol("Tekrar tıklayınca kapandı", !q("#sss-kutu .sss-oge").classList.contains("acik"));

  console.log("\n=== SEO ===");
  const ld = [...d.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent));
  const lodge = ld.find(x => x["@type"] === "LodgingBusiness");
  kontrol("LocalBusiness schema var", !!lodge);
  kontrol("Schema telefonu doğru", lodge && lodge.telephone === C.marka.telefon);
  kontrol("Schema konumu doğru", lodge && lodge.geo.latitude === C.marka.konum.enlem);
  const faq = ld.find(x => x["@type"] === "FAQPage");
  kontrol("FAQPage schema var", !!faq);
  kontrol("FAQ schema soru sayısı eşleşiyor", faq && faq.mainEntity.length === C.sss.length);
  kontrol("og:title meta eklendi", !!d.querySelector('meta[property="og:title"]'));

  console.log("\n=== WHATSAPP BAĞLANTILARI ===");
  const waLinkler = [...d.querySelectorAll('a[href*="wa.me"]')];
  kontrol("wa.me linkleri var", waLinkler.length >= 6, "adet: " + waLinkler.length);
  kontrol("Numara doğru formatta",
    waLinkler.every(a => a.href.includes("wa.me/" + C.marka.whatsapp)),
    waLinkler[0] && waLinkler[0].href);
  const telLinkler = [...d.querySelectorAll("a.js-tel")];
  kontrol("Telefon linkleri tel: oldu",
    telLinkler.every(a => a.getAttribute("href") === "tel:+905320000000"),
    telLinkler.map(a => a.getAttribute("href")).join(", "));
  kontrol("Telefon metni görünüyor", telLinkler.every(a => a.textContent === C.marka.telefon));

  console.log("\n=== FORM -> WHATSAPP (asıl para akışı) ===");
  q("#f-ad").value = "Tolga Yılmaz";
  q("#f-tel").value = "0532 111 22 33";
  q("#f-tarih").value = "2026-08-14";
  q("#f-tarih-bit").value = "2026-08-17";
  q("#f-kisi").value = "2";
  q("#f-urun").selectedIndex = 1;
  q("#f-not").value = "Erken giriş mümkün mü?";
  q("#rezerv-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  kontrol("Form gönderimi WhatsApp açtı", acilanlar.length === 1, "açılan: " + acilanlar.length);
  if (acilanlar.length) {
    const mesaj = decodeURIComponent(acilanlar[0].split("?text=")[1] || "");
    kontrol("Mesajda isim var", mesaj.includes("Tolga Yılmaz"));
    kontrol("Mesajda telefon var", mesaj.includes("0532 111 22 33"));
    kontrol("Mesajda giriş tarihi var", mesaj.includes("2026-08-14"));
    kontrol("Mesajda çıkış tarihi var", mesaj.includes("2026-08-17"));
    kontrol("Mesajda kişi sayısı var", mesaj.includes("Kişi sayısı: 2"));
    kontrol("Mesajda ürün seçimi var", mesaj.includes(C.urunler[0].baslik),
      (mesaj.split("\n").find(l => l.includes("İlgilendiğim")) || "satır yok"));
    kontrol("Mesajda not var", mesaj.includes("Erken giriş mümkün mü?"));
    console.log("\n  --- Üretilen WhatsApp mesajı ---");
    mesaj.split("\n").forEach(l => console.log("  | " + l));
    console.log("  --------------------------------");
  }
  kontrol("Form gönderim sonrası temizlendi", q("#f-ad").value === "", "ad hâlâ: " + q("#f-ad").value);
  kontrol("Durum mesajı gösterildi", txt("#form-durum").includes("WhatsApp açılıyor"), txt("#form-durum"));

  console.log("\n=== DOĞRULAMA (boş form reddedilmeli) ===");
  acilanlar.length = 0;
  q("#rezerv-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  kontrol("Boş form WhatsApp AÇMADI", acilanlar.length === 0, "yanlışlıkla açıldı: " + acilanlar[0]);
  kontrol("Uyarı mesajı çıktı", txt("#form-durum").includes("Adınızı yazın"), txt("#form-durum"));
  acilanlar.length = 0;
  q("#f-ad").value = "Deniz"; q("#f-tel").value = "123";
  q("#rezerv-form").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  kontrol("Kısa telefon reddedildi", acilanlar.length === 0 && txt("#form-durum").includes("telefon"), txt("#form-durum"));

  console.log("\n=== GÜVENLİK (XSS) ===");
  window.eval(configSrc);
  window.eval("window.SITE.marka.ad = '<img src=x onerror=alert(1)>Kötü';");
  window.eval("window.SITE.urunler[0].baslik = '<script>alert(2)</'+'script>';");
  q("#logo").innerHTML = "ESKI";
  window.eval(mainSrc); // motor yeniden çizer
  kontrol("Marka adındaki HTML kaçışlandı", !q("#logo").innerHTML.includes("<img"), q("#logo").innerHTML);
  kontrol("Kaçışlanmış metin okunuyor", txt("#logo").includes("Kötü"), txt("#logo"));
  // innerHTML dizisinde "<script" geçmesi yanıltıcı: attribute değeri içinde
  // < ve > escape edilmez (HTML serialization spec). Doğru kontrol: gerçek
  // bir <script> ELEMANI oluştu mu, ve başlık metin olarak mı duruyor?
  const ilkKartH3 = q("#kartlar .kart h3");
  kontrol("Ürün başlığında script ELEMANI oluşmadı",
    q("#kartlar").querySelector("script") === null,
    "script elemanı bulundu: " + (q("#kartlar").querySelector("script") || {}).outerHTML);
  kontrol("Enjekte başlık metin olarak render edildi",
    ilkKartH3 && ilkKartH3.textContent === "<script>alert(2)</script>",
    ilkKartH3 && JSON.stringify(ilkKartH3.textContent));
  // Not: şablondaki her <img> bilerek onerror= taşır (kırık görsel için yer
  // tutucu). O yüzden enjeksiyon kontrolü "alert içeren onerror" üzerinden.
  const tehlikeli = [...d.querySelectorAll("#kartlar *")].filter(el =>
    /alert/i.test(el.getAttribute("onerror") || "") || el.tagName === "SCRIPT" || el.tagName === "IFRAME");
  kontrol("Kartlarda eleman enjeksiyonu yok", tehlikeli.length === 0,
    "bulunan: " + tehlikeli.map(e => e.outerHTML.slice(0, 80)).join(" | "));

  console.log("\n=== KONSOL HATALARI ===");
  kontrol("console.error çağrılmadı", hatalar.length === 0, hatalar.join(" | "));

  console.log("\n================================");
  console.log(`SONUÇ: ${gecen} geçti, ${kalan} kaldı`);
  console.log("================================\n");
  process.exit(kalan === 0 ? 0 : 1);
})();
