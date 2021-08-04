function redirect() {
    fetch('/createroom', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        location.href = '/' + data.key
    })
        .catch((e) => {
            console.log(e)
        })
}
function join(){
    const inp = document.getElementById('roomId')
    if (!inp.value) return
    location.href = '/'+inp.value
}
document.getElementById('roomId').addEventListener('keyup', (e)=>{
    console.log(e.key)
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("joinButton").click();
    }
})