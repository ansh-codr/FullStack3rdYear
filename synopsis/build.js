const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  PageBreak, ImageRun, Header, Footer, PageNumber, NumberFormat,
  VerticalAlign, LevelFormat, convertInchesToTwip, TabStopType, TabStopPosition
} = require("docx");
const fs = require("fs");

// ---------- THEME ----------
const GREEN_DARK = "1F4023";
const GREEN = "2F6B34";
const GREEN_MID = "3E7A43";
const TEXT = "222222";
const GREY = "555555";
const TABLE_HEAD_FILL = "2F6B34";
const TABLE_ALT_FILL = "EEF3EC";
const BORDER_COLOR = "B9C7B7";

const FONT = "Calibri";
const HEAD_FONT = "Cambria";

// ---------- HELPERS ----------
function heading1(text, num) {
  return new Paragraph({
    children: [new PageBreak(), new TextRun({ text: `${num}`, bold: true })].slice(0,0), // placeholder unused
  });
}

function pageBreakPara() {
  return new Paragraph({ children: [new PageBreak()] });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 0, after: 240 },
    border: { bottom: { color: GREEN_DARK, space: 6, style: BorderStyle.SINGLE, size: 10 } },
    children: [new TextRun({ text, bold: true, color: GREEN_DARK, font: HEAD_FONT, size: 32 })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, color: GREEN, font: HEAD_FONT, size: 25 })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 288 },
    children: [new TextRun({ text, font: FONT, size: 22, color: TEXT, ...opts })],
  });
}

function labelBody(label, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 288 },
    children: [
      new TextRun({ text: label + "  ", bold: true, font: FONT, size: 22, color: GREEN_DARK }),
      new TextRun({ text, font: FONT, size: 22, color: TEXT }),
    ],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "main-bullets", level },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100, line: 276 },
    children: [new TextRun({ text, font: FONT, size: 22, color: TEXT })],
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 300 },
    children: [new TextRun({ text, italics: true, font: FONT, size: 19, color: GREY })],
  });
}

function imageCentered(path, width, height) {
  if (!fs.existsSync(path)) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [new TextRun({ text: "[Diagram image not available]", italics: true, font: FONT, size: 18, color: GREY })],
    });
  }
  const data = fs.readFileSync(path);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 60 },
    children: [new ImageRun({ data, type: "png", transformation: { width, height } })],
  });
}

// ---------- TABLE HELPERS ----------
function tCell(text, { header = false, width, shadeAlt = false, bold = false, align = AlignmentType.LEFT } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: header
      ? { type: ShadingType.CLEAR, fill: TABLE_HEAD_FILL }
      : shadeAlt
      ? { type: ShadingType.CLEAR, fill: TABLE_ALT_FILL }
      : { type: ShadingType.CLEAR, fill: "FFFFFF" },
    margins: { top: 90, bottom: 90, left: 130, right: 130 },
    children: [
      new Paragraph({
        alignment: header ? AlignmentType.LEFT : align,
        children: [
          new TextRun({
            text,
            bold: header || bold,
            color: header ? "FFFFFF" : TEXT,
            font: FONT,
            size: header ? 20 : 20,
          }),
        ],
      }),
    ],
  });
}

function makeTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => tCell(h, { header: true, width: colWidths[i] })),
  });
  const bodyRows = rows.map(
    (r, ri) =>
      new TableRow({
        children: r.map((c, i) => tCell(c, { width: colWidths[i], shadeAlt: ri % 2 === 1 })),
      })
  );
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      left: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      right: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: BORDER_COLOR },
    },
    rows: [headerRow, ...bodyRows],
  });
}

function spacer(h = 200) {
  return new Paragraph({ spacing: { after: h }, children: [] });
}

// ============================================================
// CONTENT
// ============================================================

const sections = [];

// ---------------- COVER PAGE ----------------
const coverChildren = [
  new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: "B.TECH CSE (III YEAR – V SEM) (2025-26)", bold: true, size: 32, font: HEAD_FONT, color: GREEN_DARK })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 320 },
    children: [new TextRun({ text: "DEPARTMENT OF COMPUTER SCIENCE ENGINEERING & APPLICATIONS", size: 22, font: FONT, color: TEXT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: "GLA UNIVERSITY", bold: true, size: 40, font: HEAD_FONT, color: GREEN_DARK })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 4 },
    children: [new TextRun({ text: "17km Stone, NH-2, Mathura-Delhi Road, P.O. Chaumuhan, Mathura – 281406", size: 20, font: FONT, color: GREY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 340 },
    children: [new TextRun({ text: "(Uttar Pradesh) India", size: 20, font: FONT, color: GREY })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    border: { top: { color: GREEN_DARK, space: 8, style: BorderStyle.SINGLE, size: 8 }, bottom: { color: GREEN_DARK, space: 8, style: BorderStyle.SINGLE, size: 8 } },
    children: [new TextRun({ text: "PROJECT SYNOPSIS", bold: true, size: 30, font: HEAD_FONT, color: GREEN })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 500 },
    children: [new TextRun({ text: "IoT Smart Cold Chain Temperature & Spoilage Monitor", bold: true, size: 30, font: HEAD_FONT, color: TEXT })],
  }),
];

function coverRow(label, value) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 140 },
    tabStops: [{ type: TabStopType.LEFT, position: 2600 }],
    children: [
      new TextRun({ text: label, bold: true, size: 22, font: FONT, color: GREEN_DARK }),
      new TextRun({ text: "\t" + value, size: 22, font: FONT, color: TEXT }),
    ],
  });
}

coverChildren.push(
  coverRow("Team Leader:", "Ansh Yadav   (UR: 2415500079)"),
  coverRow("Team Member 1:", "Piyush Singh Tomar   (UR: 2415500338)"),
  coverRow("Team Member 2:", "Charu Khandelwal   (UR: 2415500136)"),
  spacer(200),
  coverRow("Mentor Name:", "Prof. Yunis Ahmed Lone"),
  coverRow("Signature:", "_______________________"),
  spacer(600),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Team 35  |  Mini-Project  |  Version v1.0  |  Date: 02 Sep 2026", italics: true, size: 19, font: FONT, color: GREY })],
  })
);

sections.push({ children: coverChildren, pageBreakBefore: false });

// ---------------- BODY (single flowing section, page breaks per heading) ----------------
const body_children = [];

function startHeading(num, title) {
  body_children.push(pageBreakPara());
  body_children.push(h1(`${num}. ${title}`));
}

// -------- Synopsis cover block --------
startHeading(0, "Project Synopsis Cover");
body_children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 },
    children: [new TextRun({ text: "Project Synopsis", bold: true, size: 26, font: HEAD_FONT, color: GREEN_DARK })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 260 },
    children: [new TextRun({ text: "IoT Smart Cold Chain Temperature & Spoilage Monitor", bold: true, size: 24, font: HEAD_FONT, color: TEXT })],
  })
);
[
  ["Project title:", "IoT Smart Cold Chain Temperature & Spoilage Monitor"],
  ["Team name & ID:", "Team 35"],
  ["Institute / Course:", "GLA University, Mathura – B.Tech CSE, Mini-Project"],
  ["Version:", "v1.0"],
  ["Date:", "02 Sep 2026"],
].forEach(([l, v]) => body_children.push(bullet(`${l} ${v}`)));

// 1. Overview
startHeading(1, "Overview");
body_children.push(h2("Problem Statement"));
body_children.push(body("Perishable goods such as dairy, pharmaceuticals, and fresh produce require continuous temperature and humidity control while in transit. Refrigeration breakdowns and unmonitored transit delays lead to significant financial loss and public health risk, and most existing cold-chain monitoring solutions are either too expensive for small operators or only provide a historical log that is reviewed after the goods have already spoiled."));
body_children.push(h2("Goal"));
body_children.push(body("Build a network of low-cost, battery-powered sensor nodes that continuously log temperature, humidity, and volatile organic compound (VOC) levels inside transport containers, compute a dynamic shelf-life decay estimate on the edge microcontroller using a simplified Arrhenius kinetic model, and transmit real-time environmental data and breach alerts to a cloud dashboard — enabling intervention before goods are damaged."));
body_children.push(h2("Non-goals"));
body_children.push(body("Autonomous refrigeration control, fleet-wide commercial dashboard integration, custom PCB fabrication, and regulatory (FSSAI/HACCP) certification are out of scope for v1."));
body_children.push(h2("Value Proposition"));
body_children.push(body("An affordable, battery-powered environmental monitoring node that predicts spoilage risk before goods arrive damaged, with resilient offline data buffering and an automated compliance report — replacing expensive, closed-platform industrial trackers with a low-cost, student-buildable alternative."));

// 2. Scope and Control
startHeading(2, "Scope and Control");
body_children.push(h2("2.1  In-scope"));
[
  "Sensor node hardware assembly and calibration",
  "Firmware for continuous data logging and low-power sleep operation",
  "Local data buffering (SD card / EEPROM) during network interruptions",
  "Real-time transmission of readings to a cloud dashboard over WiFi",
  "Edge computation of shelf-life decay using a simplified Arrhenius kinetic model",
  "Cloud dashboard showing live temperature and humidity graphs and alert configuration",
  "Automated chain-of-custody compliance report generation",
].forEach((t) => body_children.push(bullet(t)));

body_children.push(h2("2.2  Out-of-scope"));
[
  "Cellular (GSM) connectivity, SMS alerts, and LoRa-based transmission — planned as a future/production enhancement",
  "Real-time GPS-based geolocation tracking",
  "Multi-vehicle fleet management dashboard",
  "Integration with third-party logistics or ERP platforms",
  "Custom PCB design and fabrication",
].forEach((t) => body_children.push(bullet(t)));

body_children.push(h2("2.3  Assumptions"));
[
  "The demo/test environment has stable WiFi coverage",
  "DHT22, DS18B20, and MQ-135 sensors provide sufficient accuracy for a working prototype",
  "Test transport containers are accessible for sensor node placement and retrieval",
].forEach((t) => body_children.push(bullet(t)));

body_children.push(h2("2.4  Constraints"));
[
  "Battery capacity limits continuous operation on multi-day trips",
  "Academic project timeline and hardware budget",
  "Limited real-world historical spoilage data available for model validation",
].forEach((t) => body_children.push(bullet(t)));

body_children.push(h2("2.5  Dependencies"));
[
  "ESP32 microcontroller platform",
  "Arduino IDE / MicroPython firmware toolchain",
  "Cloud hosting for telemetry storage and the web dashboard",
  "Reference thermometer and hygrometer for calibration",
].forEach((t) => body_children.push(bullet(t)));

body_children.push(h2("2.6  Acceptance Criteria and Sign-off"));
[
  "GIVEN a temperature breach WHEN the configured threshold is exceeded THEN a dashboard/email alert is sent within 10 seconds of detection",
  "GIVEN a network interruption WHEN connectivity is lost THEN readings are buffered locally and synced automatically on reconnection with zero data loss",
  "GIVEN a completed trip WHEN telemetry is uploaded THEN a chain-of-custody compliance report is auto-generated",
].forEach((t) => body_children.push(bullet(t)));
body_children.push(spacer(120));
body_children.push(
  makeTable(
    ["Stakeholder", "Role", "Decision Area", "Signature/Approval", "Date"],
    [
      ["Prof. Yunis Ahmad Lone", "Mentor", "Scope, final acceptance", "", ""],
      ["Ansh Yadav", "Team Lead", "Release readiness", "", ""],
    ],
    [2400, 1500, 2600, 2000, 1400]
  )
);

// 3. Stakeholders and RACI
startHeading(3, "Stakeholders and RACI");
body_children.push(
  makeTable(
    ["Activity", "Responsible (R)", "Accountable (A)", "Consulted (C)", "Informed (I)"],
    [
      ["Requirements", "Charu Khandelwal", "Ansh Yadav", "Mentor", "Team"],
      ["Hardware Design", "Piyush Singh Tomar", "Ansh Yadav", "Mentor", "Team"],
      ["Firmware & Edge Logic", "Ansh Yadav", "Ansh Yadav", "Mentor", "Team"],
      ["Cloud Dashboard", "Piyush Singh Tomar", "Piyush Singh Tomar", "Mentor", "Team"],
      ["Testing & Calibration", "Charu Khandelwal", "Ansh Yadav", "Mentor", "Team"],
      ["Release / Demonstration", "Charu Khandelwal", "Charu Khandelwal", "Mentor", "Dept"],
    ],
    [2400, 2200, 2200, 1500, 1600]
  )
);

// 4. Team and Roles
startHeading(4, "Team and Roles");
body_children.push(
  makeTable(
    ["Member", "Role", "Responsibilities", "Key Skills", "Contact"],
    [
      ["Ansh Yadav", "Team Lead / Hardware & Firmware", "Architecture, sensor wiring, edge firmware, power optimisation", "Embedded C, ESP32, IoT protocols", "ansh.yadav_cs.aiml24@gla.ac.in"],
      ["Piyush Singh Tomar", "Cloud & Dashboard", "Telemetry API, database, alert configuration, dashboard UI", "Node.js, React, MQTT/HTTP", "piyush.tomar_cs.aiml24@gla.ac.in"],
      ["Charu Khandelwal", "Testing & Documentation", "Sensor calibration, test plan, requirements, reporting", "Data analysis, technical writing", "charu.khandelwal_cs.aiml24@gla.ac.in"],
    ],
    [1900, 2200, 2900, 2100, 800].map((v,i)=>[1900,2100,2600,2000,1300][i])
  )
);

// 5. Week-wise Plan
startHeading(5, "Week-wise Plan and Assignments");
body_children.push(
  makeTable(
    ["Week", "Planned Work", "Deliverable", "Status"],
    [
      ["Week 1", "Requirement analysis, research, and component procurement", "Requirements doc", "Planned"],
      ["Week 2", "Sensor bring-up: wire DS18B20, DHT22, MQ-135, basic read/log", "Working sensor rig", "Planned"],
      ["Week 3", "Power optimisation: sleep routines, battery current profiling", "Low-power firmware", "Planned"],
      ["Week 4", "Local buffering: SD/EEPROM storage and resync logic", "Offline buffer module", "Planned"],
      ["Week 5", "WiFi connectivity and cloud telemetry transmission", "Connected node", "Planned"],
      ["Week 6", "Shelf-life decay model implementation on-device", "Decay model module", "Planned"],
      ["Week 7", "Cloud dashboard: live graphs, alert configuration, compliance report", "Dashboard + reports", "Planned"],
      ["Week 8", "Testing, calibration, documentation, and final demonstration", "Final demo, report", "Planned"],
    ],
    [1100, 4900, 2100, 1400]
  )
);

// 6. Users and UX
startHeading(6, "Users and UX");
body_children.push(h2("6.1  Personas"));
body_children.push(bullet("Logistics Manager: Needs immediate breach alerts and live visibility to intervene before goods spoil."));
body_children.push(bullet("Quality/Compliance Auditor: Needs a reliable, timestamped chain-of-custody report for every completed trip."));
body_children.push(h2("6.2  Top User Journey"));
body_children.push(body("Node powers on, sensors begin logging, data is transmitted over WiFi or buffered locally during interruptions, the dashboard shows live temperature and humidity trends, a threshold breach triggers an alert, and the auditor retrieves the compliance report once the trip is complete."));
body_children.push(h2("6.3  User Stories"));
body_children.push(bullet("As a logistics manager, I want immediate alerts on temperature breaches so I can intervene before goods spoil."));
body_children.push(bullet("As a compliance auditor, I want an automated chain-of-custody report so I do not have to manually reconcile logs after every trip."));
body_children.push(h2("6.4  Accessibility & Localization"));
["Simple, mobile-friendly web dashboard", "Plain-language alert messages", "English language support in v1"].forEach((t) => body_children.push(bullet(t)));

// 7. Market and Competitors
startHeading(7, "Market and Competitors");
body_children.push(h2("7.1  Competitor Table"));
body_children.push(
  makeTable(
    ["Approach", "Target Users", "Key Features", "Strengths", "Weaknesses", "Our Differentiator"],
    [
      ["Enterprise cold-chain loggers (e.g. Sensitech, Controlant)", "Large logistics and pharma operators", "GPS tracking, temperature loggers, analytics", "Reliable, established, enterprise support", "Expensive, closed platform, overkill for small operators", "Low-cost, open, student-buildable hardware"],
      ["Wireless sensor platforms (e.g. Monnit)", "SMB warehouse/transport monitoring", "Wireless sensors, cloud alerts", "Easy to deploy, cloud-connected", "Ongoing subscription cost, limited on-device intelligence", "On-edge spoilage prediction, not just raw logging"],
      ["Basic USB temperature data loggers", "General users, one-off shipments", "Simple logging, USB download", "Very cheap, easy to use", "No real-time alerts, no predictive model, manual retrieval only", "Real-time alerting with predictive decay modelling"],
    ],
    [1700, 1600, 1700, 1600, 1900, 1700]
  )
);
body_children.push(h2("7.2  Positioning"));
body_children.push(body("The system positions itself as a low-cost, predictive alternative to enterprise cold-chain trackers, combining on-edge spoilage prediction with resilient offline buffering, aimed at small and mid-size logistics operators and academic prototyping rather than large industrial deployments."));

// 8. Objectives and Success Metrics
startHeading(8, "Objectives and Success Metrics");
[
  "O1: Alert latency — breach-to-notification time of 10 seconds or less by the evaluation milestone (KPI: seconds)",
  "O2: Temperature accuracy — within 0.5 degrees Celsius of a reference thermometer (KPI: deviation in degrees Celsius)",
  "O3: Battery life — at least 3 days of continuous operation on a single charge (KPI: days)",
  "O4: Data integrity — 100 percent buffer recovery after a simulated network interruption (KPI: recovery rate)",
].forEach((t) => body_children.push(bullet(t)));

// 9. Key Features
startHeading(9, "Key Features");
body_children.push(
  makeTable(
    ["Feature", "Description", "Priority", "Acceptance Criteria"],
    [
      ["Continuous Environmental Logging", "Logs temperature, humidity, and VOC levels at a configurable interval.", "Must", "GIVEN the node is powered WHEN the logging interval elapses THEN a new reading is stored locally"],
      ["Spoilage Decay Model", "Computes a shelf-life decay estimate using a simplified Arrhenius kinetic model on-device.", "Must", "GIVEN a temperature history WHEN decay is computed THEN a remaining-shelf-life estimate is produced"],
      ["Real-time Breach Alerts", "Sends a dashboard/email alert when a configured threshold is breached.", "Must", "GIVEN a threshold breach WHEN detected THEN an alert is sent within 10 seconds"],
      ["Offline Buffering", "Stores readings locally during network interruptions and syncs automatically on reconnection.", "Must", "GIVEN no network WHEN readings occur THEN they are buffered and synced without loss on reconnection"],
      ["Compliance Report", "Auto-generates a chain-of-custody report at the end of each trip.", "Should", "GIVEN a completed trip WHEN requested THEN a report is generated with the full temperature history"],
      ["Geolocation Tracking", "Records approximate location alongside environmental data.", "Could (future scope)", "GIVEN location data is available WHEN transmitted THEN it is shown on the dashboard"],
    ],
    [1900, 3400, 1300, 2600]
  )
);

// 10. Expected Outcomes
startHeading(10, "Expected Outcomes");
[
  "A functional, battery-powered sensor-node prototype for cold-chain environmental monitoring",
  "Continuous logging of temperature, humidity, and VOC levels inside a transport container",
  "A working shelf-life decay estimate based on a simplified Arrhenius model",
  "Real-time breach alerts delivered to a cloud dashboard",
  "Resilient local data buffering with automatic resync after network interruptions",
  "A web dashboard showing live environmental graphs",
  "An auto-generated chain-of-custody compliance report per trip",
].forEach((t) => body_children.push(bullet(t)));

// 11. Innovation / Novelty
startHeading(11, "Innovation / Novelty");
body_children.push(body("Most affordable cold-chain monitoring tools only log historical data for after-the-fact review, leaving operators to discover spoilage only once the shipment has already arrived damaged. This project combines low-cost sensing hardware with an on-edge, physics-based decay model to estimate spoilage risk in real time, rather than simply recording temperature history."));
body_children.push(body("The core novelty lies in bringing predictive shelf-life estimation, resilient offline buffering, and automated compliance reporting together in a single low-cost, student-buildable device, rather than relying on expensive, closed-platform industrial trackers."));

// 12. Architecture
startHeading(12, "Architecture");
body_children.push(h2("12.1  High-Level Architecture"));
body_children.push(body("The system follows a modular edge-to-cloud architecture designed to support continuous environmental sensing, resilient offline operation, and real-time predictive alerting."));
body_children.push(body("At the edge, an ESP32 microcontroller reads data from the DS18B20 (container temperature), DHT22 (ambient temperature and humidity), and MQ-135 (VOC/air quality) sensors at a configurable interval. Readings are used to compute a running shelf-life decay estimate on-device. When WiFi connectivity is available, readings are transmitted directly to the cloud backend; when it is not, readings are buffered to a local SD card and synced automatically once connectivity is restored."));
body_children.push(body("On the cloud side, a backend service ingests telemetry, stores it in a database, evaluates alert thresholds, and serves a web dashboard showing live temperature and humidity graphs. A reporting module compiles the full trip history into a chain-of-custody compliance report on request."));
body_children.push(imageCentered("/home/claude/synopsis/diagram_block.png", 560, 246));
body_children.push(caption("Figure 12.1: System Block Diagram (end-to-end data flow)"));

body_children.push(h2("12.2  Technology Stack"));
body_children.push(
  makeTable(
    ["Category", "Technology"],
    [
      ["Microcontroller Firmware", "Arduino C++ (ESP32)"],
      ["Connectivity", "WiFi (ESP32 built-in)"],
      ["Local Buffering", "SD card / EEPROM"],
      ["Backend", "Node.js / Express"],
      ["Frontend Dashboard", "React"],
      ["Database", "MySQL / SQLite"],
      ["Decay Modelling", "Simplified Arrhenius kinetic model"],
      ["Reporting", "PDF/CSV export"],
    ],
    [4000, 5900]
  )
);

body_children.push(h2("12.3  Proposed Hardware Components"));
body_children.push(
  makeTable(
    ["Component", "Purpose"],
    [
      ["ESP32 DevKit", "Main microcontroller: WiFi, ADC, sleep modes"],
      ["DS18B20", "Precise container temperature sensing"],
      ["DHT22", "Ambient temperature and humidity sensing"],
      ["MQ-135", "VOC / spoilage gas detection"],
      ["MicroSD Card Module", "Local data buffering during network interruptions"],
      ["TP4056 Module", "Li-ion battery charging and protection"],
      ["18650 Li-ion Battery", "Portable power source"],
      ["Boost Converter", "Stable regulated voltage supply"],
      ["Status LED / Buzzer", "Local visual and audible alert"],
    ],
    [4000, 5900]
  )
);

body_children.push(h2("12.4  Estimated Hardware Cost (Prototype BOM)"));
body_children.push(
  makeTable(
    ["Component", "Approx. Qty", "Approx. Cost (INR)"],
    [
      ["ESP32 DevKit", "1", "350 - 500"],
      ["DS18B20", "1", "100 - 150"],
      ["DHT22", "1", "250 - 350"],
      ["MQ-135", "1", "150 - 250"],
      ["MicroSD Card Module + Card", "1", "200 - 300"],
      ["TP4056 Module", "1", "50 - 100"],
      ["18650 Li-ion Battery", "2", "300 - 500"],
      ["Boost Converter", "1", "80 - 150"],
      ["LED / Buzzer / Resistors", "-", "50 - 100"],
      ["Breadboard, Enclosure, Wires", "-", "300 - 500"],
      ["Total (approx.)", "-", "1,800 - 2,900"],
    ],
    [4900, 2000, 3000]
  )
);
body_children.push(
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 120, after: 120 },
    children: [new TextRun({ text: "Figures are indicative and will be refined once components are finalised; this keeps the prototype well within a typical academic mini-project budget.", italics: true, size: 20, color: GREY, font: FONT })],
  })
);

body_children.push(h2("12.5  Firmware and Decay-Model Workflow"));
body_children.push(body("The end-to-end firmware workflow proceeds as follows: the node wakes from sleep, reads all three sensors, appends the reading to the running decay calculation, checks the result against configured thresholds, attempts transmission over WiFi (falling back to local buffering if unavailable), and returns to low-power sleep until the next logging interval."));
body_children.push(imageCentered("/home/claude/synopsis/diagram_firmware.png", 380, 570));
body_children.push(caption("Figure 12.5: Firmware and Decay-Model Workflow Flowchart"));

// 13. Data Design
startHeading(13, "Data Design");
body_children.push(h2("13.1  Core Entities"));
["SensorNode", "Trip", "Reading", "AlertEvent", "ComplianceReport"].forEach((t) => body_children.push(bullet(t)));
body_children.push(body("Trip and reading data are stored digitally with timestamps to support later review and compliance reporting."));
body_children.push(h2("13.2  Data Dictionary"));
body_children.push(
  makeTable(
    ["Entity", "Field", "Type", "Notes"],
    [
      ["SensorNode", "nodeId", "UUID", "Primary key"],
      ["Trip", "status", "Enum", "Active / Completed"],
      ["Reading", "temperature", "Decimal", "DS18B20 reading, degrees Celsius"],
      ["Reading", "humidity", "Decimal", "DHT22 reading, percent"],
      ["Reading", "voc", "Integer", "MQ-135 raw ADC value"],
      ["AlertEvent", "severity", "Enum", "Low / Medium / High"],
    ],
    [1800, 1800, 1400, 4900]
  )
);
body_children.push(h2("13.3  Privacy, Retention, Backup, and DR"));
[
  "No personally identifiable information is required for sensor readings themselves",
  "Trip and alert data retained for the duration of the academic project; archival policy to be defined for production use",
  "Nightly backups recommended once deployed beyond prototype stage",
].forEach((t) => body_children.push(bullet(t)));

// 14. Technical Workflow Diagrams
startHeading(14, "Technical Workflow Diagrams");
body_children.push(body("The following diagrams are recommended for inclusion in the final report and presentation, to explain system behaviour to the panel:"));
[
  "System Block Diagram (end-to-end data flow from sensor to dashboard)",
  "Firmware State Transition Diagram (sleep, sensing, transmit/buffer, alert)",
  "Use Case Diagram (Logistics Manager, Auditor, Sensor Node)",
  "Data Flow Diagram (Level 0) — shown below",
  "Entity Relationship Diagram (ERD)",
].forEach((t) => body_children.push(bullet(t)));
body_children.push(imageCentered("/home/claude/synopsis/diagram_dfd.png", 560, 176));
body_children.push(caption("Figure 14: Data Flow Diagram (Level 0)"));

// 15. Quality: NFRs and Testing
startHeading(15, "Quality: NFRs and Testing");
body_children.push(h2("15.1  Non-functional Requirements"));
body_children.push(
  makeTable(
    ["Metric", "Target", "Measurement"],
    [
      ["Alert latency", "10 seconds or less", "Firmware and backend timestamp difference"],
      ["Temperature accuracy", "Within 0.5 degrees Celsius", "Bench test against a reference thermometer"],
      ["Battery life", "3 days or more continuous", "Bench discharge test"],
      ["Data integrity", "100 percent buffer recovery", "Simulated network interruption test"],
      ["Dashboard availability", "99 percent or higher", "Uptime monitor"],
    ],
    [2600, 2900, 4400]
  )
);
body_children.push(h2("15.2  Test Plan"));
body_children.push(
  makeTable(
    ["Area", "Type", "Owner", "Approach"],
    [
      ["Firmware & Sensing", "Bench testing", "Ansh Yadav", "Multimeter and serial log verification of readings and power draw"],
      ["Connectivity & Buffering", "Field testing", "Ansh Yadav", "Live WiFi disconnect/reconnect tests, buffer recovery check"],
      ["Dashboard & Alerts", "Functional testing", "Piyush Singh Tomar", "Manual and API-level checks of all endpoints and alert flows"],
      ["Calibration", "Accuracy testing", "Charu Khandelwal", "Compare sensor readings against reference thermometer/hygrometer"],
    ],
    [2100, 1700, 1900, 4200]
  )
);
body_children.push(h2("15.3  Environments"));
body_children.push(body("Development → Bench Testing → Field Trial"));

// 16. Security and Compliance
startHeading(16, "Security and Compliance");
body_children.push(h2("16.1  Data Handling"));
[
  "Telemetry and trip data stored locally / on the project database",
  "Dashboard access restricted to the project team and mentor during development",
  "Basic email-password authentication for dashboard access",
].forEach((t) => body_children.push(bullet(t)));
body_children.push(h2("16.2  Compliance"));
body_children.push(body("Academic project; follows institute policy; no third-party data sharing."));

// 17. Delivery and Operations
startHeading(17, "Delivery and Operations");
body_children.push(h2("17.1  Release Plan"));
body_children.push(body("Prototype demo and dashboard walkthrough at project submission, with incremental feature rollout across the 8-week timeline."));
body_children.push(h2("17.2  Communication Plan"));
body_children.push(body("Regular team sync and weekly status update to the mentor, Prof. Yunis Ahmad Lone; demonstration at the end of each major milestone."));

// 18. Risks and Mitigations
startHeading(18, "Risks and Mitigations");
body_children.push(
  makeTable(
    ["Risk", "Probability", "Impact", "Mitigation", "Owner"],
    [
      ["Battery drain on multi-day trips", "Medium", "High", "Aggressive sleep cycles, larger battery capacity", "Ansh Yadav"],
      ["Network interruption causing data loss", "Medium", "High", "SD/EEPROM buffering with automatic resync", "Ansh Yadav"],
      ["Sensor drift / calibration error", "Medium", "Medium", "Periodic calibration against a reference instrument", "Charu Khandelwal"],
      ["Schedule slip within the 8-week timeline", "Medium", "High", "Weekly milestones, scope freeze on core features", "Charu Khandelwal"],
    ],
    [2500, 1300, 1100, 2900, 1100]
  )
);

// 19. Research and Evaluation
startHeading(19, "Research and Evaluation");
body_children.push(h2("19.1  Literature Review / Study of Existing Approaches"));
body_children.push(body("Enterprise platforms such as Sensitech, Monnit, and Controlant offer robust cold-chain tracking but are expensive and closed-platform, making them inaccessible to small and mid-size logistics operators. Most affordable alternatives only log data for post-trip review rather than predicting spoilage risk in real time. This gap motivated the design of a low-cost, predictive sensor-node system:"));
body_children.push(
  makeTable(
    ["Manual / Basic Logging (Traditional)", "Proposed System (This Project)"],
    [
      ["USB data logger, reviewed after the trip", "Real-time dashboard with live monitoring"],
      ["No predictive spoilage estimate", "On-edge shelf-life decay estimate"],
      ["Data lost if device is not retrieved on time", "Local buffering with automatic cloud sync"],
      ["Manual, informal record-keeping", "Automated, timestamped compliance report"],
    ],
    [4450, 4450]
  )
);
body_children.push(h2("19.2  Evaluation Using Reference Data"));
body_children.push(body("The decay model will be validated against published food-spoilage kinetics data and simulated temperature-abuse scenarios, for example:"));
body_children.push(
  makeTable(
    ["Sustained Temperature Excursion", "Predicted Remaining Shelf Life"],
    [
      ["2 degrees C above threshold for 1 hour", "Reduced by approximately 10 percent"],
      ["5 degrees C above threshold for 1 hour", "Reduced by approximately 30 percent"],
      ["8 degrees C above threshold for 1 hour", "Reduced by approximately 55 percent"],
    ],
    [4450, 4450]
  )
);
body_children.push(h2("19.3  User Feedback"));
body_children.push(body("Mentor and peer feedback will be collected on alert clarity, dashboard usability, and report format, guiding improvements to the detection and alerting logic."));
body_children.push(h2("19.4  KPI Tracking"));
body_children.push(body("Key metrics tracked include alert latency, temperature accuracy, battery life, data-loss rate during network interruptions, and dashboard uptime, monitored continuously to guide iteration."));

// 20. Appendices
startHeading(20, "Appendices");
body_children.push(h2("20.1  Glossary"));
[
  "IoT: Internet of Things, a network of connected physical devices.",
  "VOC: Volatile Organic Compound, a gas indicator of spoilage or decay.",
  "Arrhenius model: A kinetic model relating reaction (decay) rate to temperature.",
  "KPI: A metric used to measure performance.",
  "SLO: A target service performance level.",
].forEach((t) => body_children.push(bullet(t)));
body_children.push(h2("20.2  References"));
[
  "Espressif ESP32 Documentation — https://docs.espressif.com",
  "Adafruit DHT22 / DS18B20 Guides — https://www.adafruit.com",
  "Arduino Documentation — https://www.arduino.cc",
  "MDN Web Docs — https://developer.mozilla.org",
  "IEEE: \u201cIoT-Based Cold Chain Monitoring Systems\u201d — https://ieeexplore.ieee.org",
  "Springer: \u201cArrhenius Kinetics in Food Spoilage Prediction\u201d — https://link.springer.com",
].forEach((t) => body_children.push(bullet(t)));

// ============================================================
// DOCUMENT ASSEMBLY
// ============================================================

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "main-bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u25CF",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 450, hanging: 260 } }, run: { color: GREEN_DARK } },
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 900, hanging: 260 } }, run: { color: GREEN } },
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: 22, color: TEXT } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1080, bottom: 1080, left: 1200, right: 1200 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: { bottom: { color: BORDER_COLOR, space: 4, style: BorderStyle.SINGLE, size: 4 } },
              children: [
                new TextRun({ text: "IoT Smart Cold Chain Temperature & Spoilage Monitor  |  Project Synopsis", size: 16, color: GREY, italics: true, font: FONT }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", size: 18, color: GREY, font: FONT }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GREY, font: FONT }),
                new TextRun({ text: " of ", size: 18, color: GREY, font: FONT }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: GREY, font: FONT }),
              ],
            }),
          ],
        }),
      },
      children: [...coverChildren, ...body_children],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const outputPath = `${__dirname}/output.docx`;
  fs.writeFileSync(outputPath, buf);
  console.log(`written: ${outputPath}`);
});