function randomText(){
    var text = ("Join")
    letters =text[Math.floor(Math.random() * text.length)];
    return letters;
}

function rain() {
    let cloud = document.querySelector('.cloud');
    let e = document.createElement('div');
    e.classList.add('drop');
    cloud.appendChild(e);

    let left = Math.floor(Math.random() * 300);
    let size = Math.random() * 0.5;
    let duration = Math.random() * 1;

    e.innerText = randomText();
    e.style.left = left + 'px';
    e.style.fontSize = 2 + size + 'em';
    e.style.animationDuration = 2 + duration + 's';
    e.style.color = 'rgb(41, 171, 226)';
    e.style.filter = 'drop-shadow(0 0 10px rgb(41, 171, 226))'; 

    setTimeout(function(){
        cloud.removeChild(e);
    }, 2000);
}

setInterval(function(){
    rain()
},20);

