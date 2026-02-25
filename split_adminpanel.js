const fs = require('fs');
const path = require('path');

const srcCode = fs.readFileSync(path.join(__dirname, 'app/components/Adminpanel.jsx.bak'), 'utf-8');

// The markers based on the file contents
const markers = [
    { key: "imports", start: 'import { useState', end: '// ╔════════' },
    { key: "context", start: 'const StoreContext', end: '// ─── UTILS' },
    { key: "utils", start: 'const uid', end: '// ─── CONSTANTS' },
    { key: "constants", start: 'const DURATION_OPTIONS', end: '// ─── STYLE MAPS' },
    { key: "styleMaps", start: 'const DAY_GRAD', end: '// ─── FACTORIES' },
    { key: "factories", start: 'const emptyMasterActivity', end: '// ─── RESOLVE HELPERS' },
    { key: "resolve", start: 'const resolveActivity', end: '// ─── MOCK DATA' },
    { key: "mock", start: 'const INIT_ACTIVITIES', end: '// ─── BASE UI PRIMITIVES' },
    { key: "ui", start: 'const Badge', end: '// ─── ICONS' },
    { key: "icons", start: 'const Ic =', end: '// ─── IMAGE UPLOADER' },
    { key: "imageUploader", start: 'const ImageUploader', end: '// ─── MASTER ACTIVITY FORM' },
    { key: "maForm", start: 'const MasterActivityForm', end: '// ─── MASTER HOTEL FORM' },
    { key: "mhForm", start: 'const MasterHotelForm', end: '// ─── MASTER ACTIVITIES PAGE' },
    { key: "maPage", start: 'const MasterActivitiesPage', end: '// ─── MASTER HOTELS PAGE' },
    { key: "mhPage", start: 'const MasterHotelsPage', end: '// ─── ACTIVITY PICKER' },
    { key: "actPicker", start: 'const ActivityPicker', end: '// ─── HOTEL PICKER' },
    { key: "hotelPicker", start: 'const HotelPicker', end: '// ─── SUMMARISED VIEW' },
    { key: "sumView", start: 'const SummarisedView', end: '// ─── DAY DESCRIPTION FIELD' },
    { key: "dayDesc", start: 'const DayDescriptionField', end: '// ─── ITINERARY BUILDER' },
    { key: "itBuilder", start: 'const ItineraryBuilder', end: '// ─── EDITABLE LIST ITEM' },
    { key: "edList", start: 'const EditableListItem', end: '// ─── INCLUSIONS & EXCLUSIONS SECTION' },
    { key: "incExc", start: 'const InclusionsExclusionsSection', end: '// ─── KNOW BEFORE YOU GO SECTION' },
    { key: "kbyg", start: 'const KBYGItem', end: '// ─── STRING LIST ITEM' },
    { key: "strList", start: 'const StringListItem', end: '// ─── ADDITIONAL INFORMATION SECTION' },
    { key: "addInfo", start: 'const AdditionalInfoSection', end: '// ─── FAQ COMPONENTS' },
    { key: "faq", start: 'const FAQItemForm', end: '// ─── PACKAGE FORM' },
    { key: "pkgForm", start: 'const PackageForm', end: '// ─── VIEW PACKAGE' },
    { key: "viewPkg", start: 'const ViewPackage', end: '// ─── PACKAGES LISTING' },
    { key: "pkgList", start: 'const PackagesListing', end: '// ─── DASHBOARD' },
    { key: "dashboard", start: 'const Dashboard', end: '// ─── SIDEBAR' },
    { key: "sidebar", start: 'const Sidebar', end: '// ─── TOPBAR' },
    { key: "topbar", start: 'const Topbar', end: '// ─── APP ROOT' },
    { key: "app", start: 'export default function App', end: null }
];

const blocks = {};

markers.forEach(m => {
    let startIdx = srcCode.indexOf(m.start);
    if (startIdx === -1) {
        console.error("Missing start marker:", m.start);
        startIdx = 0;
    }
    let endIdx = m.end ? srcCode.indexOf(m.end, startIdx) : srcCode.length;
    if (endIdx === -1) endIdx = srcCode.length;

    let block = srcCode.slice(startIdx, endIdx).trim();

    // Convert any top-level const or function to export
    block = block.replace(/^const ([a-zA-Z0-9_]+) /gm, 'export const $1 ');
    block = block.replace(/^function ([a-zA-Z0-9_]+) /gm, 'export function $1 ');

    blocks[m.key] = block;
});

fs.mkdirSync('app/components/Adminpanel', { recursive: true });

function writef(file, header, bks) {
    let content = header + "\n\n";
    for (let b of bks) {
        content += (blocks[b] || "") + "\n\n";
    }
    fs.writeFileSync('app/components/Adminpanel/' + file, content.trim() + "\n");
}

let contextH = '"use client";\nimport { createContext, useContext } from "react";\nexport const StoreContext = createContext(null);\nexport const useStore = () => useContext(StoreContext);';
writef('context.js', contextH, []);

let utilsH = '"use client";';
writef('utils.js', utilsH, ["utils", "constants", "styleMaps", "factories", "resolve", "mock"]);

let uiH = '"use client";\nimport { useRef, useState } from "react";\nimport { cls } from "./utils";';
writef('ui.jsx', uiH, ["ui", "icons", "imageUploader", "edList", "strList"]);

let compH = '"use client";\nimport { useState, useRef, useMemo } from "react";\nimport { useStore } from "./context";\nimport { uid, cls, fmt12, parseDays, getCurrSym, DURATION_OPTIONS, OPTIONS, CURRENCIES, DAY_GRAD, DAY_BADGE, ACT_DOT, ACT_BADGE, emptyMasterActivity, emptyMasterHotel, emptyDayActivity, emptyDayHotel, emptyTransfer, emptyFaq, emptyKBYG, emptyAdditionalInfo, makeDay, resolveActivity, resolveHotel } from "./utils";\nimport { Badge, Inp, TA, Sel, Card, FL, Btn, Modal, Ic, ImageUploader, EditableListItem, StringListItem } from "./ui";';
writef('components.jsx', compH, ["maForm", "mhForm", "actPicker", "hotelPicker", "sumView", "dayDesc", "itBuilder", "incExc", "kbyg", "addInfo", "faq", "pkgForm"]);

let pageH = '"use client";\nimport { useState, useMemo } from "react";\nimport { useStore } from "./context";\nimport { uid, cls, fmt12, parseDays, getCurrSym, OPTIONS, ACT_BADGE, ACT_DOT, DAY_GRAD, DAY_BADGE, resolveHotel, resolveActivity } from "./utils";\nimport { Badge, Inp, TA, Sel, Card, Btn, Modal, Ic, FL } from "./ui";\nimport { MasterActivityForm, MasterHotelForm, SummarisedView, FAQDisplay, ItineraryBuilder } from "./components";';
fs.writeFileSync('app/components/Adminpanel/pages.jsx', pageH + "\n\n" +
    ((blocks.faq || "").replace(/export const FAQItemForm[\s\S]*?export const FAQDisplay/, 'export const FAQDisplay')) + "\n\n" +
    (blocks.maPage || "") + "\n\n" +
    (blocks.mhPage || "") + "\n\n" +
    (blocks.viewPkg || "") + "\n\n" +
    (blocks.pkgList || "") + "\n\n" +
    (blocks.dashboard || "") + "\n"
);

let layoutH = '"use client";\nimport { cls } from "./utils";\nimport { Ic } from "./ui";';
writef('layout.jsx', layoutH, ["sidebar", "topbar"]);

let indexCode = `
"use client";
import { useState } from "react";
import { StoreContext } from "./context";
import { INIT_ACTIVITIES, INIT_HOTELS, INIT_PACKAGES, emptyAdditionalInfo } from "./utils";
import { Ic } from "./ui";
import { Dashboard, PackagesListing, MasterActivitiesPage, MasterHotelsPage, ViewPackage } from "./pages";
import { PackageForm } from "./components";
import { Sidebar, Topbar } from "./layout";

export default function App() {
  const [page,setPage]                       = useState("dashboard");
  const [packages,setPackages]               = useState(INIT_PACKAGES);
  const [masterActivities,setMasterActivities] = useState(INIT_ACTIVITIES);
  const [masterHotels,setMasterHotels]       = useState(INIT_HOTELS);
  const [selectedId,setSelectedId]           = useState(null);
  const selectedPkg = packages.find(p=>p.id===selectedId);

  const store = { packages, setPackages, masterActivities, setMasterActivities, masterHotels, setMasterHotels };

  const PAGE_META = {
    dashboard:           {title:"Dashboard",          subtitle:"Aventara Elite — Travel Management"},
    packages:            {title:"Travel Packages",    subtitle:\`\${packages.length} packages in catalog\`},
    create:              {title:"Create Package",     subtitle:"Add a new travel package"},
    edit:                {title:"Edit Package",       subtitle:selectedPkg?\`Editing: \${selectedPkg.title||selectedPkg.destination}\`:""},
    view:                {title:"Package Details",    subtitle:selectedPkg?\`\${selectedPkg.destination} · \${selectedPkg.tripDuration}\`:""},
    "master-activities": {title:"Master Activities",  subtitle:\`\${masterActivities.length} reusable activities in global catalog\`},
    "master-hotels":     {title:"Master Hotels",      subtitle:\`\${masterHotels.length} hotels in global catalog\`},
  };
  const meta = PAGE_META[page]||PAGE_META.dashboard;

  const uid  = () => \`\${Date.now()}-\${Math.random().toString(36).slice(2,7)}\`;
  const emptyPkg = () => ({
    id:uid(), title:"", destination:"", tripDuration:"", travelStyle:"", tourType:"",
    exclusivityLevel:"Premium", price:{currency:"INR",amount:""},
    shortDescription:"", longDescription:"",
    availability:{availableMonths:[],fixedDepartureDates:[],blackoutDates:[]},
    inclusions:[], exclusions:[], knowBeforeYouGo:[], additionalInfo:emptyAdditionalInfo(), faqs:[], itinerary:[], createdAt:new Date().toISOString().split("T")[0],
  });

  const handleCreate = (data) => { setPackages(p=>[{...data,id:uid(),createdAt:new Date().toISOString().split("T")[0]},...p]); setPage("packages"); };
  const handleEdit   = (data) => { setPackages(p=>p.map(x=>x.id===data.id?data:x)); setPage("packages"); };

  return (
    <StoreContext.Provider value={store}>
      <div className="min-h-screen bg-gray-50/80">
        <Sidebar page={page} setPage={setPage} counts={{packages:packages.length,activities:masterActivities.length,hotels:masterHotels.length}}/>
        <Topbar title={meta.title} subtitle={meta.subtitle}/>
        <main className="ml-60 pt-16 min-h-screen">
          <div className="p-6 max-w-[1400px]">
            {["create","edit","view"].includes(page)&&(
              <button onClick={()=>setPage("packages")} className="inline-flex items-center gap-1.5 text-sm text-blue-900 font-semibold mb-5 hover:underline"><Ic.Back/>Back to Packages</button>
            )}
            {page==="dashboard"          && <Dashboard setPage={setPage}/>}
            {page==="packages"           && <PackagesListing setPage={setPage} setSelectedId={setSelectedId}/>}
            {page==="create"             && <PackageForm initial={emptyPkg()} mode="create" onSave={handleCreate} onCancel={()=>setPage("packages")}/>}
            {page==="edit" &&selectedPkg && <PackageForm key={selectedPkg.id} initial={selectedPkg} mode="edit" onSave={handleEdit} onCancel={()=>setPage("packages")}/>}
            {page==="view" &&selectedPkg && <ViewPackage pkg={selectedPkg} onEdit={()=>setPage("edit")}/>}
            {page==="master-activities"  && <MasterActivitiesPage/>}
            {page==="master-hotels"      && <MasterHotelsPage/>}
          </div>
        </main>
      </div>
    </StoreContext.Provider>
  );
}
`;
fs.writeFileSync('app/components/Adminpanel/index.jsx', indexCode.trim() + "\n");

console.log("Success!");
