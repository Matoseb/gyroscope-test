// vite.config.js
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {

    server: {
        port: 443,
    },

    plugins: [
        basicSsl()
    ]
}