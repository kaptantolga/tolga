# KORUMA TILSIMI — METİNLER (bire bir, eksiksiz Unicode nüsha)
# Font: Amiri (naskh). Dizgi: HarfBuzz (GSUB/GPOS) + FreeType.
# Not: Âyet sonlarındaki ﴿١﴾ vb. işaretler Mushaf'taki âyet duraklarıdır.
# ۚ ۖ ۗ işaretleri Mushaf'taki durak/vakf işaretleridir; metnin aslındadır.

## BESMELE
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

## ÂYETÜ'L-KÜRSÎ (el-Bakara 2:255)
اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ

## İHLÂS (112)
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾

## FELAK (113)
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِنْ شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾

## NÂS (114)
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾

## TILSIM HALKASINDA KULLANILAN (fotoğraftaki dairesel yazıt)
# Besmele + İhlâs Suresi (âyet duraksız, kelimeler halkaya dizilmiştir)

---
## YENİDEN ÜRETİM (reproducibility)
- Dizgi motoru: `tools/ar_render.py` — uharfbuzz (HarfBuzz 14.5, GSUB/GPOS) + freetype-py + Pillow.
  Metin yapay zekâya "çizdirilmez"; Unicode girdi bire bir şekillendirilir (ligatür + hareke konumlandırma).
- Kompozisyon: `tools/make_tilsim.py`
  - `make_ring()`: fotoğraftaki ışın bandını radyal-medyan dolgu ile temizler, dairesel yazıtı
    kelime kelime (kelime içi shaping korunarak) yerleştirir. Yazıt = Besmele + İhlâs Suresi.
    Besmele|İhlâs ayracı üstte askı düğümünün altına denk getirilmiştir; alt ortaya gülbezek konur.
  - `make_sheet()`: A4 300 dpi (2480x3508) araştırma sayfası: Besmele, Âyetü'l-Kürsî, İhlâs, Felak, Nâs.
- Font: Amiri (naskh), OFL lisansı; npm `@fontsource/amiri` paketinden arabic+latin+latin-ext
  alt kümeleri `fontTools.merge` ile birleştirilmiştir (`/home/user/fonts/Amiri-*-full.ttf`).
  Kur'an durak işaretleri (U+06DA vb.) fontta mevcuttur ve kullanılmıştır.
- Çıktılar: `images/koruma-tilsimi-arapca.png`, `images/tilsim-metin-sayfasi.png`
