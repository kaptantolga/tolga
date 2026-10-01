/* ============================================================
   SİTE AYARLARI — YENİ MÜŞTERİ İÇİN SADECE BU DOSYAYI DÜZENLE
   ============================================================
   Başka hiçbir dosyaya dokunmana gerek yok. Burayı doldur,
   klasörü kopyala, deploy et. Ortalama süre: 20-40 dakika.
   ============================================================ */

window.SITE = {
  /* ---------- 1. KİMLİK ---------- */
  marka: {
    ad: "Ada Rüzgarı",
    tur: "Butik Otel & Tekne Turları",
    slogan: "Bozcaada'nın sessiz koylarında, kendi ritminde.",
    telefon: "+90 532 000 00 00",
    // WhatsApp numarası: +, boşluk ve tire OLMADAN yaz. Türkiye = 90 ile başlar.
    whatsapp: "905320000000",
    email: "merhaba@adaruzgari.example",
    adres: "Alaybey Mah. Sahil Yolu 12, Bozcaada / Çanakkale",
    konum: { enlem: 39.8345, boylam: 26.0675 },
    instagram: "adaruzgari",
    // Google Haritalar embed linki: Haritalar'da mekanı bul -> Paylaş -> Harita yerleştir -> src içindeki URL
    haritaEmbed: "https://www.google.com/maps?q=39.8345,26.0675&z=14&output=embed"
  },

  /* ---------- 2. RENKLER (markaya göre değiştir) ---------- */
  renkler: {
    deniz: "#0d3b4f",       // ana koyu renk
    denizAcik: "#14607d",   // ikincil
    toprak: "#c2703f",      // vurgu / buton
    kum: "#f5efe6",         // arkaplan
    yazi: "#1a2530"
  },

  /* ---------- 3. GÖRSELLER ----------
     Dosyaları assets/ klasörüne at, isimlerini buraya yaz.
     Önerilen boyutlar: hero 2000x1200, galeri 1200x900, JPG/WebP.
     Bir görsel eksikse sayfa bozulmaz, yerine renkli bir alan çıkar. */
  heroGorsel: "assets/hero.jpg",
  galeri: [
    { yol: "assets/g-1.jpg", baslik: "Deniz manzaralı oda" },
    { yol: "assets/g-2.jpg", baslik: "Bağ evi süit terası" },
    { yol: "assets/g-3.jpg", baslik: "Tekne turu, öğle molası" },
    { yol: "assets/g-4.jpg", baslik: "Sabah kahvaltısı" },
    { yol: "assets/g-5.jpg", baslik: "Gün batımı, güney koyu" }
  ],

  /* ---------- 4. ÜST BANTTA ÇIKAN KISA VAATLER ---------- */
  vaatler: [
    { ikon: "⭐", baslik: "4.9 / 5",  aciklama: "212 misafir yorumu" },
    { ikon: "🛥️", baslik: "Özel tekne", aciklama: "Kalabalık tur yok" },
    { ikon: "🌊", baslik: "Kendi koyumuz", aciklama: "Plaja 90 saniye" },
    { ikon: "🍇", baslik: "Ada kahvaltısı", aciklama: "Yerel üreticiden" }
  ],

  /* ---------- 5. HAKKIMIZDA ---------- */
  hakkinda: {
    baslik: "Kalabalıktan uzak, ama her yere yakın",
    paragraflar: [
      "Altı odalı, aile işletmesi bir ev. Bozcaada'nın güney koylarında, bağların bittiği yerde. Odaların hepsi denize bakıyor; hiçbirinin penceresinden başka bir bina görünmüyor.",
      "Teknemiz 12 kişilik. Sabah çıkıyoruz, akşam dönüyoruz, arada kimsenin gitmediği üç koya demirliyoruz. Menüde ne çıkarsa o — adada o sabah ne varsa."
    ],
    // Solda görünecek görsel (assets/ içine koy)
    gorsel: "assets/g-hakkinda.jpg",
    rozetler: ["6 oda", "12 kişilik tekne", "2014'ten beri", "Evcil hayvan dostu"]
  },

  /* ---------- 6. ODALAR / TURLAR (kartlar) ----------
     Ne satıyorsan onu yaz: oda, tur, paket, masa, ders... */
  urunler: [
    {
      baslik: "Deniz Manzaralı Oda",
      etiket: "2 kişi",
      fiyat: "₺4.200",
      fiyatBirimi: "/ gece",
      aciklama: "Fransız balkon, kendi banyosu, sabah güneşi. İki kişi için ideal.",
      ozellikler: ["Deniz manzarası", "Klima", "Kahvaltı dahil", "Ücretsiz iptal (48 saat)"],
      gorsel: "assets/g-1.jpg"
    },
    {
      baslik: "Bağ Evi Süit",
      etiket: "4 kişi",
      fiyat: "₺6.800",
      fiyatBirimi: "/ gece",
      aciklama: "Ayrı oturma alanı, teras, bağ manzarası. Aileler için en rahat seçenek.",
      ozellikler: ["Teras", "2 yatak odası", "Kahvaltı dahil", "Bebek yatağı"],
      gorsel: "assets/g-2.jpg"
    },
    {
      baslik: "Tam Gün Tekne Turu",
      etiket: "12 kişilik",
      fiyat: "₺1.850",
      fiyatBirimi: "/ kişi",
      aciklama: "10:00 - 18:30. Üç koy, öğle yemeği teknede, şnorkel ekipmanı dahil.",
      ozellikler: ["Öğle yemeği", "Şnorkel dahil", "Rehberli", "Çocuklara %50"],
      gorsel: "assets/g-3.jpg"
    }
  ],

  /* ---------- 7. YORUMLAR ---------- */
  yorumlar: [
    {
      isim: "Elif K.",
      tarih: "Ağustos 2026",
      puan: 5,
      metin: "Tekne turu beklediğimin çok üstündeydi. Kalabalık yoktu, kimsenin gitmediği koylara girdik. Yemek de güzeldi.",
      kaynak: "Google"
    },
    {
      isim: "Mert A.",
      tarih: "Temmuz 2026",
      puan: 5,
      metin: "Booking'den değil direkt siteden ayırttık, kahvaltıyı ücretsiz yükselttiler. Oda temiz, manzara fotoğraftaki gibi.",
      kaynak: "Direkt rezervasyon"
    },
    {
      isim: "Sibel Y.",
      tarih: "Haziran 2026",
      puan: 5,
      metin: "İki gece kaldık, üç geceye uzattık. Sahipleri çok ilgili, adanın nerede ne yenir hepsini anlattılar.",
      kaynak: "Google"
    }
  ],

  /* ---------- 8. DİREKT REZERVASYON AVANTAJI ----------
     Bu bölüm senin satış tezin. Müşteriye "OTA'dan değil
     bizden ayırt" dedirten kısım. Sakın silme. */
  direktAvantaj: {
    baslik: "Direkt ayırtın, komisyon bize değil size kalsın",
    aciklama:
      "Booking.com ve benzeri siteler her rezervasyondan %15-25 arası komisyon alır. O komisyonu ödemeyince, aynı odayı size daha iyi şartlarda verebiliyoruz.",
    maddeler: [
      "Direkt rezervasyonda oda yükseltme önceliği",
      "Esnek iptal — 48 saate kadar cezasız",
      "Erken giriş / geç çıkış müsaitliğe göre ücretsiz",
      "Tekne turunda direkt misafirlere ayrılan yer"
    ]
  },

  /* ---------- 9. SIK SORULANLAR ---------- */
  sss: [
    { s: "Check-in ve check-out saatleri kaç?", c: "Giriş 15:00, çıkış 11:00. Müsaitliğe göre erken giriş ayarlayabiliyoruz, sormanız yeterli." },
    { s: "Ödemeyi nasıl yapıyorum?", c: "Rezervasyon WhatsApp üzerinden onaylandıktan sonra kapora transferi alıyoruz, kalanı girişte. Kartla ödeme de mümkün." },
    { s: "Tekne turu hava muhalefetinde iptal olursa?", c: "Tam ücret iade edilir veya tarihinizi değiştiririz. Tur sabahı saat 08:00'de bilgilendirme yapıyoruz." },
    { s: "Evcil hayvan kabul ediyor musunuz?", c: "Evet, küçük ırk köpekler odada kalabilir. Teknede de sorun olmuyor, önceden söylemeniz yeterli." }
  ],

  /* ---------- 10. REZERVASYON FORMU AYARLARI ---------- */
  rezervasyon: {
    baslik: "Müsaitlik sor",
    aciklama:
      "Formu doldur, WhatsApp'tan anında cevap alalım. Ortalama dönüş süremiz 20 dakika.",
    alanlar: ["Tarih aralığı", "Kişi sayısı", "Oda / tur seçimi"]
  }
};
