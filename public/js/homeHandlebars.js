let btnsShow = document.querySelectorAll('.btnShow')

for(let btn of btnsShow){
    btn.addEventListener("click", showItem)

    function showItem(Event){
        let child = Event.target
        let father = child.parentNode
        let hideP = father.querySelectorAll(".hideP")
        for(let p of hideP){
            p.classList.toggle("active")
        }}   
    }