let prekes = JSON.parse(localStorage.getItem("prekes")) || [];
let pasirinktasId = null;


// HTML ELEMENTAI
const forma = document.getElementById("prekesForma");
const idLaukas = document.getElementById("prekesId");
const pavadinimoLaukas = document.getElementById("prekesPavadinimas");
const kiekioLaukas = document.getElementById("prekesKiekis");

const lentele = document.getElementById("prekiuLentele");
const krepselis = document.getElementById("krepselioLentele");


// PREKIŲ IŠSAUGOJIMAS
function issaugoti() {
    localStorage.setItem("prekes", JSON.stringify(prekes));
}


// PREKIŲ RODYMAS
function rodytiPrekes() {
    lentele.innerHTML = "";
    krepselis.innerHTML = "";

    prekes.forEach(function(preke) {
        const eilute = document.createElement("tr");

        eilute.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;

        eilute.cells[0].textContent = preke.id;
        eilute.cells[1].textContent = preke.pavadinimas;
        eilute.cells[2].textContent = preke.kiekis;

        const redaguoti = document.createElement("button");
        redaguoti.textContent = "Redaguoti";

        redaguoti.onclick = function() {
            idLaukas.value = preke.id;
            pavadinimoLaukas.value = preke.pavadinimas;
            kiekioLaukas.value = preke.kiekis;

            pasirinktasId = preke.id;
            idLaukas.disabled = true;
        };

        const trinti = document.createElement("button");
        trinti.textContent = "Ištrinti";
        trinti.className = "trinti";

        trinti.onclick = function() {
            prekes = prekes.filter(function(p) {
                return p.id !== preke.id;
            });

            if (pasirinktasId === preke.id) {
                isvalytiForma();
            }

            issaugoti();
            rodytiPrekes();
        };

        eilute.cells[3].append(redaguoti, trinti);
        lentele.appendChild(eilute);
    });
}


// PREKĖS PRIDĖJIMAS
forma.onsubmit = function(event) {
    event.preventDefault();

    const id = idLaukas.value.trim();
    const pavadinimas = pavadinimoLaukas.value.trim();
    const kiekis = Number(kiekioLaukas.value);

    if (!id || !pavadinimas || !Number.isInteger(kiekis) || kiekis < 1) {
        alert("Įvesk teisingus duomenis!");
        return;
    }

    if (prekes.some(p => p.id === id)) {
        alert("Tokia prekė jau egzistuoja!");
        return;
    }

    prekes.push({
        id: id,
        pavadinimas: pavadinimas,
        kiekis: kiekis
    });

    issaugoti();
    isvalytiForma();
    rodytiPrekes();
};


// PREKĖS ATNAUJINIMAS
document.getElementById("atnaujintiMygtukas").onclick = function() {
    if (pasirinktasId === null) {
        alert("Pirmiausia pasirink prekę redagavimui!");
        return;
    }

    const pavadinimas = pavadinimoLaukas.value.trim();
    const kiekis = Number(kiekioLaukas.value);

    if (!pavadinimas || !Number.isInteger(kiekis) || kiekis < 1) {
        alert("Įvesk teisingą pavadinimą ir kiekį!");
        return;
    }

    const preke = prekes.find(p => p.id === pasirinktasId);

    if (preke) {
        preke.pavadinimas = pavadinimas;
        preke.kiekis = kiekis;

        issaugoti();
        isvalytiForma();
        rodytiPrekes();

        alert("Prekė atnaujinta!");
    }
};


// PREKĖS PAIEŠKA
document.getElementById("ieskotiMygtukas").onclick = function() {
    const id = document.getElementById("paieskosId").value.trim();

    krepselis.innerHTML = "";

    const preke = prekes.find(p => p.id === id);

    if (!preke) {
        alert("Prekė nerasta!");
        return;
    }

    const eilute = krepselis.insertRow();

    [preke.id, preke.pavadinimas, preke.kiekis].forEach(function(duomuo) {
        eilute.insertCell().textContent = duomuo;
    });

    const veiksmai = eilute.insertCell();

    const trinti = document.createElement("button");
    trinti.textContent = "Ištrinti";
    trinti.className = "trinti";

    trinti.onclick = function() {
        prekes = prekes.filter(p => p.id !== preke.id);

        if (pasirinktasId === preke.id) {
            isvalytiForma();
        }

        issaugoti();
        rodytiPrekes();
    };

    veiksmai.appendChild(trinti);
};


// FORMOS IŠVALYMAS
function isvalytiForma() {
    forma.reset();
    pasirinktasId = null;
    idLaukas.disabled = false;
}

document.getElementById("isvalytiMygtukas").onclick = isvalytiForma;


// PRADINIS PREKIŲ RODYMAS
rodytiPrekes();