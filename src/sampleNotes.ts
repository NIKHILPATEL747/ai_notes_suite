import { NoteSession } from "./types";

export const SAMPLE_NOTE_SESSIONS: NoteSession[] = [
  {
    id: "sample-photosynthesis",
    title: "Understanding Photosynthesis & Cell Energy",
    subject: "Biology",
    gradeLevel: "High School",
    style: "Comprehensive Study Guide",
    createdAt: new Date(2026, 6, 10, 10, 0, 0).toISOString(),
    favorite: true,
    summary: "Photosynthesis is the fundamental chemical process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose, powering almost all life on Earth.",
    sections: [
      {
        heading: "1. The Chloroplast & Light Absorption",
        content: "Photosynthesis takes place inside specialized plant cell organelles called chloroplasts. These double-membraned structures contain dense stacks of membrane-bound discs called thylakoids, where the light-dependent reactions occur. Stroma, the fluid-filled space surrounding these thylakoids, houses the enzymes for the light-independent reactions. Chlorophyll a and b, the primary pigments embedded in the thylakoid membranes, absorb blue-violet and red wavelengths of light while reflecting green, which gives plants their characteristic color.",
        bulletPoints: [
          "Chloroplast double-membrane structure optimizes compartment-specific biochemical reactions.",
          "Thylakoids provide a high surface area for light-harvesting protein complexes (photosystems).",
          "Pigments absorb light at specific wavelengths, transferring that excitation energy into chemical reactions."
        ]
      },
      {
        heading: "2. The Light-Dependent Reactions",
        content: "Initiated by the absorption of photons, the light-dependent reactions occur in the thylakoid membrane. Photosystem II absorbs light, exciting electrons that are transferred along an Electron Transport Chain (ETC). To replace these lost electrons, water molecules are photolyzed (split), releasing oxygen gas as a byproduct and protons into the thylakoid space. This builds a proton gradient. As protons flow down their concentration gradient through ATP Synthase, ADP is phosphorylated into ATP. Simultaneously, Photosystem I re-energizes electrons, passing them to NADP+ to form NADPH.",
        bulletPoints: [
          "Reactants: Light energy and H2O. Products: Oxygen, ATP, and NADPH.",
          "Photolysis of water (H2O → 2H+ + 2e- + 1/2 O2) is the source of environmental oxygen.",
          "Proton gradient across the thylakoid membrane drives ATP synthesis via chemiosmosis."
        ]
      },
      {
        heading: "3. The Calvin Cycle (Light-Independent)",
        content: "The Calvin Cycle occurs in the stroma of the chloroplast and does not directly require light, utilizing the ATP and NADPH generated in the light reactions instead. The cycle consists of three key phases: Carbon Fixation, Reduction, and Regeneration. First, CO2 is fixed to a 5-carbon sugar, RuBP, by the highly abundant enzyme RuBisCO. The resulting intermediate is unstable and splits into 3-PGA. Next, ATP and NADPH reduce 3-PGA into G3P (a 3-carbon sugar). Finally, some G3P molecules exit to build glucose, while the rest are phosphorylated using ATP to regenerate RuBP, completing the cycle.",
        bulletPoints: [
          "Phase 1 (Carbon Fixation): Catalyzed by RuBisCO, binding CO2 with RuBP.",
          "Phase 2 (Reduction): Requires ATP energy and NADPH electrons to create high-energy G3P sugars.",
          "Phase 3 (Regeneration): Reconstitutes RuBP so the cycle can fix more incoming carbon dioxide."
        ]
      }
    ],
    keyConcepts: [
      {
        term: "Chloroplast",
        definition: "The double-membrane organelle in plant cells where photosynthesis takes place, containing thylakoids and stroma."
      },
      {
        term: "Thylakoid",
        definition: "A flattened membrane sac inside the chloroplast, site of the light-dependent reactions."
      },
      {
        term: "Chlorophyll",
        definition: "The green pigment in thylakoid membranes that absorbs light energy to excite electrons for photosynthesis."
      },
      {
        term: "Photolysis",
        definition: "The splitting of water molecules in Photosystem II using light energy, producing oxygen, protons, and electrons."
      },
      {
        term: "RuBisCO",
        definition: "The enzyme that catalyzes the initial carbon fixation step in the Calvin Cycle, attaching carbon dioxide to RuBP."
      },
      {
        term: "G3P (Glyceraldehyde 3-phosphate)",
        definition: "A three-carbon sugar produced directly by the Calvin Cycle; two G3P molecules join to form a single glucose molecule."
      }
    ],
    cornellNotes: {
      cueColumn: [
        "Where does photosynthesis occur inside the plant cell?",
        "What are the main inputs and outputs of the Light Reactions?",
        "Why is the photolysis of water so critical to the plant and biosphere?",
        "What enzyme fixes carbon dioxide during the Calvin Cycle?",
        "How do the light-dependent and light-independent phases connect?"
      ],
      notesColumn: [
        "Occurs inside chloroplasts. Light reactions happen in thylakoid membranes (stacks called grana); Calvin Cycle happens in the stroma (fluid).",
        "Inputs: Light, H2O, ADP, NADP+. Outputs: Oxygen (released as gas), ATP, and NADPH (sent to Calvin Cycle).",
        "It splits H2O into protons, oxygen, and electrons. The electrons replenish Photosystem II; oxygen is released into the atmosphere, allowing aerobic respiration.",
        "RuBisCO fixes carbon dioxide to RuBP. It is the most abundant enzyme on Earth.",
        "Light reactions capture light to build ATP & NADPH. The Calvin Cycle consumes ATP & NADPH to build G3P (sugars), returning ADP & NADP+ back to the light reactions."
      ],
      summaryColumn: "Photosynthesis is divided into Light-Dependent Reactions (capturing solar energy in thylakoids to yield ATP/NADPH) and the Calvin Cycle (carbon-fixing in the stroma to construct stable sugars). Together, they convert solar energy into chemical energy, supporting ecological food webs."
    },
    flashcards: [
      {
        id: "fc-1",
        front: "What pigment gives plants their green color and absorbs light energy?",
        back: "Chlorophyll (primarily Chlorophyll a and b), which reflects green light wavelengths while absorbing red and blue.",
        mastered: false
      },
      {
        id: "fc-2",
        front: "In what specific compartment of the chloroplast does the Calvin Cycle occur?",
        back: "The stroma, which is the alkaline, protein-rich gel fluid surrounding the thylakoid membranes.",
        mastered: false
      },
      {
        id: "fc-3",
        front: "What is the primary role of RuBisCO in carbon fixation?",
        back: "It catalyzes the chemical reaction that attaches inorganic CO2 to the 5-carbon organic sugar RuBP.",
        mastered: false
      },
      {
        id: "fc-4",
        front: "Which photosystem splits water molecules (photolysis)?",
        back: "Photosystem II (PSII). It splits water to replace electrons sent down the electron transport chain.",
        mastered: false
      },
      {
        id: "fc-5",
        front: "What 3-carbon sugar molecule is the direct output of the Calvin Cycle?",
        back: "G3P (Glyceraldehyde 3-phosphate). Two G3Ps are needed to build one molecule of glucose.",
        mastered: false
      },
      {
        id: "fc-6",
        front: "What enzyme synthesizes ATP as protons flow down their concentration gradient?",
        back: "ATP Synthase, which functions as a molecular rotary motor driven by the proton motive force across the thylakoid membrane.",
        mastered: false
      }
    ],
    quiz: [
      {
        id: "q-1",
        question: "Which of the following molecules is NOT a direct product of the light-dependent reactions?",
        options: [
          "Oxygen gas (O2)",
          "ATP",
          "NADPH",
          "Glyceraldehyde 3-phosphate (G3P)"
        ],
        correctAnswer: "Glyceraldehyde 3-phosphate (G3P)",
        explanation: "G3P is the direct product of the Calvin Cycle (light-independent reactions). The light-dependent reactions produce oxygen, ATP, and NADPH, which are then used in the Calvin Cycle."
      },
      {
        id: "q-2",
        question: "The photolysis of water in chloroplasts takes place in which location?",
        options: [
          "The stroma of the chloroplast",
          "The thylakoid lumen/space",
          "The outer membrane of the chloroplast",
          "The cytoplasm surrounding the cell"
        ],
        correctAnswer: "The thylakoid lumen/space",
        explanation: "Photolysis occurs on the inner face of the thylakoid membrane, releasing protons (H+) directly into the thylakoid lumen, which helps build the chemiosmotic proton gradient."
      },
      {
        id: "q-3",
        question: "What is the biological significance of the enzyme RuBisCO?",
        options: [
          "It splits water into protons, electrons, and oxygen.",
          "It transports electrons between Photosystem II and Photosystem I.",
          "It fixes atmospheric carbon dioxide into an organic sugar intermediate.",
          "It synthesizes ATP from ADP and inorganic phosphate."
        ],
        correctAnswer: "It fixes atmospheric carbon dioxide into an organic sugar intermediate.",
        explanation: "RuBisCO fixes gaseous CO2 to 5-carbon RuBP, initiating the organic carbon cycle that sustains almost all terrestrial and aquatic food chains."
      },
      {
        id: "q-4",
        question: "What wavelength region of the electromagnetic spectrum is reflected by chlorophyll pigments?",
        options: [
          "Blue-violet wavelengths",
          "Red wavelengths",
          "Green wavelengths",
          "Ultraviolet wavelengths"
        ],
        correctAnswer: "Green wavelengths",
        explanation: "Chlorophyll absorbs blue and red wavelengths for energy, reflecting green wavelengths. This reflected light is what we see, making plant foliage appear green."
      },
      {
        id: "q-5",
        question: "How many cycles of the Calvin Cycle (fixing individual CO2 molecules) are theoretically required to output one net molecule of G3P?",
        options: [
          "1 cycle",
          "3 cycles",
          "6 cycles",
          "12 cycles"
        ],
        correctAnswer: "3 cycles",
        explanation: "Each Calvin Cycle fixes one carbon dioxide. To produce one net 3-carbon G3P molecule, 3 carbon atoms must be fixed, which requires 3 complete turns of the Calvin Cycle."
      }
    ],
    mindMapNodes: [
      { id: "root", label: "Photosynthesis", parentId: null, description: "Process of turning light energy into glucose." },
      { id: "m1", label: "Light-Dependent", parentId: "root", description: "Occurs in thylakoids; converts light to ATP & NADPH." },
      { id: "m2", label: "Calvin Cycle", parentId: "root", description: "Occurs in stroma; fixes CO2 into sugar (G3P)." },
      { id: "m1a", label: "Photosystem II", parentId: "m1", description: "Absorbs light at 680nm, splits water (photolysis), releases O2." },
      { id: "m1b", label: "Photosystem I", parentId: "m1", description: "Absorbs light at 700nm, reduces NADP+ to NADPH." },
      { id: "m1c", label: "ATP Synthase", parentId: "m1", description: "Uses proton gradient to synthesize ATP from ADP." },
      { id: "m2a", label: "Carbon Fixation", parentId: "m2", description: "RuBisCO enzyme attaches carbon dioxide to RuBP." },
      { id: "m2b", label: "Reduction", parentId: "m2", description: "Uses ATP and NADPH to turn intermediates into G3P." },
      { id: "m2c", label: "Regeneration", parentId: "m2", description: "Rebuilds RuBP using ATP so cycle can repeat." }
    ]
  },
  {
    id: "sample-french-rev",
    title: "The French Revolution: Outbreak and Phases",
    subject: "History",
    gradeLevel: "College",
    style: "Q&A / Active Recall",
    createdAt: new Date(2026, 6, 9, 14, 30, 0).toISOString(),
    favorite: false,
    summary: "An in-depth review of the causes, critical turning points, and major political shifts of the French Revolution (1789-1799), marking the transition from feudal absolutism to democratic nationalism.",
    sections: [
      {
        heading: "1. Socio-Economic Crises & Structural Collapse",
        content: "By 1789, France was on the brink of bankruptcy due to extensive warfare (including the Seven Years' War and funding the American Revolution) and the extravagant court lifestyle of Versailles. This financial crisis was exacerbated by a rigid social hierarchy called the Three Estates. The First Estate (Clergy) and Second Estate (Nobility) enjoyed tax exemptions and immense privileges, whereas the Third Estate (representing 98% of the population, ranging from peasants to wealthy bourgeoisie) bore the entire tax burden. Crop failures in 1788 caused severe inflation, pushing food prices beyond reach.",
        bulletPoints: [
          "Deficit spending and high debt service triggered state-level insolvency.",
          "Estates-General assembly voting structure (one vote per estate) structurally marginalized the Third Estate.",
          "Severe bread shortages and inflation catalyzed widespread urban and peasant unrest."
        ]
      },
      {
        heading: "2. The Fall of absolutism & Revolutionary Shift",
        content: "In June 1789, after deadlocking at the Estates-General, the Third Estate declared itself the National Assembly. Locked out of their meeting hall, they gathered on an indoor tennis court, swearing the 'Tennis Court Oath' to not disband until they drafted a constitution. Tensions crested on July 14, 1789, when Parisians stormed the Bastille prison, a fortress symbol of royal tyranny, to seize gunpowder. This armed insurrection triggered a national revolt, resulting in the abolition of feudalism and the creation of the Declaration of the Rights of Man and of the Citizen.",
        bulletPoints: [
          "Tennis Court Oath marked the birth of sovereignty residing in the nation, not the King.",
          "Storming of the Bastille legitimized the armed popular uprising, establishing the National Guard.",
          "The August Decrees formally dismantled the legal framework of feudal dues and aristocratic privilege."
        ]
      },
      {
        heading: "3. Radicalization & The Reign of Terror",
        content: "As foreign monarchies threatened intervention to restore Louis XVI, France went to war in 1792. War failures and hyperinflation radicalized the Parisian working class (sans-culottes). The monarchy was abolished, and Louis XVI was executed for treason in January 1793. To defend the revolution against internal rebellion and external invaders, the National Convention vested executive power in the Committee of Public Safety, led by Maximilien Robespierre. This committee initiated the Reign of Terror, executing over 17,000 citizens labeled counter-revolutionary, until Robespierre's own downfall.",
        bulletPoints: [
          "Jacobins (radicals) pushed aside the Girondins (moderates) under the threat of foreign invasion.",
          "Execution of Louis XVI alienated moderate European powers, expanding the coalition war.",
          "Thermidorian Reaction in July 1794 executed Robespierre, ending the radical terror phase."
        ]
      }
    ],
    keyConcepts: [
      {
        term: "The Three Estates",
        definition: "The rigid socio-political division of French society: First Estate (Clergy), Second Estate (Nobility), and Third Estate (Peasants, Bourgeoisie, Commoners)."
      },
      {
        term: "Estates-General",
        definition: "The legislative assembly of representatives from the three estates, summoned by Louis XVI in 1789 after a 175-year hiatus."
      },
      {
        term: "Tennis Court Oath",
        definition: "The solemn oath sworn by the National Assembly (Third Estate) on June 20, 1789, promising to draft a constitution."
      },
      {
        term: "Storming of the Bastille",
        definition: "July 14, 1789, popular uprising in Paris that captured the royal fortress and signaled the fall of absolute royal authority."
      },
      {
        term: "Declaration of the Rights of Man",
        definition: "The 1789 foundational civil rights charter, asserting natural, inalienable human rights, liberty, and equality before the law."
      },
      {
        term: "Committee of Public Safety",
        definition: "The emergency dictatorial cabinet formed in 1793, led by Robespierre, which oversaw the radical Reign of Terror."
      }
    ],
    cornellNotes: {
      cueColumn: [
        "What were the direct fiscal causes of the revolution?",
        "Why was the voting system of the Estates-General flawed?",
        "What was the geopolitical reaction to the revolution?",
        "What led to the establishment of the Committee of Public Safety?",
        "How did the radical phase come to an end?"
      ],
      notesColumn: [
        "High national debt from funding global wars (e.g., American Revolution), coupled with royal court extravagance and tax immunity for the upper estates.",
        "Each Estate only had one collective vote. The Clergy (1st) and Nobility (2nd) consistently voted together to override the Third Estate, despite representing under 2% of the population.",
        "Foreign monarchies (Austria, Prussia) feared democratic ideas spreading, so they issued warnings (Declaration of Pillnitz) and entered armed conflict against France.",
        "Food shortages, domestic counter-revolutionary rebellions (e.g. Vendée), and the looming threat of defeat by invading foreign armies created high state panic.",
        "Robespierre began executing his own political allies, prompting the fearful National Convention to vote for his arrest and execution (Thermidorian Reaction) in July 1794."
      ],
      summaryColumn: "The French Revolution originated in profound socio-economic imbalance and fiscal insolvency. Moving rapidly from moderate reform (1789) to radical terror (1793) fueled by war and internal factionalism, it shattered absolute monarchy and fundamentally restructured modern European politics around national sovereignty."
    },
    flashcards: [
      {
        id: "fc-20",
        front: "Who was the ruling King of France when the revolution broke out in 1789?",
        back: "Louis XVI, of the House of Bourbon, who was later executed by guillotine in January 1793.",
        mastered: false
      },
      {
        id: "fc-21",
        front: "What prison fortress was stormed on July 14, 1789, marking a crucial tipping point?",
        back: "The Bastille, representing royal oppression, militarism, and the central armory.",
        mastered: false
      },
      {
        id: "fc-22",
        front: "What working-class Parisian faction drove the revolution into its radical phase?",
        back: "The Sans-culottes ('without silk knee-breeches'), representing ordinary artisans and shopkeepers.",
        mastered: false
      },
      {
        id: "fc-23",
        front: "Who led the Committee of Public Safety during the peak of the Terror?",
        back: "Maximilien Robespierre, a radical Jacobin politician known as 'The Incorruptible'.",
        mastered: false
      },
      {
        id: "fc-24",
        front: "What was the name of the legislative body that replaced the National Assembly?",
        back: "The National Convention, which declared France a Republic in September 1792.",
        mastered: false
      }
    ],
    quiz: [
      {
        id: "q-20",
        question: "What percentage of the population belonged to the Third Estate in 1789?",
        options: [
          "Under 50%",
          "Approximately 70%",
          "Around 85%",
          "Over 97%"
        ],
        correctAnswer: "Over 97%",
        explanation: "The Third Estate comprised about 98% of the population, spanning wealthy merchants and professionals (bourgeoisie) to rural peasants and urban laborers."
      },
      {
        id: "q-21",
        question: "The Tennis Court Oath was sworn after representatives of the Third Estate were locked out of what meeting?",
        options: [
          "The Palace of Versailles",
          "The Estates-General",
          "The Paris Parliament",
          "The Cathedral of Notre Dame"
        ],
        correctAnswer: "The Estates-General",
        explanation: "After finding their meeting room locked, the newly formed National Assembly gathered on a nearby indoor tennis court to secure their oath of unity."
      },
      {
        id: "q-22",
        question: "The Declaration of the Rights of Man and of the Citizen was heavily inspired by which movement?",
        options: [
          "The Protestant Reformation",
          "The Scientific Revolution",
          "The Enlightenment",
          "The Romantic Movement"
        ],
        correctAnswer: "The Enlightenment",
        explanation: "It was directly inspired by Enlightenment philosophers like Rousseau, Montesquieu, and Locke, advocating for natural rights, civic equality, and popular sovereignty."
      },
      {
        id: "q-23",
        question: "Which battle or political shift ended the radical Reign of Terror?",
        options: [
          "The Battle of Valmy",
          "The Thermidorian Reaction",
          "The Directory Coup",
          "The Battle of Waterloo"
        ],
        correctAnswer: "The Thermidorian Reaction",
        explanation: "In July 1794 (the month of Thermidor in the revolutionary calendar), the National Convention arrested and executed Robespierre, ending the Reign of Terror."
      },
      {
        id: "q-24",
        question: "Who seized power in November 1799, officially ending the French Revolution?",
        options: [
          "Louis XVIII",
          "Napoleon Bonaparte",
          "Jean-Paul Marat",
          "Georges Danton"
        ],
        correctAnswer: "Napoleon Bonaparte",
        explanation: "General Napoleon Bonaparte overthrew the corrupt Directory government in the Coup of 18 Brumaire, initiating the Napoleonic Era."
      }
    ],
    mindMapNodes: [
      { id: "root", label: "French Revolution", parentId: null, description: "Demise of French Absolutism (1789-1799)." },
      { id: "m1", label: "Causes", parentId: "root", description: "Taxation on the 3rd Estate, fiscal bankruptcy, and food famines." },
      { id: "m2", label: "Moderate Phase", parentId: "root", description: "Establishment of Assembly, Tennis Court Oath, Rights of Man (1789-1791)." },
      { id: "m3", label: "Radical Phase", parentId: "root", description: "Execution of King, foreign wars, and Reign of Terror (1792-1794)." },
      { id: "m4", label: "Consolidation", parentId: "root", description: "The Directory and Napoleon Bonaparte's rise to power (1795-1799)." },
      { id: "m1a", label: "Estate System", parentId: "m1", description: "Feudal hierarchy where Clergy and Nobility evade all taxation." },
      { id: "m1b", label: "Debt Crisis", parentId: "m1", description: "Insolvency triggered by military spending in the American War." },
      { id: "m2a", label: "Tennis Court", parentId: "m2", description: "Assembly vow to not disband until a constitution is established." },
      { id: "m2b", label: "Bastille", parentId: "m2", description: "Popular armed revolt capturing the fortress on July 14, 1789." },
      { id: "m3a", label: "Jacobins", parentId: "m3", description: "Radical faction led by Robespierre executing dissenters." },
      { id: "m3b", label: "Committee of Safety", parentId: "m3", description: "Dictatorial war cabinet implementing national mobilization." }
    ]
  }
];
