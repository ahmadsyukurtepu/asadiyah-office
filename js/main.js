// js/main.js

let gapiReady = false;

// 1. Inisialisasi Google API Client
function initGAPI() {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
        gapi.load('client', async () => {
            try {
                await gapi.client.init({
                    apiKey: CONFIG.API_KEY,
                    discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
                });
                gapiReady = true;
                updateStatus(true);
                
                // Panggil fungsi otomatis tergantung halaman
                if (document.getElementById('riwayatTable')) loadRiwayat();
                if (document.getElementById('bodyTabelSantri')) loadDataSantri();
            } catch (e) {
                console.error("GAPI Init Error:", e);
                updateStatus(false);
            }
        });
    };
    document.head.appendChild(script);
}

function updateStatus(isOnline) {
    const dot = document.getElementById('statusDot');
    const msg = document.getElementById('statusMsg');
    if (dot && msg) {
        dot.className = isOnline ? "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" : "w-2 h-2 rounded-full bg-red-500";
        msg.innerText = isOnline ? "SISTEM ONLINE" : "SISTEM OFFLINE";
    }
}

// 2. Logika Simpan Surat (Koneksi ke Web App GAS)
async function simpanSuratCloud() {
    const fileInput = document.getElementById('fileSurat');
    const btn = document.getElementById('btnSimpanSurat');
    const file = fileInput.files[0];

    if (!file || !document.getElementById('noSurat').value) {
        alert("Mohon lengkapi data dan pilih file!");
        return;
    }

    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> PROSES...`;
    btn.disabled = true;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result.split(',')[1];
        const payload = {
            base64: base64Data,
            name: `${document.getElementById('jenisSurat').value}_${document.getElementById('noSurat').value}.pdf`,
            jenis: document.getElementById('jenisSurat').value,
            nomor: document.getElementById('noSurat').value,
            tanggal: document.getElementById('tglSurat').value,
            tujuan: document.getElementById('tujuanSurat').value,
            perihal: document.getElementById('perihalSurat').value,
            admin: "Officer" // Bisa dinamis jika ada sistem login
        };

        try {
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert("✅ Arsip Berhasil Disimpan!");
                location.reload(); // Refresh untuk update tabel
            }
        } catch (error) {
            alert("Gagal terhubung ke Server!");
        } finally {
            btn.innerHTML = "UPLOAD & SIMPAN";
            btn.disabled = false;
        }
    };
    reader.readAsDataURL(file);
}

// 3. Logika Ambil Riwayat Surat
async function loadRiwayat() {
    if (!gapiReady) return;
    const tbody = document.getElementById('riwayatTable');
    try {
        const resp = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: CONFIG.DB_SURAT,
            range: 'Sheet1!A2:H'
        });
        const rows = (resp.result.values || []).reverse().slice(0, 10);
        tbody.innerHTML = rows.map(row => `
            <tr class="border-b hover:bg-gray-50 text-[11px]">
                <td class="p-4 font-bold text-emerald-800">${row[2]}</td>
                <td class="p-4">${row[1]}</td>
                <td class="p-4 font-black">${row[0]}</td>
                <td class="p-4 truncate max-w-[150px]">${row[3]}</td>
                <td class="p-4 flex gap-2">
                    <a href="${row[7]}" target="_blank" class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><i class="fas fa-eye text-[10px]"></i></a>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">Gagal memuat data.</td></tr>';
    }
}

// 4. Preview PDF
function previewPDF(input) {
    const frame = document.getElementById('pdfFrame');
    const placeholder = document.getElementById('pdfPlaceholder');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            frame.src = e.target.result;
            frame.classList.remove('hidden');
            if (placeholder) placeholder.classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Jalankan GAPI saat halaman dimuat
window.onload = initGAPI;
