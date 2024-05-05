const readlineSync = require('readline-sync');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

function quote(input) {
    return new Promise((resolve, reject) => {
        fetch('https://jagokata.com/kata-bijak/kata-' + input.replace(/\s/g, '_') + '.html?page=1')
            .then(res => res.text())
            .then(res => {
                const $ = cheerio.load(res)
                let data = []
                $('div[id="main"]').find('ul[id="citatenrijen"] > li').each(function (index, element) {
                    let x = $(this).find('div[class="citatenlijst-auteur"] > a').text().trim()
                    let y = $(this).find('span[class="auteur-beschrijving"]').text().trim()
                    let z = $(element).find('q[class="fbquote"]').text().trim()
                    data.push({ author: x, bio: y, quote: z })
                })
                data.splice(2, 1)
                if (data.length == 0) return resolve({ status: false })
                resolve({ status: true, data })
            }).catch(reject)
    })
}

function getRandomText(id) {
    var raNdText = id[Math.floor(Math.random() * id.length)];
    return raNdText;
}

const loop = async () => {
    console.log('\nMasukkan quote atau tokoh yang dicari: ')
    const input = readlineSync.prompt();
    try {
        const quotex = await quote(input || getRandomText(random));
        if (!quotex.status) throw new Error('Data tidak ditemukan');
        const txt = quotex.data.map(q => `“${q.quote}”\n\n- ${q.author}`).join('\n\n');
        await fs.promises.writeFile('quote.txt', txt);
        console.log("Data tersimpan di file quote.txt");
    } catch (err) {
        console.error("Terjadi kesalahan:", err.message);
    }
    loop(); // Panggil rekursif untuk memulai kembali loop
}

const random = [
    'cinta',
    'damai',
    'boy candra',
    'fiersa besari',
    'tenang',
    'belajar'
]



loop(); // Panggil loop untuk memulai eksekusi