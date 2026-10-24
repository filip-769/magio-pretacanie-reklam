const tools = {
    "APKEditor.jar": "https://github.com/REAndroid/APKEditor/releases/download/V1.4.9/APKEditor-1.4.9.jar",
    "apktool.jar": "https://github.com/iBotPeaches/Apktool/releases/download/v3.0.3/apktool_3.0.3.jar",
    "uber-apk-signer.jar": "https://github.com/patrickfav/uber-apk-signer/releases/download/v1.3.0/uber-apk-signer-1.3.0.jar"
};

export async function downloadTools() {
    await Deno.mkdir("java_tools", { recursive: true });
    for (const [name, url] of Object.entries(tools)) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Download failed for ${name}: ${response.status}`);
        await Deno.writeFile(`java_tools/${name}`, new Uint8Array(await response.arrayBuffer()));
        console.log(`Downloaded ${name}.`);
    }
}

export async function run(command: string, args: string[]) {
    const status = await new Deno.Command(command, { args, stdout: "inherit", stderr: "inherit" }).spawn().status;
    if (!status.success) throw new Error(`${command} exited with code ${status.code}`);
}
