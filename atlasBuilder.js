const texturePacker = require("free-tex-packer-core");
const path = require("path");
const fs = require("fs");

// Options available here: https://github.com/odrick/free-tex-packer-core
let fileOptions = JSON.parse(fs.readFileSync(`atlasConfig.json`));
const options = {
    ...fileOptions,
    extensions: new Set(["png", "jpg", "jpeg"]),
};

let images = [];

if (!fs.existsSync(options.destination)) {
    fs.mkdirSync(options.destination);
}

function find_files(path = "") {
    let files = fs.readdirSync(`${options.basePath}/${path}`, { withFileTypes: true });
    // Read all subfolders
    for (let i of files) {
        if (i.isDirectory()) {
            // Look inside
            find_files(`${path.length > 0 ? path + "/" : ""}${i.name}`);

            // Create a single atlas for every folder found
            if (options.singleFolder) {
                options.textureName = i.name;

                texturePacker(images, options, (files, error) => {
                    if (error) {
                        console.error("Packaging failed", error);
                    } else {
                        for (let item of files) {
                            fs.writeFileSync(`${options.destination}/${item.name}`, item.buffer);
                        }
                    }
                });

                images = [];
            }
        } else if (i.isFile() && is_image(i.name)) {
            // Add to files
            images.push({
                path: `${path}${path.length > 0 ? "/" : ""}${i.name}`,
                contents: fs.readFileSync(`${options.basePath}/${path}/${i.name}`),
            });
        }
    }
}

function is_image(file) {
    return options.extensions.has(path.extname(file).slice(1).toLowerCase());
}

find_files();

if (images.length > 0) {
    texturePacker(images, options, (files, error) => {
        if (error) {
            console.error("Packaging failed", error);
        } else {
            for (let item of files) {
                fs.writeFileSync(`${options.destination}/${item.name}`, item.buffer);
            }
        }
    });
}
