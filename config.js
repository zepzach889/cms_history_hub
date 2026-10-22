/* History Day Hub settings.
   This is the only file you need to edit each year.
   Dates use YYYY-MM-DD. Keep the quotes and commas. */

/* =========================================================
   SETTINGS: change these each year (dates, links, message)
   ========================================================= */
const CONFIG = {
  year: "2027",
  classroomLink: "",            // paste your Google Classroom link here
  teacherEmail: "",             // optional
  announcement: "",             // optional message shown at the top of This Week
  startDate: "2026-10-19",
  checkpoints: [
    { n:1, name:"Topic Proposal", short:"Topic", due:"2026-10-30", part:"Part 1" },
    { n:2, name:"Background and Questions", short:"Questions", due:"2026-11-13", part:"Part 2" },
    { n:3, name:"Working Bibliography", short:"Sources", due:"2026-12-04", part:"Part 3" },
    { n:4, name:"Thesis and Evidence Map", short:"Thesis", due:"2026-12-18", part:"Part 4" },
    { n:5, name:"Project Blueprint", short:"Blueprint", due:"2027-01-15", part:"Part 5" },
    { n:6, name:"Complete Draft", short:"Draft", due:"2027-02-05", part:"Part 6" },
  ],
  weeks: [
    { start:"2026-10-19", lab:"In-class kickoff (no lab this week)", job:"Brainstorm 3 possible topics", pages:"Part 1: Brainstorm Topics" },
    { start:"2026-10-26", lab:"First lab: brainstorming and picking a topic that fits the theme", job:"Finish the Topic Proposal (Checkpoint 1)", pages:"Part 1: Funnel, Theme Connection, Primary Source Test" },
    { start:"2026-11-02", lab:"Getting the big picture: background research", job:"Read 2–3 background sources and take notes", pages:"Part 2: Getting the Big Picture" },
    { start:"2026-11-09", lab:"Asking good historical questions", job:"Finish Background and Questions (Checkpoint 2)", pages:"Part 2: Asking Good Historical Questions" },
    { start:"2026-11-16", lab:"Primary vs. secondary sources", job:"Find at least 5 sources", pages:"Part 3: Primary vs. Secondary, Finding and Judging Sources" },
    { start:"2026-11-23", lab:"No lab (Thanksgiving)", job:"Keep finding sources", pages:"" },
    { start:"2026-11-30", lab:"Citing and annotating sources", job:"Finish Working Bibliography (Checkpoint 3)", pages:"Part 3: Citing Your Sources, Writing Annotations" },
    { start:"2026-12-07", lab:"Taking notes that help you later", job:"Sort your notes into Before, Innovation, and After", pages:"Part 4: Taking Research Notes" },
    { start:"2026-12-14", lab:"Writing a thesis", job:"Finish Thesis and Evidence Map (Checkpoint 4)", pages:"Part 4: Evidence Map, Writing a Thesis" },
    { start:"2026-12-21", lab:"Winter break, no lab", job:"Optional: think about which category fits your topic", pages:"" },
    { start:"2026-12-28", lab:"Winter break, no lab", job:"Optional: think about which category fits your topic", pages:"" },
    { start:"2027-01-04", lab:"Choosing and planning your category", job:"Start your Project Blueprint", pages:"Part 5 and your Category Planner" },
    { start:"2027-01-11", lab:"Blueprint check-ins", job:"Finish Project Blueprint (Checkpoint 5)", pages:"Part 5: Project Outline" },
    { start:"2027-01-18", lab:"No lab (Martin Luther King Jr. Day)", job:"Build your project", pages:"" },
    { start:"2027-01-25", lab:"Build workshop and process paper basics", job:"Build, and draft your process paper", pages:"Part 6: Building Your Draft, The Process Paper" },
    { start:"2027-02-01", lab:"Final draft check", job:"Finish Complete Draft (Checkpoint 6)", pages:"Part 6: Final Build Checklist" },
  ],
};
