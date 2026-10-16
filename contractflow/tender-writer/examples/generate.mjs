// Synthetic review outputs only. Run with Node from any working directory.
import {writeFile} from 'node:fs/promises';
import {extractRequirements, requirementsCsv, evidenceCsv, reviewReport} from '../engine.mjs';
import {composeResponses, submissionDraft} from '../drafting.mjs';
const sourceText = 'FICTIONAL EXERCISE — not an available mining contract.\n1. Provide a workforce mobilisation plan.\n2. The tenderer must provide evidence of relevant insurance.';
const evidence=[{id:'EVD-001',description:'Fictional workforce example',source:'SYNTHETIC PLAN v1',locator:'section 2, page 1',
 reviewer:'Fictional reviewer',status:'Verified',disclosureApproved:true,excerpt:'For this fictional exercise, the proposed team comprises two mechanical fitters. Availability has not been confirmed.'}];
const requirements=extractRequirements(sourceText);
requirements[0].evidence='EVD-001'; requirements[0].owner='Fictional reviewer';
const bid={client:'Example Contractor — FICTIONAL',buyer:'Example Mining Buyer — FICTIONAL',title:'Fictional maintenance exercise',
 reference:'DEMO-ONLY-001',source:'SYNTHETIC EXAMPLE — NOT AN OPEN TENDER',deadline:'DEMO ONLY — NO REAL CLOSING DATE',
 sourceText,analysedSource:sourceText,coverageConfirmed:false,evidence,requirements:composeResponses(requirements,evidence)};
for(const [name,content] of Object.entries({
 'synthetic-source.txt':sourceText,
 'synthetic-eoi-draft.md':submissionDraft({...bid,type:'Expression of interest'}),
 'synthetic-tender-draft.md':submissionDraft({...bid,type:'Tender / RFT'}),
 'synthetic-qa-report.md':reviewReport(bid),
 'synthetic-requirements.csv':requirementsCsv(bid.requirements),
 'synthetic-evidence.csv':evidenceCsv(evidence)
})) await writeFile(new URL(name,import.meta.url),content+'\n');
console.log('Generated six synthetic, unapproved review outputs. No network or model calls.');
