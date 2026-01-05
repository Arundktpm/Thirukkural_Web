//Global Variables
const TagButtonEl = document.getElementById("Tagbtn");
const KuralContent = document.getElementById("mainpannel");


//kural content Html Elemnt built function
function kuralBox() {
    const kural_box = document.createElement("div");
    kural_box.className = "kural-container";
    kural_box.id = "pannel";
    KuralContent.append(kural_box)
}
//creaate Html Elements 
function createEl(text, kural_id) {
    const kural = text.split("$");
    const divbgEl = document.createElement("div");
    divbgEl.setAttribute("data-kural_id", kural_id)
    divbgEl.className = "text-bg";
    const divEl = document.createElement("div");
    divEl.className = "text";
    divEl.innerHTML = `<h5>${kural[0]}</h5><h5>${kural[1]}</h5>`;
    divbgEl.append(divEl);
    document.querySelector("#pannel").append(divbgEl);
}
//Athikaarm title stored and fetched
async function Get_Athikaaram_Title() {
    let Titles = [];
    if (localStorage.getItem("Athikaaram_titles")) {
        Titles = JSON.parse(localStorage.getItem("Athikaaram_titles"));
        console.log("Title get from localstorage!");
    }
    else {
        const fetch_athikaaram = await fetch("https://thirukkural.senkanthal.org/athikaaram").then(res => res.json());
        fetch_athikaaram.forEach((res) => {
            Titles.push(res.athikaaram);
        });
        localStorage.setItem("Athikaaram_titles", JSON.stringify(Titles));
        console.log("Title get from Api!");
    }
    return Titles;
}
Get_Athikaaram_Title()
// Create Title for show on kural chapter
function CreateTitleEl() {
    let kuralCard = [...document.querySelectorAll(".text-bg")];
    if (kuralCard) {
        let athikaaram_id = kuralCard.filter((card) => (card.dataset.kural_id - 1) % 10 == 0);
        athikaaram_id.forEach((card) => {
            //global index for athikaram 
            let Index = ((Number(card.dataset.kural_id) + 9) / 10) - 1;

            let athikaaramEl = document.createElement("h4");
            athikaaramEl.className = "athikaaram_title";
            athikaaramEl.classList.add("Athikaaram");
            athikaaramEl.setAttribute("data-athikaarm_id", Index + 1)
            card.before(athikaaramEl);
            Get_Athikaaram_Title().then((res) => {
                athikaaramEl.textContent = res[Index];
            });
        });
        let Paal_id = document.querySelectorAll(".Athikaaram");
        //paalEl func()
        function paalELMake(text, connect) {
            let paalEl = document.createElement("h4");
            paalEl.className = "paal_title";
            paalEl.textContent = text;
            connect.before(paalEl);
        }
        Paal_id.forEach((paal) => {
            let paal_id = paal.dataset.athikaarm_id;
            if (paal_id == 1) {
                console.log(paal);
                paalELMake("அறத்துப்பால்", paal);
            }
            if (paal_id == 39) {
                paalELMake("பொருட்பால்", paal);
            }
            if (paal_id == 109) {
                paalELMake("காமத்துப்பால்", paal);;
            }
        });
    }
}
//main function for creating kural from API
async function APIKuralFetched(path) {
    try {
        KuralContent.innerHTML = "";
        kuralBox();
        const APICall = await fetch("https://thirukkural.senkanthal.org/" + path);
        const FetchedData = await APICall.json();
        // Error code capture
        // Check if the response is ok (status 200-299)
        if (!APICall.ok) {
            throw (`HTTP error! status: ${APICall.status}`);
        }
        KuralContent.classList.remove("ErroMsg");

        FetchedData.forEach((Item) => {

            createEl(Item.kural, Item.id);
        })
        CreateTitleEl();
        //Add animation For kural Cards
        kuralCardsAnimate();
    }
    catch (error) {
        KuralContent.classList.add("ErrorMsg");
        if (error.name === "TypeError") {
            KuralContent.textContent = "Failed to Fetch Check internet Connection";
        }
        else {
            KuralContent.textContent = error;
        }
        console.log(error);
    }
}
//Event Listeners function for button
function TagHandler(event) {
    //listener for button
    if (event.target.tagName === "BUTTON") {
        const Target = event.target.value;
        const apipath = ["paal/1/all", "paal/2/all", "paal/3/all", "kural"];
        switch (Target) {
            case "paal-id1":
                APIKuralFetched(apipath[0]);
                break;
            case "paal-id2":
                APIKuralFetched(apipath[1]);
                break;
            case "paal-id3":
                APIKuralFetched(apipath[2]);
                break;
            case "kura-id-all":
                APIKuralFetched(apipath[3]);
                break;
            case "random-atikaaram":
                RandomKurals();
                break;
            default:
                event.preventDefault();
        }
    }
}
//addEventListener
TagButtonEl.addEventListener("click", TagHandler);
//random kural elements title function
function Default_page_title(athikaaram_id) {
    if (athikaaram_id) {
        let athikaaramEl = document.createElement("h4");
        athikaaramEl.className = "athikaaram_title";
        Get_Athikaaram_Title().then((res) => {
            athikaaramEl.textContent = res[athikaaram_id];
            document.querySelector("#pannel").before(athikaaramEl);
        });

        let paalEl = document.createElement("h4");
        paalEl.className = "paal_title";
        KuralContent.prepend(paalEl)
        //random kural
        if (athikaaram_id <= 38) {
            paalEl.textContent = "அறத்துப்பால்";
        } else if (athikaaram_id >= 39 && athikaaram_id <= 70) {
            paalEl.textContent = "பொருட்பால்";
        } else {
            paalEl.textContent = "காமத்துப்பால்";
        }
    }
};
//default kural content showsCase Function
async function RandomKurals() {
    try {
        KuralContent.innerHTML = "";
        kuralBox();
        const RandomId = Math.floor(Math.random() * 132);
        const APICall = await fetch("https://thirukkural.senkanthal.org/athikaaram/" + (RandomId + 1) + "/all");
        const ApiFetched = await APICall.json();

        // Check if the response is ok (status 200-299)
        if (!APICall.ok) {
            throw (`HTTP error! status: ${APICall.status}`);
        }
        KuralContent.classList.remove("ErrorMsg");

        ApiFetched.forEach((kurals) => {
            createEl(kurals.kural, kurals.id);
        });

        Default_page_title(RandomId + 1);
        //add kural card animation
        kuralCardsAnimate();
    }
    catch (error) {
        KuralContent.classList.add("ErrorMsg");
        if (error.name === "TypeError") {
            KuralContent.textContent = "Failed to Fetch Check internet Connection";
        }
        else {
            KuralContent.textContent = error;
        }
        console.log(error);
    }
}
RandomKurals();
//navbar controls MobileScreen
const menucontroll = document.querySelector(".controll-menubox");
const menuconrollbox = document.querySelectorAll(".controll-menubox .box");
menucontroll.addEventListener('click', () => {
    menuconrollbox.forEach((elem) => {
        elem.classList.toggle('change')
    });
    document.querySelector(".nav_bar").classList.toggle("navshow");
    menucontroll.classList.toggle("movebox");
});
//kural cards animate
function kuralCardsAnimate() {
    const kural = document.querySelectorAll(".text-bg");
    let kuralobserver = new IntersectionObserver((entries) => {
        entries.forEach((data) => {
            if (data.isIntersecting) {
                data.target.classList.add('show')
            }
            else {
                data.target.classList.remove('show')
            }
        })
    });
    kural.forEach((data) => {
        kuralobserver.observe(data);
    })
}
