const generateBMFont = require("msdf-bmfont-xml");
const path = require("path");
const fs = require("fs");

// Options available here: https://github.com/odrick/free-tex-packer-core
let fileOptions = JSON.parse(fs.readFileSync(`bitmapFontConfig.json`));
const options = {
    ...fileOptions,
    extensions: new Set(["ttf"]),
};

let fonts = [];

if (!fs.existsSync(options.destination)) {
    fs.mkdirSync(options.destination);
}

function find_files(path = "") {
    let files = fs.readdirSync(`${options.basePath}/${path}`, { withFileTypes: true });

    // Read all subfolders
    for (let i of files) {
        if (i.isFile() && is_font(i.name)) {
            // Add to files
            fonts.push({
                path: `${options.basePath}/${path}${path.length > 0 ? "/" : ""}${i.name}`,
                name: i.name.split(".")[0],
            });
        }
    }
}

function is_font(file) {
    return options.extensions.has(path.extname(file).slice(1).toLowerCase());
}

find_files();
startGeneration();

async function startGeneration() {
    for (const font of fonts) {
        await generateBitmapFont(font);
    }
}

async function generateBitmapFont(font) {
    return new Promise((res, rej) => {
        generateBMFont(
            font.path,
            {
                outputType: "xml",
                charset: options[font.name]?.charset || options.charset,
                fontSize: options[font.name]?.fontSize || 32,
                fieldType: options[font.name]?.fieldType || options.fieldType,
                "smart-size": true,
                smartSize: true,
            },
            (error, textures, font) => {
                if (error) throw error;

                textures.forEach(async (texture, index) => {
                    await fs.writeFile(
                        `${options.destination}/${texture.filename.split("/")[1]}.png`,
                        texture.texture,
                        (err) => {
                            if (err) throw err;
                        },
                    );
                });

                fs.writeFile(`${options.destination}/${font.filename.split("/")[1]}`, font.data, (err) => {
                    if (err) throw err;

                    res();
                });
            },
        );
    });
}
