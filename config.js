/**
 * CONFIGURATION SYSTEM - KANTOR PUSAT AS'ADIYAH
 * Update Terakhir: 2026-02-05
 */

const CONFIG = {
    // URL Google Apps Script (Web App URL)
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbylLE6iG_jjX-IvjAyPDwJUMS7BqJ3OHxL25Ph5DSOnRzJqv0Kn9zGEvkoKf-PN3bhlZg/exec',
    
    // ID Spreadsheet (Pastikan izin akses: Anyone with the link as Viewer/Editor)
    DB: {
        LOGIN: '1HTdBcYKE1ztWtj1u_6rtC0xAmE-Mknl_4mEG6og1xPg',
        
        // Modul Persuratan
        SURAT: '1BrvgSrI_4PdTZx95jbGY_H21bSHZpl0fduNEfPRZlr0',
        
        // Modul Data Santri (Pusat & Cabang Terpisah)
        SANTRI_PUSAT: '1E_940vnYcGQAgyB2mLmUFtdSmKCJ-ZXmqv7q4-Dr6yI',
        SANTRI_CABANG: '1SD5AYyDYBUU892NoVZiyr6SS-j2XkDHzHSWkfyuf7eA',
        
        // Modul Kepegawaian / SDM
        PEGAWAI: '1LUnBymrWCxc5uWVXH3LGUhedrbQHaq1dvTRDsY707fg',
        
        // Modul Agenda & Disposisi
        AGENDA: '1YOJEBteDe_DYeLq31hw1VUPtxfV8rDdlpZ-XsBjMFYk'
    }
};

// Mencegah perubahan objek secara tidak sengaja di browser console
Object.freeze(CONFIG);
