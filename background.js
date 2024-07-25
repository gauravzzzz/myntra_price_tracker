chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('checkPrices', { periodInMinutes:  1440});
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkPrices') {
        setTimeout(checkPrices, Math.random() * 1); // Random delay between 0 and 60 seconds
    }
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("mess")
    if (message.action === 'addProduct') {
        let { products } = await chrome.storage.sync.get('products');
        console.log(products);
        if (!products) {
            products = [];
        }
        console.log(message.url)
        console.log(message.email)
        console.log(message.initialPrice)
        products.push({ url: message.url, email: message.email, initialPrice: message.initialPrice });
        await chrome.storage.sync.set({ products });
        sendResponse({ status: 'success' });
    }
});


async function checkPrices() {
    const { products } = await chrome.storage.sync.get('products');
    if (products && products.length > 0) {
        for (const product of products) {
            console.log(product);
            try {
                const currentPrice = await fetchPriceFromServer(product.url);
                console.log(currentPrice);
                if (currentPrice != null) {
                    if (product.initialPrice > currentPrice) {
                        sendNotification(product.email, currentPrice, product.url);
                        product.initialPrice = currentPrice;
                    }
                } else {
                    console.error('Price element not found for URL:', product.url);
                }
            } catch (error) {
                console.error('Error fetching the product page for URL:', product.url, error);
            }
        }
        await chrome.storage.sync.set({ products });
    }
}
async function fetchPriceFromServer(url) {
    try{
    const response = await fetch('http://localhost:3000/price', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    if(!response.ok)
        return null;
    const data = await response.json();
    console.log(data);
    return data.price;
}catch(error){
    console.log("Error while fetching current price from server ", error);
    }
}

function sendNotification(email, currentPrice, url) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Price Drop Alert!',
        message: `The price has dropped to ₹${currentPrice} for your tracked product.`,
        contextMessage: url
    });
    console.log(`Notification sent to ${email} about price drop to ₹${currentPrice} for ${url}`);
}