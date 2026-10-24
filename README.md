# Magio TV pretáčanie reklám

Telekom na vybraných staniciach obmedzuje pretáčanie reklám v službe Magio TV ([informácie od Telekomu](https://www.telekom.sk/wiki/televizia/pretacanie-reklam)). Táto úprava aplikácie obnovuje možnosť pretáčať reklamy. Je určená pre zariadenia s Android TV alebo Google TV a nevyžaduje root.

## Potrebné zariadenia a programy

- Android TV/Google TV televízor alebo box.
- Počítač s [Deno 2](https://deno.com/).
- JDK s príkazmi `java`, `javac` a `jar` dostupnými v `PATH`.
- Android SDK v priečinku `~/Android/Sdk` s platformou Android 35 a Build Tools 35.0.0.
- ADB na pripojenie k televízoru a inštaláciu APK.

## Informácie pred začatím

- Úprava bola testovaná s aplikáciou **Magio TV 3.7.6**. Iné verzie môžu vyžadovať zmeny.
- Na vytvorenie APK potrebujete balík `.apkm` pre **Magio TV**.
- Vytvorené APK je podpísané vlastným podpisovým certifikátom. Ak máte v televízore nainštalovanú oficiálnu aplikáciu Magio TV, pred inštaláciou ju odinštalujte.

## Vytvorenie APK

Z [APKMirror](https://www.apkmirror.com/uploads/?appcategory=magio-go-android-tv-2) stiahnite balík `.apkm` aplikácie **Magio TV pre Android TV**. Premenujte ho na `input.apkm` a vložte do koreňového priečinka projektu.

V priečinku projektu spustite:

```sh
deno run -A build.ts
```

Skript stiahne potrebné Java nástroje a vytvorí upravenú aplikáciu. Výsledné APK sa uloží ako `output.apk`.

## Nainštalovanie a pripojenie ADB

1. V nastaveniach televízora otvorte časť `Informácie` a opakovane vyberte položku `Zostava`, kým sa nezobrazí, že ste vývojár.
2. V možnostiach pre vývojárov povoľte `Ladenie cez USB`.
3. V nastaveniach siete alebo v časti `Informácie` zistite IP adresu televízora.
4. Nainštalujte [SDK Platform Tools](https://developer.android.com/tools/releases/platform-tools) do počítača a v priečinku `platform-tools` otvorte terminál.
5. Pripojte televízor k počítaču cez ADB:

   ```sh
   adb connect IP_ADRESA_ZARIADENIA
   ```

6. Na televízore povoľte pripojenie a overte ho príkazom `adb devices`.

## Inštalácia upravenej aplikácie

Ak je v televízore nainštalovaná oficiálna aplikácia Magio TV, odinštalujte ju:

```sh
adb uninstall com.telekom.magiogo
```

Potom nainštalujte vytvorené APK:

```sh
adb install output.apk
```

Po spustení aplikácie sa prihláste do Magio TV.
