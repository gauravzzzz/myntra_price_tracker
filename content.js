alert("show");
if (window.location.href.includes('myntra.com')) {
    console.log("content script loaded");
    const plusButton = document.createElement('button');
    plusButton.innerText = '+ Track Price';
    plusButton.style.top = '10px';
    plusButton.style.right = '10px';
    plusButton.style.zIndex = 1000;
    plusButton.onclick = () => {
        const email = prompt('Enter your email for price drop notifications:');
        const priceElement = document.querySelector('.pdp-price');
        const initialPrice = parseFloat(priceElement.textContent.replace('₹', ''));
        if (email) {
            chrome.runtime.sendMessage({
                action: 'addProduct',
                url: window.location.href,
                email: email,
                initialPrice: initialPrice
            }, (response) => {
                if (response.status === 'success') {
                    alert('Product added for price tracking!');
                } else {
                    alert('Failed to add product for tracking.');
                }
            });
        }
    };

    document.querySelector('.pdp-price-info').appendChild(plusButton);
}
