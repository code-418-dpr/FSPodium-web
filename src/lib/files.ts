"use server";

async function getFileData(filePath: string) {
    const bucketName = "files";

    const response = await fetch(
        `${process.env.FILE_SERVICE_URL}/api/Files?bucketName=${bucketName}&fileName=${filePath}`,
    );
    const data: unknown = await response.json();
    if (!(typeof data === "object" && data !== null && "value" in data && typeof data.value === "string")) {
        throw new Error("Wrong JSON format");
    }
    const url = data.value;
    return fetch(url);
}

export async function getFile(filePath: string) {
    const fileData = await getFileData(filePath);
    const buffer = Buffer.from(await fileData.arrayBuffer());

    return buffer.toString("base64");
}

export async function getFileBlob(filePath: string) {
    const fileData = await getFileData(filePath);

    return fileData.blob();
}
