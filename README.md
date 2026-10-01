# Çanakkale Direkt Rezervasyon — Ürünleştirilmiş Hizmet Kiti

Turizm işletmelerine **komisyon ödemeden direkt rezervasyon** satan bir iş.
İki parça: satılabilir bir şablon + onu satmanın yolu.

---

## Tez

Booking.com bağımsız tesislerden **%15-18** (görünürlük programlarıyla **%18-25**)
komisyon alıyor ([kaynak](https://bookingwhizz.com/en/blog/ota-commission-true-cost)).
Küçük bir turizm işletmesi sezonda yüz binlerce lirayı oraya bırakıyor.

Bu kit o parayı işletmeye geri veriyor — ve sen de bundan pay alıyorsun.

**SaaS değil, hizmet.** Ürün 3-6 ay ister; hizmet bu ay para getirir.

---

## Klasörler

| Yol | Ne |
|---|---|
| [`sales-kit/SATIS-KITI.md`](sales-kit/SATIS-KITI.md) | 💰 **Önce bunu oku.** Hedef listesi, konuşma metni, itiraz cevapları, fiyatlandırma, 30 günlük plan |
| [`template/`](template/README.md) | 🛠️ Satılabilir şablon — WhatsApp'a rezervasyon düşüren, backend gerektirmeyen tek sayfa sitesi |
| [`template/assets/config.js`](template/assets/config.js) | ✏️ Yeni müşteri için düzenlenen tek dosya |
| [`test/`](test/dogrula.js) | ✅ 54 kontrollü doğrulama testi |

---

## Hızlı başlangıç

```bash
# 1. Şablonu yerelde çalıştır
cd template && python3 -m http.server 8080
#    → http://localhost:8080

# 2. Testleri çalıştır
cd ../test && npm install && npm test
```

---

## Yeni müşteri (20-40 dakika)

```bash
cp -r template musteri-ada-otel
cd musteri-ada-otel
# assets/config.js  → marka, WhatsApp, renkler, ürünler, görseller
```

Başka hiçbir dosyaya dokunman gerekmez. Detay: [`template/README.md`](template/README.md).

---

## Teknik

- **Build adımı yok** — saf HTML/CSS/JS. Sunucuya sürükle-bırak, çalışır.
- **Backend yok** — rezervasyon formu doğrudan WhatsApp derin bağlantısı üretir.
- **SEO hazır** — `LodgingBusiness` + `FAQPage` JSON-LD ve Open Graph otomatik enjekte edilir.
- **XSS'e karşı kaçışlama** — tüm kullanıcı verisi `temizle()` üzerinden geçer.
- **Görsel yoksa bozulmaz** — eksik dosya renkli yer tutucuya düşer.

---

## 30 günlük hedef

4 kurulum + 4 bakım sözleşmesi ≈ **₺96.000 ilk ay**.
Detaylı kırılım: [`sales-kit/SATIS-KITI.md` §8](sales-kit/SATIS-KITI.md).

---

## Durum

- [x] Şablon (responsive, WhatsApp akışı, SEO, galeri, SSS)
- [x] 54 kontrollü otomatik test — hepsi geçiyor
- [x] Satış kiti
- [ ] **İlk müşteri** ← sıradaki adım, ve tek önemli adım
