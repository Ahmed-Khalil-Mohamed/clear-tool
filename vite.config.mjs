import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({plugins:[react({jsxImportSource:'@clear/i18n'})],resolve:{alias:{'@clear/i18n/jsx-runtime':fileURLToPath(new URL('./src/localized-jsx.js',import.meta.url)),'@clear/i18n/jsx-dev-runtime':fileURLToPath(new URL('./src/localized-jsx.js',import.meta.url))}},base:'./',build:{outDir:'dist'},server:{host:'127.0.0.1',port:5198,strictPort:true}});
