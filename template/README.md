# Direkt Rezervasyon Şablonu

Turizm işletmeleri (otel, pansiyon, tekne turu, dalış, restoran) için
**backend gerektirmeyen**, WhatsApp'a rezervasyon düşüren tek sayfa sitesi.

Yeni müşteri = klasörü kopyala + `assets/config.js` düzenle. **20-40 dakika.**

---

## Neden böyle kuruldu

| Karar | Sebep |
|---|---|
| Build adımı yok (saf HTML/CSS/JS) | `npm install` yok, bozulacak bir şey yok. Sunucuya sürükle-bırak, çalışır. |
| Tüm içerik `config.js`'te | Müşteri değiştirmek tek dosya. HTML'e hiç dokunmuyorsun. |
| Rezervasyon → WhatsApp | Backend yok, veritabanı yok, sunucu maliyeti yok. Türk işletmesi zaten WhatsApp'ta yaşıyor. |
| CSS custom properties | 5 renk değişkeni değiştir → tüm site yeni marka. |
| JSON-LD schema otomatik | `LodgingBusiness` + `FAQPage`. Google Haritalar'da çıkmanın ilk adımı. |

---

## Dosya yapısı

```
template/
├── index.html          Yapı. Nadiren dokunursun.
└── assets/
    ├── config.js       ← TÜM MÜŞTERİ VERİSİ BURADA
    ├── style.css       Tasarım. Dokunma.
    ├── main.js         Motor. Dokunma.
    └── *.jpg           Görseller
```

---

## Yeni müşteri — adım adım

### 1. Kopyala

```bash
cp -r template musteri-ada-otel
cd musteri-ada-otel
```

### 2. `assets/config.js` düzenle

Doldurulacak alanlar, sırayla:

| Alan | Ne yazacaksın |
|---|---|
| `marka.ad`, `marka.tur`, `marka.slogan` | İşletme kimliği |
| `marka.whatsapp` | ⚠️ **`+`, boşluk, tire YOK.** Türkiye: `905321234567` |
| `marka.telefon` | Görünen numara: `+90 532 123 45 67` |
| `marka.konum` | Google Haritalar'dan enlem/boylam |
| `marka.haritaEmbed` | Haritalar → Paylaş → "Harita yerleştir" → `src="..."` içindeki URL |
| `renkler` | 5 renk. [coolors.co](https://coolors.co)'dan işletmenin fotoğrafından palet çıkar |
| `heroGorsel`, `galeri` | `assets/` içine attığın dosya adları |
| `urunler` | Odalar / turlar / menü — ne satıyorsa |
| `yorumlar` | ⚠️ **Gerçek yorumlar.** Google'dan kopyala, uydurma. |

### 3. Görselleri değiştir

Müşterinin Instagram'ından veya kendi çektiğin fotoğrafları `assets/` içine at.

- **Hero:** 2000×1200, yatay, en iyi kare
- **Galeri:** 1200×900
- Sıkıştır: [squoosh.app](https://squoosh.app) → WebP, kalite 75. Sayfa hızı = Google sıralaması.

> Bir görsel eksikse sayfa **bozulmaz** — yerine renkli bir alan çıkar.

### 4. `index.html` başlığını güncelle

```html
<title>Müşteri Adı — Ne Yaptığı</title>
<meta name="description" content="Şehri + hizmeti + bir fayda yaz. 155 karakteri geçme.">
<link rel="canonical" href="https://musteri-sitesi.com/">
```

### 5. Yerelde test et

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

**Kontrol listesi:**
- [ ] WhatsApp butonu doğru numarayı açıyor
- [ ] Formu doldur → WhatsApp'ta mesaj düzgün görünüyor
- [ ] Telefonu çevir → mobilde sabit alt menü görünüyor
- [ ] Galeriye tıkla → büyüyor, ESC ile kapanıyor
- [ ] SSS açılıp kapanıyor

---

## Canlıya alma

### Cloudflare Pages (ücretsiz, önerilen)

1. Klasörü [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → "Direct Upload" → sürükle-bırak
2. Özel alan adını bağla

### Netlify (ücretsiz)

[app.netlify.com/drop](https://app.netlify.com/drop) → klasörü sürükle → bitti.

### Alan adı + e-posta

- Alan adı: müşteri adına al (Cloudflare Registrar, maliyetine satar)
- E-posta: Google Workspace (~₺200/ay, müşteriye yansıt) veya Zoho Mail (ücretsiz)

---

## Yayın sonrası — aylık bakıma dahil et

Bunları yapıp **müşteriye rapor gönder.** Bakım ücretinin karşılığı bu:

- [ ] Google Search Console'a ekle, sitemap gönder
- [ ] Google Business Profile'ı doldur (fotoğraf, çalışma saati, hizmetler)
- [ ] Yorum iste — her misafire çıkışta WhatsApp'tan link at
- [ ] Aylık: kaç WhatsApp talebi geldi, kaçı rezervasyona döndü
- [ ] Sezon öncesi fiyatları ve fotoğrafları güncelle

---

## Test

Şablonun gerçekten çalıştığını doğrulayan jsdom testi (bu klasörün dışında):

```bash
cd ../test && npm install && npm test
```

54 kontrol çalıştırır: render, SEO schema, WhatsApp linkleri, form akışı,
doğrulama kuralları ve XSS kaçışlaması.

---

## Sık yapılan hatalar

- ❌ WhatsApp numarasına `+90 532...` yazmak → link çalışmaz. `90532...` olacak.
- ❌ 5 MB'lık fotoğraf atmak → mobilde 8 saniyede açılır, müşteri kaçar.
- ❌ Yorum uydurmak → Google işletme profilini askıya alır.
- ❌ `config.js` yerine `index.html` düzenlemek → bir sonraki müşteride karışır.
- ❌ Bakım ücreti almamak → 10 site kurarsın, gelir sıfır kalır.
