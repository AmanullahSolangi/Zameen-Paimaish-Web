/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Constants for Sindhi Land Measurement
const GHONTA_SQFT = 1089;
const ACRE_SQFT = 43560;
const JURIB_SQFT = 21780;
const CHAUTHAI_SQFT = 10890;
const PURH_SQFT = 217.8;
const SQFT_TO_SQM = 10.7639;

// State
let currentSqFt = 0;

// Tab Switching
window.switchTab = (tabId: string) => {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('nav button').forEach(el => el.classList.remove('tab-active'));
  
  document.getElementById(`content-${tabId}`)?.classList.remove('hidden');
  document.getElementById(`tab-${tabId}`)?.classList.add('tab-active');
};

// Update Results UI
const updateResults = (sqft: number) => {
  if (isNaN(sqft)) sqft = 0;
  currentSqFt = sqft;
  
  const ghonta = sqft / GHONTA_SQFT;
  const acre = sqft / ACRE_SQFT;
  const jurib = sqft / JURIB_SQFT;
  const chauthai = sqft / CHAUTHAI_SQFT;
  const sqm = sqft / SQFT_TO_SQM;

  const setVal = (id: string, val: string) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setVal('res-ghonta', ghonta.toFixed(2));
  setVal('res-acre', acre.toFixed(2));
  setVal('res-jurib', jurib.toFixed(2));
  setVal('res-chauthai', chauthai.toFixed(2));
  setVal('res-sqft', Math.round(sqft).toLocaleString());
  setVal('res-sqm', sqm.toFixed(2));
};

// Reset App
window.resetApp = () => {
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.querySelectorAll('textarea').forEach(area => area.value = '');
  updateResults(0);
  window.calculateBasic();
};

// Tab 1: Basic Calculation
window.calculateBasic = () => {
  const w = parseFloat((document.getElementById('basic-width') as HTMLInputElement).value) || 0;
  const l = parseFloat((document.getElementById('basic-length') as HTMLInputElement).value) || 0;
  
  const sqft = w * l;
  updateResults(sqft);
  
  // Update Diagram
  const diagram = document.getElementById('basic-diagram') as HTMLElement;
  const display = document.getElementById('basic-area-display') as HTMLElement;
  
  if (w > 0 && l > 0) {
    const ratio = l / w;
    let width = 100;
    let height = 100 * ratio;
    
    // Constrain to container
    if (height > 200) {
      height = 200;
      width = 200 / ratio;
    }
    if (width > 200) {
      width = 200;
      height = 200 * ratio;
    }

    diagram.style.width = `${width}px`;
    diagram.style.height = `${height}px`;
    display.innerText = `${Math.round(sqft)} فوٽ`;
  } else {
    diagram.style.width = '100px';
    diagram.style.height = '100px';
    display.innerText = '0';
  }
};

// Tab 2: Irregular Calculation
window.calculateIrregular = () => {
  const w1 = parseFloat((document.getElementById('irr-w1') as HTMLInputElement).value) || 0;
  const w2 = parseFloat((document.getElementById('irr-w2') as HTMLInputElement).value) || 0;
  const l1 = parseFloat((document.getElementById('irr-l1') as HTMLInputElement).value) || 0;
  const l2 = parseFloat((document.getElementById('irr-l2') as HTMLInputElement).value) || 0;
  
  const avgW = (w1 + w2) / 2;
  const avgL = (l1 + l2) / 2;
  
  const sqft = avgW * avgL;
  updateResults(sqft);
};

// Tab 3: Converter
window.convertUnits = () => {
  const val = parseFloat((document.getElementById('conv-val') as HTMLInputElement).value) || 0;
  const unit = (document.getElementById('conv-from') as HTMLSelectElement).value;
  
  let sqft = 0;
  switch (unit) {
    case 'ghonta': sqft = val * GHONTA_SQFT; break;
    case 'acre': sqft = val * ACRE_SQFT; break;
    case 'jurib': sqft = val * JURIB_SQFT; break;
    case 'chauthai': sqft = val * CHAUTHAI_SQFT; break;
    case 'purh': sqft = val * PURH_SQFT; break;
    case 'sqft': sqft = val; break;
    case 'sqm': sqft = val * SQFT_TO_SQM; break;
  }
  
  updateResults(sqft);
};

// Tab 4: PDF Generation
window.generatePDF = () => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();
  
  const name = (document.getElementById('rep-name') as HTMLInputElement).value || '---';
  const village = (document.getElementById('rep-village') as HTMLInputElement).value || '---';
  const district = (document.getElementById('rep-district') as HTMLInputElement).value || '---';
  const khasro = (document.getElementById('rep-khasro') as HTMLInputElement).value || '---';
  const deh = (document.getElementById('rep-deh') as HTMLInputElement).value || '---';
  const taluko = (document.getElementById('rep-taluko') as HTMLInputElement).value || '---';
  const notes = (document.getElementById('rep-notes') as HTMLTextAreaElement).value || '---';
  
  const date = new Date().toLocaleDateString();

  // PDF Header
  doc.setFillColor(15, 110, 86);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Land Measurement Report', 105, 25, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 10, 50);
  
  // Owner Details
  doc.setFontSize(16);
  doc.text('Owner Details', 10, 65);
  doc.line(10, 67, 200, 67);
  
  doc.setFontSize(12);
  doc.text(`Owner Name: ${name}`, 10, 75);
  doc.text(`Village: ${village}`, 10, 82);
  doc.text(`District: ${district}`, 10, 89);
  doc.text(`Khasro No: ${khasro}`, 110, 75);
  doc.text(`Deh No: ${deh}`, 110, 82);
  doc.text(`Taluko: ${taluko}`, 110, 89);
  
  // Measurements
  doc.setFontSize(16);
  doc.text('Measurement Results', 10, 105);
  doc.line(10, 107, 200, 107);
  
  doc.setFontSize(12);
  doc.text(`Total Sq Feet: ${Math.round(currentSqFt).toLocaleString()}`, 10, 115);
  doc.text(`Total Sq Meters: ${(currentSqFt / SQFT_TO_SQM).toFixed(2)}`, 10, 122);
  doc.text(`Ghonta / Weso: ${(currentSqFt / GHONTA_SQFT).toFixed(2)}`, 10, 129);
  doc.text(`Acre: ${(currentSqFt / ACRE_SQFT).toFixed(2)}`, 110, 115);
  doc.text(`Jurib: ${(currentSqFt / JURIB_SQFT).toFixed(2)}`, 110, 122);
  doc.text(`Chauthai: ${(currentSqFt / CHAUTHAI_SQFT).toFixed(2)}`, 110, 129);
  
  // Notes
  doc.setFontSize(16);
  doc.text('Notes', 10, 145);
  doc.line(10, 147, 200, 147);
  doc.setFontSize(12);
  const splitNotes = doc.splitTextToSize(notes, 180);
  doc.text(splitNotes, 10, 155);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by Sindhi Land Measurement App', 105, 285, { align: 'center' });
  
  doc.save(`Land_Report_${name.replace(/\s+/g, '_')}.pdf`);
};

// PWA Install Logic
let deferredPrompt: any;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn?.classList.remove('hidden');
});

installBtn?.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.classList.add('hidden');
    }
    deferredPrompt = null;
  }
});

// Initial Load
window.addEventListener('DOMContentLoaded', () => {
  window.calculateBasic();
  console.log('Sindhi Land App Ready');
});

// Expose functions to window
declare global {
  interface Window {
    switchTab: (tabId: string) => void;
    calculateBasic: () => void;
    calculateIrregular: () => void;
    convertUnits: () => void;
    generatePDF: () => void;
    resetApp: () => void;
  }
}

console.log('Sindhi Land App Initialized');
