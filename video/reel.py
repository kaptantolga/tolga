#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Instagram Reels üreticisi — 1080x1920 (9:16), 30fps, H.264 MP4.

Fotoğraf + metin + ses dosyalarından; yavaş yakınlaşma (Ken Burns), yumuşak
geçişler, altyazı ve ilerleme çubuğu içeren gerçek bir reklam videosu üretir.

Kurulum (bir kere):
    cd video
    python3 -m venv .venv
    .venv/bin/pip install imageio-ffmpeg pillow numpy

Kullanım:
    .venv/bin/python reel.py                 # aşağıdaki YAPILANDIRMA ile
    .venv/bin/python reel.py musteri.json    # JSON yapılandırması ile
"""

import json
import os
import subprocess
import sys
import tempfile

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# ---------------------------------------------------------------
# Instagram Reels spesifikasyonu (2026)
#   9:16 zorunlu, 1080x1920, H.264 MP4, min 30fps
#   güvenli alan: üst %14 ve alt %20 -> arayüz buraları kapatıyor
# ---------------------------------------------------------------
W, H, FPS = 1080, 1920, 30
GUVENLI_UST = int(H * 0.14)
GUVENLI_ALT = int(H * 0.20)
FONT_KALIN = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


# ---------------------------------------------------------------
# Yardımcılar
# ---------------------------------------------------------------
def ffmpeg(args, **kw):
    return subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y"] + args,
                          check=True, **kw)


def ses_suresi(yol):
    """ffprobe bu pakette yok; süreyi ffmpeg -i çıktısından oku."""
    p = subprocess.run([FFMPEG, "-hide_banner", "-i", yol],
                       capture_output=True, text=True)
    if "Duration:" not in p.stderr:
        raise RuntimeError("süre okunamadı: " + yol)
    parca = p.stderr.split("Duration:")[1].split(",")[0].strip()
    saat, dakika, saniye = parca.split(":")
    return int(saat) * 3600 + int(dakika) * 60 + float(saniye)


def ease_in_out(t):
    """Yumuşak hızlanma/yavaşlama (smoothstep)."""
    return t * t * (3 - 2 * t)


def hex_renk(deger):
    s = str(deger).lstrip("#")
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def kapla(img, w, h, olcek=1.0, kaydirma=(0.0, 0.0)):
    """Görseli w×h alanını dolduracak şekilde kırp; olcek>1 ise yakınlaştır."""
    kaynak_w, kaynak_h = img.size
    oran = max(w / kaynak_w, h / kaynak_h) * olcek
    yeni_w, yeni_h = max(w, int(kaynak_w * oran)), max(h, int(kaynak_h * oran))
    img = img.resize((yeni_w, yeni_h), Image.LANCZOS)
    sol = int((yeni_w - w) / 2 + kaydirma[0] * (yeni_w - w))
    ust = int((yeni_h - h) / 2 + kaydirma[1] * (yeni_h - h))
    sol = max(0, min(sol, yeni_w - w))
    ust = max(0, min(ust, yeni_h - h))
    return img.crop((sol, ust, sol + w, ust + h))


def altyazi_ciz(katman, satirlar, y_baslangic, font, alfa, vurgu):
    """Yarı saydam bant + gölge ile ortalanmış altyazı."""
    if alfa <= 0.01:
        return
    satir_h = font.size + 16
    toplam_h = satir_h * len(satirlar)
    bant_ust = y_baslangic - 30
    bant_alt = y_baslangic + toplam_h + 14

    bant = Image.new("RGBA", katman.size, (0, 0, 0, 0))
    ImageDraw.Draw(bant).rounded_rectangle(
        [70, bant_ust, W - 70, bant_alt], radius=26,
        fill=(6, 26, 36, int(155 * alfa)))
    katman.alpha_composite(bant)

    cizim = ImageDraw.Draw(katman)
    for i, satir in enumerate(satirlar):
        x = (W - font.getlength(satir)) / 2
        y = y_baslangic + i * satir_h
        cizim.text((x + 3, y + 3), satir, font=font, fill=(0, 0, 0, int(190 * alfa)))
        cizim.text((x, y), satir, font=font, fill=(255, 255, 255, int(255 * alfa)))

    cizim.rounded_rectangle([W / 2 - 42, bant_ust - 16, W / 2 + 42, bant_ust - 9],
                            radius=4, fill=vurgu + (int(255 * alfa),))


def logo_ciz(katman, marka, alfa):
    if not marka or alfa <= 0.01:
        return
    font = ImageFont.truetype(FONT_KALIN, 40)
    cizim = ImageDraw.Draw(katman)
    x = (W - font.getlength(marka)) / 2
    y = GUVENLI_UST + 44
    cizim.text((x + 2, y + 2), marka, font=font, fill=(0, 0, 0, int(150 * alfa)))
    cizim.text((x, y), marka, font=font, fill=(255, 255, 255, int(235 * alfa)))


def ilerleme_cubugu(katman, oran):
    cizim = ImageDraw.Draw(katman)
    y = GUVENLI_UST - 28
    cizim.rounded_rectangle([40, y, W - 40, y + 6], radius=3, fill=(255, 255, 255, 70))
    cizim.rounded_rectangle([40, y, 40 + (W - 80) * min(1.0, oran), y + 6],
                            radius=3, fill=(255, 255, 255, 230))


# ---------------------------------------------------------------
# Sahne render
# ---------------------------------------------------------------
def sahne_kareleri(sahne, toplam_kare):
    gorsel = Image.open(sahne["gorsel"]).convert("RGB")
    satirlar = sahne["metin"]
    vurgu = hex_renk(sahne.get("vurgu", "#c2703f"))
    marka = sahne.get("marka")
    font = ImageFont.truetype(FONT_KALIN, sahne.get("font_boyut", 74))
    kaydirma = sahne.get("kaydirma", [0.0, 0.0])

    ileri = sahne.get("yon", "iler") == "iler"
    baslangic_olcek, bitis_olcek = (1.00, 1.18) if ileri else (1.18, 1.00)

    # koyulaştırma gradyanı sabit -> bir kere üret
    karartma = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    kd = ImageDraw.Draw(karartma)
    for i in range(H // 2, H):
        a = int(185 * ((i - H // 2) / (H // 2)) ** 1.6)
        kd.line([(0, i), (W, i)], fill=(4, 20, 28, a))

    y_baslik = H - GUVENLI_ALT - 210

    for k in range(toplam_kare):
        t = k / max(1, toplam_kare - 1)
        yumusak = ease_in_out(t)
        olcek = baslangic_olcek + (bitis_olcek - baslangic_olcek) * yumusak

        kare = kapla(gorsel, W, H, olcek=olcek, kaydirma=kaydirma).convert("RGBA")
        kare.alpha_composite(karartma)

        # yazı: başta belir, sonda kaybol
        if t < 0.30:
            alfa = ease_in_out(min(1.0, t / 0.18))
        elif t > 0.88:
            alfa = max(0.0, 1.0 - ease_in_out((t - 0.88) / 0.12))
        else:
            alfa = 1.0

        katman = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        altyazi_ciz(katman, satirlar, y_baslik + int((1 - alfa) * 44),
                    font, alfa, vurgu)
        logo_ciz(katman, marka, min(1.0, alfa + 0.35))
        ilerleme_cubugu(katman, t)
        kare.alpha_composite(katman)

        yield kare.convert("RGB")


def capraz_gecis(son_kareler, ilk_kareler, kare_sayisi):
    for i in range(kare_sayisi):
        yield Image.blend(son_kareler[i], ilk_kareler[i], (i + 1) / (kare_sayisi + 1))


# ---------------------------------------------------------------
# Ana üretim
# ---------------------------------------------------------------
def uret(yapilandirma):
    sahneler = yapilandirma["sahneler"]
    cikti = yapilandirma.get("cikti", "reel.mp4")
    gecis_kare = int(yapilandirma.get("gecis", 0.4) * FPS)

    print("Sahneler:")
    for i, s in enumerate(sahneler):
        if s.get("sure"):
            sure = float(s["sure"])
        elif s.get("ses"):
            sure = ses_suresi(s["ses"]) + 0.45   # nefes payı
        else:
            sure = 3.0
        s["_kare"] = max(1, int(round(sure * FPS)))
        s["_sure"] = s["_kare"] / FPS
        print(f"  {i+1}. {s['_sure']:.2f}s  {'ses' if s.get('ses') else '-  '}  "
              f"{' '.join(s['metin'])}")

    # Geçiş kareleri, sonraki sahnenin ilk karelerinin YERİNE geçer;
    # toplam kare sayısı = tüm sahne karelerinin toplamıdır.
    toplam = sum(s["_kare"] for s in sahneler)
    print(f"\nToplam: {toplam / FPS:.2f}s ({toplam} kare @ {FPS}fps, {W}x{H})")

    with tempfile.TemporaryDirectory() as gecici:
        video_yol = os.path.join(gecici, "video.mp4")
        proc = subprocess.Popen(
            [FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
             "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
             "-r", str(FPS), "-i", "-",
             "-c:v", "libx264", "-preset", "medium", "-crf", "20",
             "-pix_fmt", "yuv420p", video_yol],
            stdin=subprocess.PIPE)

        onceki = None
        for i, sahne in enumerate(sahneler):
            kareler = list(sahne_kareleri(sahne, sahne["_kare"]))
            if onceki is not None and gecis_kare > 0:
                for kare in capraz_gecis(onceki[-gecis_kare:], kareler[:gecis_kare],
                                         gecis_kare):
                    proc.stdin.write(kare.tobytes())
                kareler = kareler[gecis_kare:]
            for kare in kareler:
                proc.stdin.write(kare.tobytes())
            onceki = kareler
            print(f"  ✓ sahne {i+1}/{len(sahneler)}")

        proc.stdin.close()
        if proc.wait() != 0:
            raise RuntimeError("video kodlama başarısız")
        print("  video kodlandı")

        # --- ses: her sahneyi kendi süresine eşitle, sonra birleştir ---
        parcalar = []
        for i, sahne in enumerate(sahneler):
            parca = os.path.join(gecici, f"ses{i}.wav")
            if sahne.get("ses"):
                ffmpeg(["-i", sahne["ses"],
                        "-af", f"apad,atrim=0:{sahne['_sure']:.3f},asetpts=N/SR/TB",
                        "-ar", "44100", "-ac", "2", "-t", f"{sahne['_sure']:.3f}", parca])
            else:
                ffmpeg(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
                        "-t", f"{sahne['_sure']:.3f}", parca])
            parcalar.append(parca)

        tam_ses = os.path.join(gecici, "tam.wav")
        girdiler = []
        for p in parcalar:
            girdiler += ["-i", p]
        filtre = "".join(f"[{i}:a]" for i in range(len(parcalar))) + \
            f"concat=n={len(parcalar)}:v=0:a=1[out]"
        ffmpeg(girdiler + ["-filter_complex", filtre, "-map", "[out]", tam_ses])
        print("  ses birleştirildi")

        os.makedirs(os.path.dirname(cikti) or ".", exist_ok=True)
        ffmpeg(["-i", video_yol, "-i", tam_ses,
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                "-shortest", "-movflags", "+faststart", cikti])

    print(f"\n✅ ÜRETİLDİ: {cikti}  "
          f"({os.path.getsize(cikti)/1024/1024:.1f} MB, {W}x{H}, {FPS}fps)")
    return cikti


# ---------------------------------------------------------------
# YAPILANDIRMA — yeni müşteri için burayı (veya bir JSON) değiştir
# ---------------------------------------------------------------
G = "../template/assets/"
YAPILANDIRMA = {
    "cikti": "cikti/ada-ruzgari-reel.mp4",
    "gecis": 0.4,
    "sahneler": [
        {"gorsel": G + "hero.jpg",
         "metin": ["Bozcaada'da", "kimsenin gitmediği", "bir koy var."],
         "ses": "ses/1.mp3", "marka": "ADA RÜZGARI", "yon": "iler"},
        {"gorsel": G + "g-hakkinda.jpg",
         "metin": ["Altı odalı bir ev.", "On iki kişilik bir tekne."],
         "ses": "ses/2.mp3", "marka": "ADA RÜZGARI", "yon": "geri"},
        {"gorsel": G + "g-3.jpg",
         "metin": ["Sabah çıkıyoruz,", "üç koya demirliyoruz,", "akşam dönüyoruz."],
         "ses": "ses/3.mp3", "marka": "ADA RÜZGARI", "yon": "iler"},
        {"gorsel": G + "g-4.jpg",
         "metin": ["Kalabalık tur yok.", "Menüde o sabah", "adada ne varsa o."],
         "ses": "ses/4.mp3", "marka": "ADA RÜZGARI", "yon": "geri"},
        {"gorsel": G + "g-5.jpg",
         "metin": ["Direkt ayırtın.", "Link profilde."],
         "ses": "ses/5.mp3", "marka": "ADA RÜZGARI",
         "vurgu": "#c2703f", "font_boyut": 92, "yon": "iler"},
    ],
}

if __name__ == "__main__":
    hedef = YAPILANDIRMA
    if len(sys.argv) > 1:
        with open(sys.argv[1], encoding="utf-8") as f:
            hedef = json.load(f)
    uret(hedef)
