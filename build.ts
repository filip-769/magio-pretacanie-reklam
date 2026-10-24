import { homedir } from "node:os";
import { downloadTools, run } from "./build/tools.ts";

Deno.chdir(new URL(".", import.meta.url));

const sdk = `${homedir()}/Android/Sdk`;
const androidJar = `${sdk}/platforms/android-35/android.jar`;
const d8 = `${sdk}/build-tools/35.0.0/d8`;
const apktool = ["-Xmx3g", "-XX:ActiveProcessorCount=2", "-jar", "java_tools/apktool.jar"];

await downloadTools();
try {
    await Deno.mkdir(".build/classes", { recursive: true });
    await Deno.mkdir(".build/dex", { recursive: true });

    await run("java", [
        "-jar",
        "java_tools/APKEditor.jar",
        "m",
        "-i",
        "input.apkm",
        "-o",
        ".build/merged.apk",
        "-clean-meta",
    ]);
    await run("java", [...apktool, "d", "--jobs", "2", "-f", ".build/merged.apk", "-o", ".build/decoded"]);
    await Deno.writeTextFile(
        ".build/decoded/smali_classes2/com/telekom/tv/player/CustomWebView$onCreateStbPlayerActivity$1.smali",
        await Deno.readTextFile("build/webview.smali"),
        { append: true, create: false },
    );

    await run("javac", [
        "--release",
        "8",
        "-classpath",
        androidJar,
        "-d",
        ".build/classes",
        "AdMetadataResponseInterceptor.java",
    ]);
    await run(d8, [
        "--min-api",
        "24",
        "--lib",
        androidJar,
        "--output",
        ".build/dex",
        ".build/classes/com/telekom/magiogo/AdMetadataResponseInterceptor.class",
    ]);
    await run("java", [...apktool, "b", "--jobs", "2", ".build/decoded", "-o", ".build/unsigned.apk"]);
    await Deno.rename(".build/dex/classes.dex", ".build/dex/classes3.dex");
    await run("jar", [
        "--update",
        "--file",
        ".build/unsigned.apk",
        "--no-compress",
        "-C",
        ".build/dex",
        "classes3.dex",
    ]);
    await run("java", [
        "-jar",
        "java_tools/uber-apk-signer.jar",
        "--apks",
        ".build/unsigned.apk",
        "--out",
        ".build/signed",
    ]);
    await Deno.copyFile(".build/signed/unsigned-aligned-debugSigned.apk", "output.apk");
    console.log("Built output.apk");
} finally {
    await Deno.remove(".build", { recursive: true });
}
