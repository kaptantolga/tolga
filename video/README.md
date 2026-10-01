# Instagram Reels Üreticisi

İşletmeler için **gerçek MP4 reklam videosu** üreten pipeline.
Fotoğraf + metin + Türkçe seslendirme → 1080×1920 (9:16), 30fps, H.264 Reel.

Örnek çıktı (git'te, her zaman indirilebilir): `ada-ruzgari-reel.mp4` (~21 sn).
Çalışma çıktısı: `cikti/` (git'te yok).

---

## Ne üretiyor

- 9:16 dikey, 1080×1920, H.264 + AAC (Instagram Reels spesifikasyonu)
- Yavaş yakınlaşma / uzaklaşma (Ken Burns) — fotoğraftan sinema hissi
- Üstte hikâye tarzı ilerleme çubuğu + sabit marka logosu
- Ortalanmış, bant + gölge ile okunaklı **altyazı** (Türkçe karakter tam destekli)
- Sahneler arası yumuşak çapraz geçiş
- Türkçe seslendirme, altyazıyla senkron

Altyazı şart: izleyicilerin çoğu **sessiz** izler; yazı olmadan mesaj kaybolur.

## Kurulum (bir kere)

```bash
cd video
python3 -m venv .venv
.venv/bin/pip install imageio-ffmpeg pillow numpy
```

> `.venv/` git'te ve anlık görüntülerde tutulmaz — ortam sıfırlanırsa bu komutu
> tekrar çalıştır.

## Kullanım

```bash
.venv/bin/python reel.py              # demo: Ada Rüzgarı
.venv/bin/python musteri.json         # yeni müşteri için kendi JSON'un
```

## Müşteri için Reel yapma akışı

1. İşletmeden 5-6 iyi fotoğraf iste (veya telefonla kendin çek — en iyisi bu)
2. `ses/` içindeki seslendirme yerine **müşterinin metnini** seslendir:
   bu ortamda `add_voice` + `generate_speech` ile Türkçe ses üretebilirsin
3. `reel.py`'deki `YAPILANDIRMA` bloğunu (veya bir JSON'u) doldur
4. `cikti/` klasörüne düşen MP4'ü müşteriye WhatsApp'tan gönder

### Reel metni yazarken (2026 best-practice)

- **İlk 3 saniye = hook.** Merak veya problem: "Bozcaada'da kimsenin gitmediği bir koy var."
- Toplam **15-30 sn** tut. 30 üstü tamamlanma oranını düşürür.
- Son sahnede net **CTA**: "Direkt ayırtın. Link profilde."
- Müzik istersen: MP4'ü Instagram'a atıp **uygulamada trend ses ekle** —
  lisanslı müzik oradan gelir, telif derdi olmaz. (Bu araç telifli müzik
  indirmez/basamaz.)

## Güvenlik bölgeleri

Üst %14 ve alt %20 Instagram arayüzüne gider. Metin ve logo otomatik olarak
ortadaki güvenli alana çizilir — `GUVENLI_UST` / `GUVENLI_ALT` sabitlerine dokunma.

## Dosyalar

| Dosya | Rol |
|---|---|
| `reel.py` | Render motoru (Pillow ile kare üret → ffmpeg ile kodla) |
| `ses/*.mp3` | Demo seslendirme (regenerable değil; yeni müşteri için yeniden üret) |
| `cikti/` | Üretilen MP4 (git'te yok, büyük) |
| `kontrol/` | Doğrulama için çıkarılan kareler (git'te yok) |

## Doğrulama

```bash
FF=$(.venv/bin/python -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -i cikti/ada-ruzgari-reel.mp4   # 1080x1920, h264, 30fps, aac görmelisin
```
