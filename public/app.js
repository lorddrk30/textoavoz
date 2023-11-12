document.getElementById('ttsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const text = document.getElementById('inputText').value;

    document.getElementById('loader').style.display = 'block';

    fetch('/synthesize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
    .then(response => response.json())  
    .then(data => {
        const audioURL = data.audioUrl; 
        document.getElementById('audioResult').src = audioURL;

        document.getElementById('loader').style.display = 'none';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loader').style.display = 'none';
    });
});
