async function return_REST_JSON(url){
    return new Promise((resolve, reject) => {
        const options = {
            hostname: new URL(url).hostname,
            path: new URL(url).pathname + new URL(url).search,
            method: 'GET',
            headers: {
                'accept': 'application/json',
                //
                // Get a FREE API key at koinos.pro
                //
                'X-API-KEY': process.env.KOINOS_PRO_API_KEY
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData.value);
                } catch (error) {
                    reject(new Error('Failed to parse JSON response: ' + error.message));
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error:', error);
        });

        req.end();
    });
}