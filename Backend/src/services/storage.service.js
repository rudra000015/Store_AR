import ImageKit from "@imagekit/nodejs"
import { config } from "../config/config.js"


const Client = new ImageKit({
    privateKey:config.IMAGEKIT_PVT_KEY
})


export async function uploadImage({buffer,fileName,folder ="snitch"}) {
    const result = await Client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}