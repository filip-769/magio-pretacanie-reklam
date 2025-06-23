# Magio TV pretáčanie reklám
Od 5. 6. 2025 neumožnuje Telekom na vybraných staniciach (Markíza, Doma, Dajto, Markíza Krimi a Markíza Klasik) voľne pretáčať reklamu (https://www.telekom.sk/wiki/televizia/pretacanie-reklam). Pomocou úpravy aplikácie a jej komunikácií sa táto funkcionalita dá vrátiť späť. Nižšie je uvedený spôsob, ktorým je to možné dosiahnuť na zariadeniach s operačným systémom Android TV/Google TV bez nutnosti rootu (teoreticky je ho možné využiť aj na telefónoch s Androidom a aj na aplikáciu DIGI TV - nie je otestované).

## Potrebné zariadenia
- Android TV/Google TV televízor/box s aplikáciou Magio TV nainštalovanou z Google Play (nie iných zdrojov)
- počítač (teoreticky je možné použiť aj Termux na Androide - nie je otestované)

## Informácie pred začatím
- Počas odblokovania blokovania reklám nebude možné používať VPN.
- Tento proces berie zariadeniu značné množstvo operačnej pamäte, odporúčané je raz za čas "reštartovať" aplikáciu PCAPdroid stlačením `⏹` a potom `▶` alebo úplným reštartovaním zariadenia.
- Kroky v poslednej časti bude nutné zopakovať pri každej aktualizácií aplikácie, ktorá znefunkční predchádzajuce verzie.

## Nainštalovanie a pripojenie ADB
1. Otvor systémové nastavenia
2. V časti `Systém` -> `Informácie` klikaj na `Zostava operačného systému Android TV`, kým sa nezobrazí, že si vývojár. 
3. V časti `Systém` -> `Pre vývojárov` zapni `Ladenie cez USB`.
4. V časti `Systém` -> `Informácie` -> `Stav` si zapíš IP adresu zariadenia zo sekcie `Adresa IP`.
5. Na počítači si stiahni `.zip` súbor s SDK Platform Tools pre tvoj operačný systém z https://developer.android.com/tools/releases/platform-tools.
6. Súbor extrahuj a v priečinku `platform-tools` otvor terminál.
7. Spusti príkaz `./adb connect IP_ADRESA_ZARIADENIA` pre pripojenie televízora k počítaču cez ADB.
8. Na televízore zvoľ možnosť `povoliť`.
9. Over pripojenie príkazom `./adb devices` - zariadenie by malo byť vidno v zozname a nemalo by hlásiť chybu.

## Nastavenie PCAPdroidu a získanie certifikátu
> [!TIP]
> Navigovanie niektorých aplikácií môže byť pomocou ovládača zložité. V prípade, že nevieš na niečo kliknúť môžeš skúsiť použiť USB alebo Bluetooth myš.
10. Z Google Play nainštaluj aplikáciu [AnExplorer](https://play.google.com/store/apps/details?id=dev.dworks.apps.anexplorer).
11. Otvor AnExplorer a v prípade žiadosti o povolenie prístupu k súborom udeľ povolenie ku všetkým súborom.
12. Z Google Play nainštaluj aplikáciu [PCAPdroid](https://play.google.com/store/apps/details?id=com.emanuelef.remote_capture).
13. Príkazom `./adb shell getprop ro.product.cpu.abi` zisti ABI tvojho zariadenia.
14. Z https://github.com/emanuele-f/PCAPdroid-mitm/releases stiahni najnovší `.apk` súbor pre tvoje ABI.
15. Tento súbor premenuj na `PCAPdroid-mitm.apk` a presuň do `platform-tools`.
16. Spusti príkaz `./adb install PCAPdroid-mitm.apk` pre nainštalovanie MITM doplnku pre PCAPdroid.
17. Otvor aplikáciu PCAPdroid a stlač `skip`.
18. Klikni na `≡` a otvor `Decryption rules`.
19. Klikni na `+` a potom `App`.
20. Vyber aplikáciu Magio TV.
21. Vráť sa späť na hlavnú obrazovku aplikácie a otvor nastavenia ikonou `⚙`.
22. Možnosť `Block QUIC` nastav na `Only for connections to decrypt`.
23. Vypni možnosť `Full payload`.
24. Zapni možnosť `Start at boot`.
25. Zapni možnosť `Restart on disconnection`.
26. Klikni na `TLS decryption`.
27. Klikni na `next` a potom znovu na `next`.
28. Klikni na `export` a pre otvorenie vyber AnExplorer a klikni na `len raz`.
29. Vyber priečinok `Documents` a výber potvrď ikonou `✓`.
30. Po vrátení do PCAPdroidu klikni na `skip` a znovu na `skip`, potom na `done`.
31. Na počítači spusti príkaz `./adb uninstall dev.dworks.apps.anexplorer` pre odinštalovanie aplikácie AnExplorer.
32. Klikni na `Additional mitmproxy options` a po zobrazení klávesnice spusti príkaz `./adb shell "input text '--allow-hosts=.+-ads-sk\\.cdn\\.magio\\.tv --modify-body=/NOT_SKIPPABLE|PARTIAL_SKIPPABLE/FULLY_SKIPPABLE --modify-body=/\"gracePeriodInSeconds\":60/\"gracePeriodInSeconds\":0'"` (ten vyplní do textového poľa nastavenia pre mitmproxy) a na televízore zvoľ možnosť `ok`.
33. Spusti príkaz `./adb pull /sdcard/Documents/PCAPdroid_CA.crt pcapdroid.cer` pre skopírovanie certifikátu do počítača.

## Stiahnutie potrebných Java aplikácií do počítača
34. Príkazom `java -version` si over, či máš nainštalovanú Javu. V prípade chyby typu `command not found` alebo `'java' is not recognized as an internal or external command` si nainštaluj Javu z https://www.java.com/en/download/.
35. Stiahni `.jar` súbor z https://github.com/REAndroid/APKEditor/releases, premenuj ho na `APKEditor.jar` a presuň do priečinka `platform-tools`.
36. Stiahni `.jar` súbor z https://github.com/iBotPeaches/Apktool/releases, premenuj ho na `apktool.jar` a presuň do priečinka `platform-tools`.
37. Stiahni `.jar` súbor z https://github.com/patrickfav/uber-apk-signer/releases, premenuj ho na `uber-apk-signer.jar` a presuň do priečinka `platform-tools`.

## Úprava a reinštalácia aplikácie Magio TV
> [!IMPORTANT]
> Kroky nižšie je nutné zopakovať pri každej aktualizácií aplikácie *(predpokladá sa ADB pripojené ako v prvej časti)*.
38. V `platform-tools` vytvor priečinok `magio`.
39. Pomocou príkazu `./adb shell pm path com.telekom.magiogo` vypíš všetky `.apk` súbory aplikácie Magio TV.
40. Každý z týchto súborov skopíruj do počítača pomocou `./adb pull /data/app/DLHY_NAHODNY_TEXT/NAZOV_APK.apk magio/NAZOV_APK.apk`.
41. Spusti príkaz `java -jar APKEditor.jar m -i magio` pre spojenie `.apk` súborov v priečinku `magio`.
42. Spusti príkaz `java -jar apktool.jar d magio_merged.apk` pre dekompilovanie `.apk` súboru aplikácie.
43. Súbor `pcapdroid.cer` skopíruj do `magio_merged/res/raw`.
44. V priečinku `magio_merged/res/xml` vymaž súbor `network_security_config.xml`.
45. Z tohto repozitára si stiahni súbor `network_security_config.xml` a ten skopíruj do `magio_merged/res/xml`.
46. Spusti príkaz `java -jar apktool.jar b magio_merged` pre vytvorenie nového `.apk` súboru.
47. Spusti príkaz `java -jar uber-apk-signer.jar --apks magio_merged/dist/magio_merged.apk` pre podpísanie `.apk` súboru certifikátom.
48. Spusti príkaz `./adb uninstall com.telekom.magiogo` pre vymazanie pôvodnej aplikácie Magio TV.
49. Spusti príkaz `./adb install magio_merged/dist/magio_merged-aligned-debugSigned.apk` pre nainštalovanie upravenej aplikácie Magio TV.
50. Otvor PCAPdroid a klikni na `Target apps`.
51. Vyber aplikáciu Magio TV.
52. Vráť sa späť na hlavnú obrazovku aplikácie a klikni na ikonu `▶` (v prípade vyskakovacieho okna klikni na `ok` a poprípade znovu na `ok`).
53. Vymaž priečinky `magio`, `magio_merged` a súbor `magio_merged.apk`.
54. Prihlás sa do aplikácie Magio TV a reklamy bude možné voľne pretáčať.
> [!NOTE]
> Môže sa stať, že reklamu nie je možné pretáčať na niektorom programe/obsahu, ale na iných áno. To je spôsobené vyrovnávacou pamäťou aplikácie (aplikácia určitý čas pre už prehratý obsah znovu nevyžiada informácie o reklamách) a tá sa časom sama vyresetuje.
