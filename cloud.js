function randomText(){
    let text = ("1010101011010101MATRIXアイウエカキクケコセタトナヌネハヒフヘマミムメモヤユヨラリルレロワヲングゴズゼゾダデドバビブベパピプペ")
    letters =text[Math.floor(Math.random() * text.length)];
    return letters;
}

function rain() {
    let cloud = document.querySelector('.cloud');
    let e = document.createElement('div');
    e.classList.add('drop');
    cloud.appendChild(e);

    let left = Math.floor(Math.random() * 600);
    let size = Math.random() * 0.8;
    let duration = Math.random() * 4;

    e.innerText = randomText();
    e.style.left = left + 'px';
    e.style.fontSize = 1.1 + size + 'em';
    e.style.animationDuration = 1555 + duration + 'ms';
    e.style.color = 'rgba(62, 226, 41, 0.9)';
    e.style.filter = 'drop-shadow(0 0 10px rgba(21, 214, 31, 0.7))'; 

    setTimeout(function(){
        cloud.removeChild(e);
    }, 2444);
}

setInterval(function(){
    rain()
},33);

