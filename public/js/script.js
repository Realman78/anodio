const socket = io('/')
const rmh1 = document.getElementById('roomh1')
rmh1.textContent = `ROOM ID: ${ROOM_ID}`

function copy(){
    var temp = document.createElement("textarea")
    document.body.appendChild(temp);
    temp.value= rmh1.textContent.substr(9)
    temp.select();
    document.execCommand("copy");
    var popup = document.getElementById("myPopup")
    popup.classList.toggle("show")
    setTimeout(() => {
        popup.classList.toggle("show")
    }, 3000);
    temp.remove()
}

const myPeer = new Peer(undefined, {
    port: 443,
})

navigator.mediaDevices.getUserMedia({
    audio: true
}).then(stream =>{
    console.log('hoke')
    let newUserImg = document.createElement('img')
    newUserImg.src = './phone-symbol-2.png'
    document.querySelector('.imgContainer').append(newUserImg)

    myPeer.on('call', call => {
        newUserImg = document.createElement('img')
        newUserImg.src = './phone-symbol-2.png'
        document.querySelector('.imgContainer').append(newUserImg)
        call.answer(stream)
    })

    socket.on("user-connected", (userId) => {
      setTimeout(function () {
        newUserImg = document.createElement('img')
        newUserImg.src = './phone-symbol-2.png'
        document.querySelector('.imgContainer').append(newUserImg)
        connectToNewUser(userId, stream)
      }, 1000)
    })
    socket.on('user-left', ()=>{
        console.log('user left')
        document.querySelector('img').remove()
    })

})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream)
    const audio = document.createElement('audio')
    call.on('stream', userVideoStream => {
        console.log('heokok')
        addVideoStream(audio, userVideoStream)
    })
    call.on('close', ()=>{
        audio.remove()
        document.querySelector('img').remove()
    })
}


function addVideoStream(video, stream){
    console.log('heok')
    video.srcObject = stream
    video.addEventListener('loadedmetadata', ()=>{
        video.play()
    })
    document.body.append(video)

}
