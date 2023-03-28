# Boilerplate Games Gamindo ⚡

Boilerplate project built on top of `Thunder` framework.

## First usage

First of all run `npm install` then `npm run prepare`

Open `.env` file and change `VITE_CODE` with a code project (make unique across projects), compile `VITE_NAME` and `VITE_DESCRIPTION`, if necessary change `VITE_WIDTH` and `VITE_HEIGHT` accordingly with game resolution.

To populate the `development` and `production` environments create 2 files, `.env.development` and `.env.production` and populate here all the endpoint variables data. **DO NOT
** populate endpoint data in `.env` file.

## How to run

To run the project use `npm run dev`

## Progressive Web App

PWA are enabled only in production and if the `VITE_PWA` end variable is set to true.
Remember to modify the `public/manifest.json` file with the app specific data before build.

## Secure commits

To ensure standardized code and functional commit is used `husky` as pre-commit hook, before each commit is automatically executed `pretty-quick` to verify the code consistency and `npm run test` to run unit test and ensure that all is working as expected.

## Environment variables

To have intellisense for environment variables available add the declaration in `src/vite-env.d.tsd`, something like:

```typescript
interface ImportMetaEnv {
    ...
    readonly VITE_DATA: string;
}
```

p.s: Variables must start with `VITE_`

## Assets

Final assets could be found in `public` folder.
Atlas can be build with `npm run atlas`, atlas files have to be placed insite `atlas` folder. To create sectorial assets you can create other folder inside `assets`.
**Example:**
assets/test/image_1.png
assets/test/image_2.png

npm run altas

Now you can fint `test.json` and `test.png` atlas data isnide `public/assets`

Atlas settings could be configured in `atlasConfig.json`.

Similar is for bitmap font, you can create sdf bitmap font by using `npm run bitmapFont`.
The script have a look inside `bitmapFont` folder and create a bitmap font foreach ttf file inside the folder.
You can customize settings in `bitmapFontConfig.json`.

Audio file have to be added to `public/sfx` folder.
